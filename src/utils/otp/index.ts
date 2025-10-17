export function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return Number(otp);
}
export function generateOTPExpiry(minutes: number): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}