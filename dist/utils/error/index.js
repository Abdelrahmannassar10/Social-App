"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ConflictException = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class NotAuthorizedException extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.NotAuthorizedException = NotAuthorizedException;
