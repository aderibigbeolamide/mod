import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import validator from "class-validator";
import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";
import {
  ERROR_CODE_OTP_001,
  ERROR_CODE_OTP_002,
  ERROR_CODE_OTP_003,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from "../../../config/constants.js";
import { HttpException } from "../exceptions/http.exception.js";
import { Otp } from "../interfaces/otp.interface.js";
import OtpService from "../services/otp.service.js";
import Utility from "../../../utils/utility.js";
import AuthService from "../services/auth.service.js";
import CommService from "../services/comm.service.js";

const OtpController = {
  async generateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email: string = String(req.query.email);
      const type: string = String(req.query.type);
      let phoneNumber: string = String(req.query.phoneNumber);
      phoneNumber = phoneNumber.replace(" ", "+"); // Replace spaces with '+'

      if (!validator.isString(type) || !Object.keys(OtpRefTypes).includes(type)) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "type (EMAIL OR PHONE_NUMBER) and phoneNumber or email fields are required",
            ERROR_CODE_OTP_001
          )
        );
      }

      let ref: string;
      if (type === OtpRefTypes.EMAIL.toString()) {
        if (!validator.isEmail(email)) {
          return next(new HttpException(400, STATUS_FAIL, "email is invalid", ERROR_CODE_OTP_001));
        }
        ref = email;
      } else {
        if (!validator.isPhoneNumber(phoneNumber)) {
          return next(
            new HttpException(400, STATUS_FAIL, "phoneNumber is invalid", ERROR_CODE_OTP_001)
          );
        }
        ref = phoneNumber;
      }

      // const otp: Otp = await new OtpService().getOtp(ref, Utility.stringToEnum(OtpRefTypes, type));
      await new CommService().sendEmailVerificationOTP(ref, Utility.stringToEnum(OtpRefTypes, type));

      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Otp generated successfully",
        data: {otp:""},
        // otp: otp.otp,
        // otpRef: otp.otpRef
      });
    } catch (error) {
      logger.error("An error occurred in generate otp");
      logger.error(error);
      next(error);
    }
  },

  async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phoneNumber, otp } = req.body;

      // Check for valid email or phone number
      if ((!validator.isEmail(email) && !validator.isPhoneNumber(phoneNumber)) || !validator.isString(otp)) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "A valid phone number or email and otp is required",
            ERROR_CODE_OTP_002
          )
        );
      }

      const ref = email ?? phoneNumber; // Use email or phone number

      // Validate the OTP against the stored value in the database
      const isValid = await new OtpService().isValidOtp(ref, otp);
      if (isValid) {
        // If valid, invalidate the OTP to prevent reuse
        await new OtpService().invalidateOtp(ref);
        res.status(200).json({ status: STATUS_SUCCESS, message: "Otp validated successfully" });
      }

      // If invalid, return an error
      return next(new HttpException(400, STATUS_FAIL, "Otp is invalid", ERROR_CODE_OTP_003));
    } catch (error) {
      logger.error("An error occurred during OTP validation");
      logger.error(error);
      next(error);
    }
  },

  async verifyEmailLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, ref } = req.query; // Extract OTP and ref from query parameters

      // Validate input
      if (!otp || !ref) {
        return next(new HttpException(400, STATUS_FAIL, "OTP and user reference are required", ERROR_CODE_OTP_003));
      }

      // Call the AuthService to verify the email link
      const user = await new AuthService().verifyEmailLink(String(ref), String(otp));

      // Respond with success
      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Email verified successfully",
        data: { user }, // You can include the user details if necessary
      });
    } catch (error) {
      logger.error("An error occurred during email verification");
      logger.error(error);
      next(error);
    }
  },
};

export default OtpController;
