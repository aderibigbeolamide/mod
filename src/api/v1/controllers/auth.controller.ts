import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import {
  ERROR_CODE_AUTH_003,
  ERROR_CODE_AUTH_004,
  ERROR_CODE_AUTH_006,
  SIGN_IN_TYPES,
  SIGN_IN_TYPE_DEFAULT,
  SIGN_IN_TYPE_GOOGLE,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from "../../../config/constants.js";
import { User } from "../interfaces/user.interface.js";
import { HttpException } from "../exceptions/http.exception.js";
import AuthService from "../services/auth.service.js";
import JWTService from "../services/jwt.service.js";
import Utility from "../../../utils/utility.js";
import { ValidationError, validate } from "class-validator";
import { CompleteSignUpDto, FindByEmailOrPhoneDto, SignInDto, SignUpDto } from "../dtos/auth.dto.js";
import { EErrorCode } from "../enums/errors.enum.js";
import { dataSource } from "../../../config/database.config.js";
import { UserEntity } from "../entities/user.entity.js";
import CommService from "../services/comm.service.js";
import CommunicationService from "../services/communication.service.js";

const AuthController = {
  /**
   * Handles sign in request (both type default [phone number or email] and Google)
   * @param req
   * @param res
   * @param next
   */
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let signInDto = new SignInDto(req.body);

      if (
        !SIGN_IN_TYPES.includes(signInDto.type) ||
        (signInDto.email == null && signInDto.phoneNumber == null)
      ) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "type and phoneNumber or email fields are required",
            ERROR_CODE_AUTH_003
          )
        );
      }

      let errors: ValidationError[] = await validate(signInDto, {
        validationError: { target: false },
        whitelist: true,
      });
      if (errors.length > 0) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Sign In validation failed",
            ERROR_CODE_AUTH_003,
            errors
          )
        );
      }

      if (signInDto.type == SIGN_IN_TYPE_DEFAULT && signInDto.password == null) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Password is required for default sign in",
            ERROR_CODE_AUTH_003
          )
        );
      }

      let user: User = await new AuthService().signIn(signInDto);
      let token: string = new JWTService().createToken(user);

      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Login successful",
        data: { user: Utility.hideSensitive(user), token },
      });
    } catch (error) {
      logger.error("An error occured in sign in");
      logger.error(error);
      next(error);
    }
  },

  fetchAllUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await new AuthService().fetchAllUsers();

      Utility.sendResponse(res, {
        data: {
          users: result.users,
          total: result.total,
        },
        message: "Successfully fetched all users",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },


  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let signUpDto: SignUpDto = new SignUpDto(req.body);

      if (!SIGN_IN_TYPES.includes(signUpDto.type)) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "type can either be default or google",
            ERROR_CODE_AUTH_006
          )
        );
      }

      if (signUpDto.type == SIGN_IN_TYPE_DEFAULT && signUpDto.password == null) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Password is required for default sign up",
            ERROR_CODE_AUTH_006
          )
        );
      }

      let errors: ValidationError[] = await validate(signUpDto, {
        validationError: { target: false },
        whitelist: true,
      });
      if (errors.length > 0) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Sign Up validation failed",
            ERROR_CODE_AUTH_006,
            errors
          )
        );
      }

      let user: User = await new AuthService().signUp(signUpDto);
      let token: string = new JWTService().createToken(user);


      res
        .status(200)
        .json({ status: STATUS_SUCCESS, message: "Sign up successful", data: { user, token } });
    } catch (error) {
      logger.error("An error occured in sign up");
      logger.error(error);
      next(error);
    }
  },

  async completeSignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let completeSignUpDto: CompleteSignUpDto = new CompleteSignUpDto(req.body);
      await Utility.validate(completeSignUpDto);

      if (completeSignUpDto.userType != "LESSOR" && completeSignUpDto.userType != "RENTER") {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "userType can either be LESSOR or RENTER",
            ERROR_CODE_AUTH_006
          )
        );
      }
      if (
        completeSignUpDto.userType == "RENTER" &&
        !["rent", "room buddy"].includes(completeSignUpDto.userTypeExtra.toLowerCase())
      ) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "userTypeExtra for RENTER can either be Rent or Room buddy",
            ERROR_CODE_AUTH_006
          )
        );
      }
      if (
        completeSignUpDto.userType == "LESSOR" &&
        !["individual", "company"].includes(completeSignUpDto.userTypeExtra.toLowerCase())
      ) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "userTypeExtra for LESSOR can either be Individual or Company",
            ERROR_CODE_AUTH_006
          )
        );
      }

      if (completeSignUpDto.userType == "LESSOR" && completeSignUpDto.noOfProperties == null) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "noOfProperties is required for userType LESSOR",
            ERROR_CODE_AUTH_006
          )
        );
      }
      let user = await new AuthService().completeSignUp(req.sender.id, completeSignUpDto);
      Utility.sendResponse(res, {
        status: STATUS_SUCCESS,
        message: "Sign up complete",
        data: { user },
      });
    } catch (error) {
      logger.error("An error occured in sign out");
      Utility.logError(error);
      next(error);
    }
  },

  forgetPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        Utility.throwException({
          statusNo: 400,
          message: "Email is required for password reset.",
          errorCode: ERROR_CODE_AUTH_004,
        });
      }
      await new AuthService().forgetPassword(email);
      Utility.sendResponse(res, {
        data: {},
        message: "OTP for password reset has been sent to your email.",
        code: 200,
      });
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        Utility.throwException({
          statusNo: 400,
          message: "Email, OTP, and new password are required.",
          errorCode: ERROR_CODE_AUTH_004,
        });
      }
      const updatedUser = await new AuthService().resetPassword(email, otp, newPassword);
      Utility.sendResponse(res, {
        data: updatedUser,
        message: "Password reset successfully.",
        code: 200,
      });
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  },


  // check if an email already exists in the database
  /* async findByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Create a new instance of FindByEmailDto 
      const emailDto = new FindByEmailDto(req.body); 
  
  
  
      // Check if the  email parameter is provided
      if (!emailDto) {
        // return an error using the next function to pass to error handling middleware
        return next(new HttpException(400, STATUS_FAIL, "Email query parameter is required", ERROR_CODE_AUTH_003));
      }
  
      // Call the AuthService to check if the email already exists in the database
      const emailExists = await new AuthService().findByEmail(emailDto);
  
      // If email already exists, return a response indicating that the email is in use
      if (emailExists) {
        res.status(200).json({
          status: STATUS_SUCCESS, // Indicating the request was successful
          message: "Email is already in use", 
          data: { emailExists }, 
        });
      } else {
        // If email does not exist, return a response indicating that the email is available
        res.status(200).json({
          status: STATUS_SUCCESS, 
          message: "Email is available", 
          data: { emailExists }, 
        });
      }
    } catch (error) {
      // Log the error 
      logger.error(error);
  
      // Pass the error to the next middleware to handle it
      next(error);
    }
  }, */


  // last one we used
  /* async findByEmailOrPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let findByEmailOrPhoneDto: FindByEmailOrPhoneDto = new FindByEmailOrPhoneDto(req.body);
  
      if (!SIGN_IN_TYPES.includes(findByEmailOrPhoneDto.type)) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "type can either be default or google",
            ERROR_CODE_AUTH_006
          )
        );
      }
  
    
  
      let errors: ValidationError[] = await validate(findByEmailOrPhoneDto, {
        validationError: { target: false },
        whitelist: true,
      });
      if (errors.length > 0) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Sign Up validation failed",
            ERROR_CODE_AUTH_006,
            errors
          )
        );
      }
  
      let user: User = await new AuthService().findByPhoneOrEmail(findByEmailOrPhoneDto);
  
      res
        .status(200)
        .json({ status: STATUS_SUCCESS, message: "Check successful", data: { user } });
    } catch (error) {
      logger.error("An error occured in sign up");
      logger.error(error);
      next(error);
    }
  }, */

  async findByEmailOrPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Create new instances of FindByEmailDto and FindByPhoneNumberDto using the request body
      const emailDto = new FindByEmailOrPhoneDto(req.body);
      const phoneNumberDto = new FindByEmailOrPhoneDto(req.body);

      // Check for type field
      const type = req.body.type;
      const SIGN_IN_TYPES = ['email', 'phoneNumber', 'google']; // Define valid types

      // Check if the provided type is valid
      if (!SIGN_IN_TYPES.includes(type)) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Type can either be 'email', 'phoneNumber' or 'google'",
            ERROR_CODE_AUTH_006
          )
        );
      }


      // Check if neither email nor phone number is provided
      if (!emailDto.email && !phoneNumberDto.phoneNumber) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Email or Phone Number query parameter is required",
            ERROR_CODE_AUTH_003
          )
        );
      }

      // Create a message string and data object to build the response
      let message = "";
      let data: { emailExists?: boolean; phoneNumberExists?: boolean } = {};

      // Check if the email exists, if email is provided
      if (emailDto.email) {
        const emailExists = await new AuthService().findByEmail(emailDto);
        if (emailExists) {
          message += "Email is already in use. ";
          data.emailExists = true; // Mark email as existing
        } else {
          message += "Email is available. ";
          data.emailExists = false; // Mark email as available
        }
      }

      // Check if the phone number exists, if phone number is provided
      if (phoneNumberDto.phoneNumber) {
        const phoneNumberExists = await new AuthService().findByPhone(phoneNumberDto);
        if (phoneNumberExists) {
          message += "Phone Number is already in use.";
          data.phoneNumberExists = true; // Mark phone number as existing
        } else {
          message += "Phone Number is available.";
          data.phoneNumberExists = false; // Mark phone number as available
        }
      }

      // Send back the response for both checks
      res.status(200).json({
        status: STATUS_SUCCESS,
        message: message.trim(), // Trim any extra spaces from the message
        data, // Return data about the existence of email and phone number
      });
    } catch (error) {
      // Log the error and pass it to the next middleware for handling
      logger.error("An error occurred in checking email or phone number");
      logger.error(error);
      next(error);
    }
  },

  // Asynchronous method to check if a phone number already exists in the database
  /* async findByNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Create a new instance of FindByPhoneNumberDto
      const phoneNumberDto = new FindByPhoneNumberDto(req.body);
  
      // Check if the phone number parameter is provided
      if (!phoneNumberDto) {
        // If return an error using the next function to pass to error handling middleware
        return next(new HttpException(400, STATUS_FAIL, "Phone Number query parameter is required", ERROR_CODE_AUTH_003));
      }
  
      // Call the AuthService to check if the phone number already exists in the database
      const phoneNumberExists = await new AuthService().findByPhone(phoneNumberDto);
  
      // If phone number already exists, return a response indicating that the phone number is in use
      if (phoneNumberExists) {
        res.status(200).json({
          status: STATUS_SUCCESS, 
          message: "Phone Number is already in use", 
          data: { phoneNumberExists },
        });
      } else {
        // return a response indicating that the phone number is available
        res.status(200).json({
          status: STATUS_SUCCESS, 
          message: "Phone Number is available", 
          data: { phoneNumberExists }, 
        });
      }
    } catch (error) {
      // Log the error 
      logger.error(error);
  
      // Pass the error to the next middleware to handle it
      next(error);
    }
  }, */

  // Asynchronous method to check if either email or phone number already exists in the database
  /* async findByEmailOrPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Create new instances of FindByEmailDto and FindByPhoneNumberDto using the request body (assuming both are passed in the body)
      const emailDto = new FindByEmailDto(req.body);
      const phoneNumberDto = new FindByPhoneNumberDto(req.body);
  
      // Check if neither email nor phone number is provided
      if (!emailDto.email && !phoneNumberDto.phoneNumber) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Email or Phone Number query parameter is required",
            ERROR_CODE_AUTH_003
          )
        );
      }
  
      let message = "";
      let data = {};
  
      // Check if the email exists, if email is provided
      if (emailDto.email) {
        const emailExists = await new AuthService().findByEmail(emailDto);
        if (emailExists) {
          message += "Email is already in use. ";
          data = { ...data, emailExists };
        } else {
          message += "Email is available. ";
        }
      }
  
      // Check if the phone number exists, if phone number is provided
      if (phoneNumberDto.phoneNumber) {
        const phoneNumberExists = await new AuthService().findByPhone(phoneNumberDto);
        if (phoneNumberExists) {
          message += "Phone Number is already in use.";
          data = { ...data, phoneNumberExists };
        } else {
          message += "Phone Number is available.";
        }
      }
  
      // Return the combined response for both checks
      res.status(200).json({
        status: STATUS_SUCCESS, // Indicating the request was successful
        message: message.trim(), // The combined message for email and phone number
        data, // The combined data for both email and phone number existence
      });
    } catch (error) {
      // Log the error using a logger for debugging or monitoring purposes
      logger.error(error);
  
      // Pass the error to the next middleware to handle it (i.e., error handling middleware)
      next(error);
    }
  }, */


  // method to check if either email or phone number already exists in the database
  /* async findAndActivateByEmailOrPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emailDto = new FindByContactDto(req.body); // Extract email from request body
      const phoneNumberDto = new FindByContactDto(req.body); // Extract phone number from request body
  
      // Check if neither email nor phone number is provided
      if (!emailDto.email && !phoneNumberDto.phoneNumber) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Email or Phone Number query parameter is required",
            ERROR_CODE_AUTH_003
          )
        );
      }
  
      let message = "";
      let data = {};
  
       
  
      // Check and update the user's status based on email if only email is provided
      if (emailDto.email) {
        const existingUserByEmail: User = await dataSource.query(
          `SELECT * FROM "user" WHERE email = '${emailDto.email}' LIMIT 1`
        )[0];
  
        if (existingUserByEmail) {
          await dataSource.getRepository(UserEntity).update(
            { email: emailDto.email }, { isActive: true }
          );
          const updatedUserByEmail = await dataSource.getRepository(UserEntity).findOne({
            where: { email: emailDto.email },
          });
          message += `User with email ${emailDto.email} is found and activated. `;
          data = { ...data, updatedUserByEmail };
        } else {
          message += `No user found with email ${emailDto.email}. `;
        }
      }
  
      // Check and update the user's status based on phone number if only phone number is provided
      if (phoneNumberDto.phoneNumber) {
        const existingUserByPhone: User = await dataSource.query(
          `SELECT * FROM "user" WHERE phone_number = '${phoneNumberDto.phoneNumber}' LIMIT 1`
        )[0];
  
        if (existingUserByPhone) {
          await dataSource.getRepository(UserEntity).update(
            { phoneNumber: phoneNumberDto.phoneNumber }, { isActive: true }
          );
          const updatedUserByPhone = await dataSource.getRepository(UserEntity).findOne({
            where: { phoneNumber: phoneNumberDto.phoneNumber },
          });
          message += `User with phone number ${phoneNumberDto.phoneNumber} is found and activated. `;
          data = { ...data, updatedUserByPhone };
        } else {
          message += `No user found with phone number ${phoneNumberDto.phoneNumber}. `;
        }
      }
  
      // Return the combined response for both email and phone number checks and updates
      res.status(200).json({
        status: STATUS_SUCCESS,
        message: message.trim(), // The combined message for both email and phone number
        data, // The combined data of updated users
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
   */


  /**
   * Todo: will clear user session
   * @param req
   * @param res
   * @param next
   */
  async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    } catch (error) {
      logger.error("An error occured in sign out");
      logger.error(error);
      next(error);
    }
  },
};

export default AuthController;

