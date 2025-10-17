"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.ForbiddenException = exports.UnAuthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ConflictException = exports.AppError = void 0;
const token_1 = require("../token");
const token_repository_1 = require("../../DB/model/token/token.repository");
const common_1 = require("../common");
class AppError extends Error {
    statusCode;
    errorDetails;
    constructor(message, statusCode, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message, errorDetails) {
        super(message, 409, errorDetails);
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends AppError {
    constructor(message, errorDetails) {
        super(message, 400, errorDetails);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends AppError {
    constructor(message, errorDetails) {
        super(message, 404, errorDetails);
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends AppError {
    constructor(message, errorDetails) {
        super(message, 401, errorDetails);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ForbiddenException extends AppError {
    constructor(message, errorDetails) {
        super(message, 403, errorDetails);
    }
}
exports.ForbiddenException = ForbiddenException;
const globalErrorHandler = async (error, req, res, next) => {
    try {
        // Normalize error message
        console.log("here");
        const message = (error.message || "").toLowerCase();
        console.log("here");
        if (message.includes("jwt expired")) {
            // ✅ Express lowercases all header names automatically
            console.log("here");
            const headerValue = req.headers["refresh-token"];
            console.log(headerValue);
            // Support "Bearer <token>" or raw token
            const refreshToken = headerValue?.startsWith("Bearer ")
                ? headerValue.split(" ")[1]
                : headerValue;
            if (!refreshToken) {
                return res.status(401).json({
                    message: "Missing refresh token",
                    success: false,
                });
            }
            const payload = (0, token_1.verifyToken)(refreshToken);
            const tokenRepository = new token_repository_1.TokenRepository();
            // Delete old refresh token entry
            const tokenExist = await tokenRepository.findOneAndDelete({
                token: refreshToken,
                userId: payload.id,
                type: common_1.TOKEN_TYPE.refreshToken,
            });
            if (!tokenExist) {
                return res.status(409).json({
                    message: "Invalid refresh token",
                    success: false,
                });
            }
            // Generate new tokens
            const accessToken = (0, token_1.generateToken)({
                payload: { id: payload.id, role: payload.role },
                options: { expiresIn: "5m" },
            });
            const newRefreshToken = (0, token_1.generateToken)({
                payload: { id: payload.id, role: payload.role },
                options: { expiresIn: "7d" },
            });
            await tokenRepository.create({
                token: newRefreshToken,
                userId: payload.id,
                type: common_1.TOKEN_TYPE.refreshToken,
            });
            return res.status(200).json({
                message: "Refresh successful",
                success: true,
                data: { accessToken, refreshToken: newRefreshToken },
            });
        }
        // Handle all other errors
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            success: false,
            errorDetails: error.errorDetails || null,
            stack: error.stack,
        });
    }
    catch (err) {
        console.error("Error in globalErrorHandler:", err);
        res.status(500).json({
            message: err.message || "Something went wrong in global error handler",
            success: false,
            stack: error.stack,
        });
    }
};
exports.globalErrorHandler = globalErrorHandler;
