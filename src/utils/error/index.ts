import { NextFunction, Request, Response } from "express";
import { generateToken, verifyToken } from "../token";
import { TokenRepository } from "../../DB/model/token/token.repository";
import { TOKEN_TYPE } from "../common";
import { string } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorDetails?: Record<string, any>[]
  ) {
    super(message);
  }
}
export class ConflictException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 409, errorDetails);
  }
}
export class BadRequestException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 400, errorDetails);
  }
}
export class NotFoundException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 404, errorDetails);
  }
}
export class UnAuthorizedException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 401, errorDetails);
  }
}
export class ForbiddenException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 403, errorDetails);
  }
}
export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Normalize error message
    console.log("here");

    const message = (error.message || "").toLowerCase();
    console.log("here");

    if (message.includes("jwt expired")) {
      // ✅ Express lowercases all header names automatically
      console.log("here");

      const headerValue = req.headers["refresh-token"] as string | undefined;
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

      const payload = verifyToken(refreshToken);
      const tokenRepository = new TokenRepository();

      // Delete old refresh token entry
      const tokenExist = await tokenRepository.findOneAndDelete({
        token: refreshToken,
        userId: payload.id,
        type: TOKEN_TYPE.refreshToken,
      });

      if (!tokenExist) {
        return res.status(409).json({
          message: "Invalid refresh token",
          success: false,
        });
      }

      // Generate new tokens
      const accessToken = generateToken({
        payload: { id: payload.id, role: payload.role },
        options: { expiresIn: "5m" },
      });

      const newRefreshToken = generateToken({
        payload: { id: payload.id, role: payload.role },
        options: { expiresIn: "7d" },
      });

      await tokenRepository.create({
        token: newRefreshToken,
        userId: payload.id,
        type: TOKEN_TYPE.refreshToken,
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
  } catch (err: any) {
    console.error("Error in globalErrorHandler:", err);
    res.status(500).json({
      message: err.message || "Something went wrong in global error handler",
      success: false,
      stack: error.stack,
    });
  }
};
