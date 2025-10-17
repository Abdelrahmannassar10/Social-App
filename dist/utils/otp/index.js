"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.generateOTPExpiry = generateOTPExpiry;
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return Number(otp);
}
function generateOTPExpiry(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}
