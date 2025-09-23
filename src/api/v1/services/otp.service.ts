import { OTP_VALIDITY_MIN } from "../../../config/constants.js";
import { dataSource } from "../../../config/database.config.js";
import { OtpEntity } from "../entities/otp.entity.js";
import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";
import { Otp } from "../interfaces/otp.interface.js";
import * as otpGenerator from 'otp-generator';

export default class OtpService {
    public async getOtp(ref: string, otpRefType: OtpRefTypes): Promise<Otp> {
        const repository = dataSource.getRepository(OtpEntity);

        // 1. Check if there's an existing valid OTP
        const existingOtp = await repository.findOne({
            where: {
                otpRef: ref,
                otpRefType,
                isUsed: false,
            },
            order: { createdAt: "DESC" }, // get latest
        });

        if (existingOtp && existingOtp.expirationDate >= new Date()) {
            // Return the existing valid OTP without generating a new one
            return existingOtp;
        }

        // 2. No valid OTP found → generate a new one
        const otp = this.generateOtp();
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + OTP_VALIDITY_MIN);

        const otpRecord: Otp = await repository.save({
            otpRef: ref,
            otp,
            otpRefType,
            expirationDate,
            isUsed: false,
        });

        return otpRecord;
    }

    // public async isValidOtp(ref: string, otp: string): Promise<boolean> {
    //     const otpRecord: Otp | null = await dataSource.getRepository(OtpEntity).findOne({
    //         where: {
    //             otpRef: ref,
    //             isUsed: false,
    //             otp, // Match the OTP provided by the user
    //         },
    //     });

    //     // Check for existence and expiration
    //     if (!otpRecord || otpRecord.expirationDate < new Date()) {
    //         return false; // OTP is invalid or expired
    //     }

    //     // Mark OTP as used
    //     otpRecord.isUsed = true;
    //     await dataSource.getRepository(OtpEntity).save(otpRecord); // Save updated OTP record
    //     return true;
    // }

    public async isValidOtp(ref: string, otp: string): Promise<boolean> {
        let otpRecord: Otp = await dataSource.getRepository(OtpEntity).findOne({ where: { otpRef: ref, isUsed: false, otp } });

        if (!otpRecord) {
            return false
        }

        // check validity
        if (otpRecord.expirationDate >= new Date()) {
            return true;
        }
        return false;
    }


    public generateOtp(): string {
        return otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    }

    public async invalidateOtp(ref: string): Promise<void> {
        const repository = dataSource.getRepository(OtpEntity);
        const otpRecord: Otp = await repository.findOne({ where: { otpRef: ref } });
        if (otpRecord) {
            otpRecord.isUsed = true;
            await repository.save(otpRecord);
        }
    }
}
