import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interface";
import { Gender, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
export const userSchema = new Schema<IUser>({
    lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
    firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: function () {
            if (this.userAgent == USER_AGENT.google) {
                return false;
            } else {
                return true;
            }
        },
    },
    role: { type: String, enum: SYS_ROLE, default: SYS_ROLE.USER },
    otp: { type: String },
    otpExpiryAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phoneNumber: { type: String },
    gender: { type: String, enum: Gender },
    dob: { type: Date },
    userAgent: { type: String, enum: USER_AGENT, default: USER_AGENT.local }
}, { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}});
userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const { firstName, lastName } = value.split(" ");
    this.firstName = firstName as string;
    this.lastName = lastName as string;
})
