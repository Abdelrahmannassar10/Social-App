"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
const token_1 = require("../../utils/token");
const auth_provider_1 = require("./provider/auth.provider");
const email_1 = require("../../utils/email");
const dev_config_1 = require("../../config/env/dev.config");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res) => {
        const registerDTO = req.body;
        console.log("here");
        const userExist = await this.userRepository.getOne({
            email: registerDTO.email,
        });
        console.log("here");
        if (userExist) {
            throw new utils_1.ConflictException("User already exist");
        }
        const user = await this.authFactoryService.register(registerDTO);
        console.log("here");
        console.log(user);
        const createdUser = await this.userRepository.create(user);
        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: { id: createdUser.id },
        });
    };
    login = async (req, res) => {
        const loginDTO = req.body;
        const userExist = await this.userRepository.exist({
            email: loginDTO.email,
        });
        if (!userExist) {
            throw new utils_1.ForbiddenException("invalid credentials");
        }
        if (!(await (0, utils_2.compareHash)(loginDTO.password, userExist.password))) {
            throw new utils_1.ForbiddenException("invalid credentials");
        }
        ;
        if (userExist.isVerified == false) {
            throw new utils_1.ForbiddenException("user isn`t verified");
        }
        ;
        console.log(userExist.isTwoStepEnable);
        if (!userExist.isTwoStepEnable) {
            const accessToken = (0, token_1.generateToken)({
                payload: { _id: userExist._id, role: userExist.role },
                options: { expiresIn: "1d" },
            });
            return res.status(200).json({
                message: "login successfully",
                success: true,
                data: { accessToken },
            });
        }
        ;
        const otp = (0, utils_1.generateOTP)();
        const otpExpiryAt = (0, utils_1.generateOTPExpiry)(15);
        //save otp and otpExpiryAt in db
        await this.userRepository.update({ _id: userExist._id }, { otp, otpExpiryAt });
        await (0, email_1.sendMail)({
            to: userExist.email,
            subject: "Login OTP",
            html: dev_config_1.devConfig.OTP_Body(otp.toString())
        });
        res.status(200).json({
            message: "OTP sent to your email",
            success: true,
        });
    };
    verifyAccount = async (req, res) => {
        const verifyAccountDTO = req.body;
        console.log("here");
        // console.log(verifyAccountDTO);
        const user = await auth_provider_1.AuthProvider.checkOTP(verifyAccountDTO);
        console.log("here");
        await this.userRepository.update({ email: verifyAccountDTO.email }, { isVerified: true, $unset: { otp: "", otpExpiryAt: "" } });
        console.log("here");
        return res.sendStatus(204);
    };
    updatePassword = async (req, res) => {
        const UpdatePasswordDTO = req.body;
        const userExist = await this.userRepository.getOne({
            email: UpdatePasswordDTO.email,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("user not founded");
        }
        if (userExist._id.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not allowed to update the password");
        }
        if (await (0, utils_2.compareHash)(UpdatePasswordDTO.password, userExist.password)) {
            throw new utils_1.BadRequestException("it is the same as the old password");
        }
        await this.userRepository.update({ email: UpdatePasswordDTO.email }, { password: await (0, utils_1.generateHash)(UpdatePasswordDTO.password) });
        res
            .status(200)
            .json({ message: "password Updated successfully", success: true });
    };
    updateInfo = async (req, res) => {
        const updateInfoDTO = req.body;
        const userExist = await this.userRepository.getOne({
            _id: req.user._id,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("user not founded ");
        }
        ;
        if (userExist._id.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not allowed to update info");
        }
        if (updateInfoDTO.password) {
            if (await (0, utils_2.compareHash)(updateInfoDTO.password, userExist.password)) {
                throw new utils_1.BadRequestException("it is the same as the old password");
            }
        }
        const userFactory = this.authFactoryService.update(updateInfoDTO, userExist);
        const createdUser = await this.userRepository.update({ _id: req.user._id }, { $set: userFactory });
        res.status(200).json({
            message: "info Updated successfully",
            success: true,
            data: createdUser,
        });
    };
    updateEmail = async (req, res) => {
        const updateEmailDTO = req.body;
        const userExist = await this.userRepository.getOne({
            email: updateEmailDTO.email,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("user not founded ");
        }
        ;
        await this.userRepository.update({ _id: req.user._id }, { email: updateEmailDTO.newEmail });
        res.status(200).json({
            message: "email Updated successfully",
            success: true,
            newEmail: updateEmailDTO.newEmail
        });
    };
    enableTwoSteps = async (req, res) => {
        const otp = (0, utils_1.generateOTP)();
        const otpExpiryAt = (0, utils_1.generateOTPExpiry)(15);
        //this step to get email to send otp
        const user = await this.userRepository.getOne({ _id: req.user._id });
        await this.userRepository.update({ _id: req.user._id }, { otp: otp, otpExpiryAt: otpExpiryAt });
        await (0, email_1.sendMail)({
            to: user.email,
            subject: "Enable Two-Step Verification",
            html: dev_config_1.devConfig.OTP_Body(otp.toString())
        });
        res.status(200).json({ message: "OTP sent to your email for enabling 2-step verification", success: true });
    };
    verifyTwoStep = async (req, res) => {
        const verifyAccountDTO = req.body;
        await auth_provider_1.AuthProvider.checkOTP(verifyAccountDTO);
        await this.userRepository.update({ email: verifyAccountDTO.email }, { isTwoStepEnable: true, $unset: { otp: "", otpExpiryAt: "" } });
        return res.status(200).json({ message: "2-step verification enabled successfully", success: true });
    };
    confirmTwoStep = async (req, res) => {
        const verifyAccountDTO = req.body;
        const user = await auth_provider_1.AuthProvider.checkOTP(verifyAccountDTO);
        const accessToken = (0, token_1.generateToken)({
            payload: { _id: user._id, role: user.role },
            options: { expiresIn: "1d" },
        });
        return res.status(200).json({ message: "2-step verification enabled successfully", success: true, data: { accessToken } });
    };
}
exports.default = new AuthService();
