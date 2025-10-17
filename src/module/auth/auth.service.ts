import { Request, Response } from "express";
import {
  LoginDTO,
  RegisterDTO,
  ReplaceEmailDTO,
  UpdateEmailDTO,
  UpdateInfoDTO,
  UpdatePasswordDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  generateHash,
  generateOTP,
  generateOTPExpiry,
  NotFoundException,
  TOKEN_TYPE,
  UnAuthorizedException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils";
import { generateToken } from "../../utils/token";
import { AuthProvider } from "./provider/auth.provider";
import { sendMail } from "../../utils/email";
import { devConfig } from "../../config/env/dev.config";
import { TokenRepository } from "../../DB/model/token/token.repository";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  private tokenRepository = new TokenRepository();
  constructor() {}
  register = async (req: Request, res: Response) => {
    const registerDTO: RegisterDTO = req.body;

    console.log("here");

    const userExist = await this.userRepository.getOne({
      email: registerDTO.email,
    });

    if (userExist) {
      throw new ConflictException("User already exist");
    }
    const user = await this.authFactoryService.register(registerDTO);
    console.log(user);
    const createdUser = await this.userRepository.create(user);
    console.log(createdUser);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { id: createdUser.id },
    });
  };
  login = async (req: Request, res: Response) => {
    const loginDTO: LoginDTO = req.body;
    const userExist = await this.userRepository.exist({
      email: loginDTO.email,
    });
    if (!userExist) {
      throw new ForbiddenException("invalid credentials");
    }
    if (!(await compareHash(loginDTO.password, userExist.password))) {
      throw new ForbiddenException("invalid credentials");
    }
    if (userExist.isVerified == false) {
      throw new ForbiddenException("user isn`t verified");
    }
    console.log(userExist.isTwoStepEnable);

    if (!userExist.isTwoStepEnable) {
      const accessToken = generateToken({
        payload: { id: userExist._id, role: userExist.role },
        options: { expiresIn: "5m" },
      });
      const refreshToken = generateToken({
        payload: { id: userExist._id, role: userExist.role },
        options: { expiresIn: "1d" },
      });
      await this.tokenRepository.create({
        token: refreshToken,
        userId: userExist.id,
        type: TOKEN_TYPE.refreshToken,
      });
      
      
      return res.status(200).json({
        message: "login successfully",
        success: true,
        data: { accessToken, refreshToken , userExist},
      });
    }
    const otp = generateOTP();
    const otpExpiryAt = generateOTPExpiry(15);
    //save otp and otpExpiryAt in db
    await this.userRepository.update(
      { _id: userExist._id },
      { otp, otpExpiryAt }
    );
    await sendMail({
      to: userExist.email,
      subject: "Login OTP",
      html: devConfig.OTP_Body(otp.toString()),
    });
    res.status(200).json({
      message: "OTP sent to your email",
      success: true,
    });
  };
  verifyAccount = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    console.log("here");

    // console.log(verifyAccountDTO);
    const user = await AuthProvider.checkOTP(verifyAccountDTO);
    console.log("here");

    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      { isVerified: true, $unset: { otp: "", otpExpiryAt: "" } }
    );
    console.log("here");

    return res.sendStatus(204);
  };
  updatePassword = async (req: Request, res: Response) => {
    const UpdatePasswordDTO: UpdatePasswordDTO = req.body;
    const userExist = await this.userRepository.getOne({
      email: UpdatePasswordDTO.email,
    });
    if (!userExist) {
      throw new NotFoundException("user not founded");
    }
    if (userExist._id.toString() != req.user._id.toString()) {
      throw new UnAuthorizedException(
        "you are not allowed to update the password"
      );
    }
    if (await compareHash(UpdatePasswordDTO.password, userExist.password)) {
      throw new BadRequestException("it is the same as the old password");
    }
    await this.userRepository.update(
      { email: UpdatePasswordDTO.email },
      { password: await generateHash(UpdatePasswordDTO.password) }
    );
    res
      .status(200)
      .json({ message: "password Updated successfully", success: true });
  };
  updateInfo = async (req: Request, res: Response) => {
    const updateInfoDTO: UpdateInfoDTO = req.body;
    const userExist = await this.userRepository.getOne({
      _id: req.user._id,
    });
    if (!userExist) {
      throw new NotFoundException("user not founded ");
    }
    if (userExist._id.toString() != req.user._id.toString()) {
      throw new UnAuthorizedException("you are not allowed to update info");
    }
    if (updateInfoDTO.password) {
      if (await compareHash(updateInfoDTO.password, userExist.password)) {
        throw new BadRequestException("it is the same as the old password");
      }
    }
    const userFactory = this.authFactoryService.update(
      updateInfoDTO,
      userExist
    );
    const createdUser = await this.userRepository.update(
      { _id: req.user._id },
      { $set: userFactory }
    );
    res.status(200).json({
      message: "info Updated successfully",
      success: true,
      data: createdUser,
    });
  };
  updateEmail = async (req: Request, res: Response) => {
    const updateEmailDTO: UpdateEmailDTO = req.body;
    const userExist = await this.userRepository.getOne({ _id: req.user.id });
    if (!userExist) {
      throw new NotFoundException("user not founded ");
    }

    console.log(userExist, updateEmailDTO);

    if (updateEmailDTO.newEmail == userExist.email) {
      throw new BadRequestException("you have sent the same email");
    }
    const oldEmailOTP = generateOTP();
    const newEmailOTP = generateOTP();
    await sendMail({
      to: userExist.email,
      subject: "request to change email",
      html: devConfig.OLD_EMAIL_BODY(oldEmailOTP),
    });
    await sendMail({
      to: updateEmailDTO.newEmail,
      subject: "verify email",
      html: devConfig.NEW_EMAIL_BODY(newEmailOTP),
    });
    const hashedOldOTP = await generateHash(oldEmailOTP.toString());
    const hashedNewOTP = await generateHash(newEmailOTP.toString());
    await this.userRepository.update(
      { _id: req.user.id },
      {
        $set: {
          tempEmail: updateEmailDTO.newEmail,
          oldEmailOTP: await generateHash(hashedOldOTP),
          newEmailOTP: await generateHash(hashedNewOTP),
        },
      }
    );
    res.status(200).json({
      message: "code has been send to emails successfully",
      success: true,
    });
  };
  enableTwoSteps = async (req: Request, res: Response) => {
    const otp = generateOTP();
    const otpExpiryAt = generateOTPExpiry(15);
    //this step to get email to send otp
    const user = await this.userRepository.getOne({ _id: req.user._id });
    await this.userRepository.update(
      { _id: req.user._id },
      { otp: otp, otpExpiryAt: otpExpiryAt }
    );
    await sendMail({
      to: user.email,
      subject: "Enable Two-Step Verification",
      html: devConfig.OTP_Body(otp.toString()),
    });
    res.status(200).json({
      message: "OTP sent to your email for enabling 2-step verification",
      success: true,
    });
  };
  verifyTwoStep = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    await AuthProvider.checkOTP(verifyAccountDTO);
    await this.userRepository.update(
      { email: verifyAccountDTO.email },
      { isTwoStepEnable: true, $unset: { otp: "", otpExpiryAt: "" } }
    );
    return res.status(200).json({
      message: "2-step verification enabled successfully",
      success: true,
    });
  };
  confirmTwoStep = async (req: Request, res: Response) => {
    const verifyAccountDTO: VerifyAccountDTO = req.body;
    const user = await AuthProvider.checkOTP(verifyAccountDTO);
    const accessToken = generateToken({
      payload: { _id: user._id, role: user.role },
      options: { expiresIn: "1d" },
    });
    return res.status(200).json({
      message: "2-step verification enabled successfully",
      success: true,
      data: { accessToken },
    });
  };
  replaceEmail = async (req: Request, res: Response) => {
    const replaceEmailDTO: ReplaceEmailDTO = req.body;
    if (!req.user.tempEmail) {
      throw new NotFoundException("new email not founded");
    }
    const oldEmailOTPMatch = compareHash(
      replaceEmailDTO.oldEmailCode.toString(),
      req.user.oldEmailOTP.toString()
    );
    const newEmailOTPMatch = compareHash(
      replaceEmailDTO.newEmailCode.toString(),
      req.user.newEmailOTP.toString()
    );
    if (!(oldEmailOTPMatch && newEmailOTPMatch)) {
      throw new BadRequestException("invalid credentials");
    }
    await this.userRepository.update(
      { _id: req.user._id },
      {
        $set: {
          email: req.user.tempEmail,
        },
        $unset: { oldEmailOTP: "", newEmailOTP: "", tempEmail: "" },
      }
    );
    res
      .status(200)
      .json({ message: "email changed successfully", success: true });
  };
}
export default new AuthService();
