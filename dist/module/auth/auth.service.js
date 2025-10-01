"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
const token_1 = require("../../utils/token");
const auth_provider_1 = require("./provider/auth.provider");
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
        ;
        if (!(await (0, utils_2.compareHash)(loginDTO.password, userExist.password))) {
            throw new utils_1.ForbiddenException("invalid credentials");
        }
        ;
        console.log(userExist.isVerified);
        if (userExist.isVerified == false) {
            throw new utils_1.ForbiddenException("user isn`t verified");
        }
        const accessToken = (0, token_1.generateToken)({
            payload: { _id: userExist._id, role: userExist.role },
            options: { expiresIn: "1d" },
        });
        res.status(200).json({
            message: "login successfully",
            success: true,
            data: { accessToken },
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
}
exports.default = new AuthService();
