import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interface";
import { Gender, SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { sendMail } from "../../../utils/email";
import { devConfig } from "../../../config/env/dev.config";
export const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.userAgent == USER_AGENT.google) {
          return false;
        } else {
          return true;
        }
      },
    },
    role: {
      type: Number,
      enum: SYS_ROLE,
      default: SYS_ROLE.USER,
    },
    otp: { type: Number },
    otpExpiryAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    credentialUpdatedAt: { type: Date, default: Date.now },
    phoneNumber: { type: String },
    gender: {
      type: Number,
      enum: Gender,
    },
    dob: { type: Date },
    userAgent: {
      type: Number,
      enum: USER_AGENT,
      default: USER_AGENT.local,
    },
    isTwoStepEnable:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// userSchema
//   .virtual("fullName")
//   .get(function () {
//     return this.firstName + " " + this.lastName;
//   })
// userSchema.virtual("fullName").set(function (value) {
//     const { firstName, lastName } = value.split(" ");
//     this.firstName = firstName as string;
//     this.lastName = lastName as string;
//   });
userSchema.pre("save", async function (next) {
  if (this.userAgent !== USER_AGENT.google || this.isNew == true) {
    await sendMail({
      to: this.email,
      subject: "Welcome to Social App",
      html: devConfig.OTP_Body(this.otp.toString()),
    });
  }
  next();
});
