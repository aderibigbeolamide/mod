import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";

export interface Otp {
    otpRef: string,
    otp: string,
    otpRefType: OtpRefTypes,
    expirationDate: Date,
    isUsed: boolean,
}