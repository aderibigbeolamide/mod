import { getConnection } from "typeorm";
import {
  ERROR_CODE_AUTH_004,
  ERROR_CODE_AUTH_005,
  ERROR_CODE_AUTH_007,
  ERROR_CODE_OTP_003,
  SIGN_IN_TYPE_DEFAULT,
  SIGN_IN_TYPE_GOOGLE,
  STATUS_FAIL,
} from "../../../config/constants.js";
import { User } from "../interfaces/user.interface.js";
import { dataSource } from "../../../config/database.config.js";
import { HttpException } from "../exceptions/http.exception.js";
import EncryptionService from "./encryption.service.js";
import { UserEntity } from "../entities/user.entity.js";
import { UserDetailsEntity } from "../entities/user-details.entity.js";
import { UserDetails } from "../interfaces/user-details.interface.js";
import { CompleteSignUpDto, SignInDto, SignUpDto, FindByEmailOrPhoneDto } from "../dtos/auth.dto.js";
import Utility from "../../../utils/utility.js";
import { UserRoles } from "../enums/user.roles.enum.js";
import OtpService from "./otp.service.js";
import CommService from "./comm.service.js";
import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";
import otpService from "./otp.service.js";

class AuthService {
  userRepo = dataSource.getRepository(UserEntity);
  userDetailsRepo = dataSource.getRepository(UserDetailsEntity);
  otpService: OtpService;
  CommService = new CommService();

  public async signIn(signInDto: SignInDto): Promise<User> {
    try {
      // Fetch the user
      let user: User = (
        await dataSource.getRepository(UserEntity).query(
          `SELECT * FROM "user"
                WHERE (phone_number = '${signInDto.phoneNumber}' 
                OR email = '${signInDto.email}') 
                AND sign_in_type = '${signInDto.type}' 
                LIMIT 1 
                `
        )
      )[0];
      if (user == null) {
        throw new HttpException(
          400,
          STATUS_FAIL,
          `User with email ${signInDto.email || "-"} or phoneNumber ${signInDto.phoneNumber || "-"
          } not found`,
          ERROR_CODE_AUTH_004
        );
      }

      if (signInDto.type == SIGN_IN_TYPE_GOOGLE) {
        return user;
      } else {
        // default, compare password
        let isMatch = await new EncryptionService().compareHash(signInDto.password, user.password);
        if (isMatch) {
          return user;
        } else {
          throw new HttpException(400, STATUS_FAIL, `Password is incorrect`, ERROR_CODE_AUTH_005);
        }
      }
    } catch (error) {
      throw error;
    }
  }


  /**
  * Initiates the forget password process by finding the user by email,
  * generating an OTP, and sending a password reset email.
  * @param email The email address of the user who forgot their password.
  */
  public async forgetPassword(email: string): Promise<void> {
    // Check if the user exists by email.
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        404,
        STATUS_FAIL,
        `User with email ${email} not found.`,
        "err-AUTH-008"
      );
    }


    const otpRecord = await new otpService().getOtp(email, OtpRefTypes.EMAIL); // Adjust OtpRefTypes as needed.
    const otp = otpRecord.otp;

    // Send a password reset email with the OTP.
    await this.CommService.sendPasswordResetEmail(email, otp);
  }

  public async resetPassword(email: string, otp: string, newPassword: string): Promise<User> {
    // 1. Find the user by email.
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        404,
        STATUS_FAIL,
        `User with email ${email} not found.`,
        "err-AUTH-008"
      );
    }



    // 2. Validate the OTP.
    const isValidOtp = await new otpService().isValidOtp(email, otp);
    if (!isValidOtp) {
      throw new HttpException(
        400,
        STATUS_FAIL,
        "OTP is invalid or has expired.",
        ERROR_CODE_OTP_003
      );
    }

    // 3. Hash the new password.
    const hashedPassword = await new EncryptionService().hashPassword(newPassword);

    // 4. Update the user's password.
    await this.userRepo.update({ id: user.id }, { password: hashedPassword });

    // 5. Invalidate the OTP so it can't be reused.
    await new otpService().invalidateOtp(email);

    // 6. Optionally, send a confirmation email (if you have such a method).
    // await this.CommService.sendPasswordResetConfirmationEmail(email);

    // 7. Return the updated user (or a success message if you prefer).
    const updatedUser = await this.userRepo.findOne({ where: { id: user.id } });
    return updatedUser;
  }

  public async fetchAllUsers(): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepo.findAndCount();
    return { users, total };
  }


  public async signUp(signUpDto: SignUpDto): Promise<User> {
    try {
      let { type, firstName, lastName, email, phoneNumber, password } = signUpDto;

      // Check for existing user based on unique constraints
      let existingUser: User = (
        await dataSource.query(
          `SELECT * FROM "user" 
                WHERE phone_number = '${phoneNumber}' 
                OR email = '${email}' 
                LIMIT 1
                `
        )
      )[0];
      if (existingUser != null) {
        throw new HttpException(
          400,
          STATUS_FAIL,
          `User with email ${email} or phoneNumber ${phoneNumber} already exists`,
          ERROR_CODE_AUTH_007
        );
      }

      let hashedPassword: string = null;
      if (type == SIGN_IN_TYPE_DEFAULT) {
        hashedPassword = await new EncryptionService().hashPassword(password);
      }

      // create user and user details
      const userDetails: UserDetails = await dataSource.getRepository(UserDetailsEntity).save({
        firstName,
        lastName,
        isVerified: false,
        userInfo: {},
      });
      const user: User = await dataSource.getRepository(UserEntity).save({
        email,
        phoneNumber,
        signInType: type,
        password: hashedPassword,
        detailsId: userDetails.id,
        isActive: true,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async completeSignUp(userId: string, completeSignUpDto: CompleteSignUpDto): Promise<User> {
    let user: User = await this.userRepo.findOne({ where: { id: userId } });
    let userDetails: UserDetails = await this.userDetailsRepo.findOne({
      where: { id: user?.detailsId },
    });

    if (!user || !userDetails) {
      throw new HttpException(400, STATUS_FAIL, `User not found`, ERROR_CODE_AUTH_007);
    }

    // set user role
    user.role = Utility.stringToEnum(UserRoles, completeSignUpDto.userType);
    await this.userRepo.save(user);

    userDetails.userInfo = {
      userTypeExtra: completeSignUpDto.userTypeExtra,
      noOfProperties: completeSignUpDto.noOfProperties,
    };
    await this.userDetailsRepo.save(userDetails);

    return user;
  }

  public async verifyOtp(userId: string, otp: string): Promise<void> {
    const otpService = new OtpService();
    const isValidOtp = await otpService.isValidOtp(userId, otp);
    if (!isValidOtp) {
      throw new HttpException(400, STATUS_FAIL, "Otp is invalid", ERROR_CODE_OTP_003);
    }
    await dataSource.getRepository(UserDetailsEntity).update(
      { id: userId },
      { isVerified: true }
    );
    await otpService.invalidateOtp(userId);
  }

  public async verifyEmailLink(ref: string, otp: string): Promise<UserDetailsEntity> {
    // Validate the OTP
    const isValidOtp = await this.otpService.isValidOtp(ref, otp);
    if (!isValidOtp) {
      throw new HttpException(400, STATUS_FAIL, "Invalid or expired OTP", ERROR_CODE_OTP_003);
    }
    const user = await dataSource.getRepository(UserDetailsEntity).findOne({ where: { id: ref } });
    if (!user) {
      throw new HttpException(400, STATUS_FAIL, "Invalid user reference", ERROR_CODE_AUTH_004);
    }
    user.isVerified = true;
    await dataSource.getRepository(UserDetailsEntity).save(user);

    await this.otpService.invalidateOtp(ref);

    return user;
  }


  // Method to find a user by email and update their status to active if found
  public async findByEmail(findByEmailUpDto: FindByEmailOrPhoneDto): Promise<User> {
    try {
      // Destructure email 
      let { email } = findByEmailUpDto;

      // Check if a user with the provided email already exists in the database
      let existingUser: User = (
        await dataSource.query(
          `SELECT * FROM "user" WHERE email = $1 LIMIT 1`,
          [email] // Safely pass the phone number parameter
        )
      )[0]; // Extract the first result (if it exists)

      // If an existing user is found, throw an exception
      if (existingUser != null) {
        throw new HttpException(
          400, // HTTP status code for Bad Request
          STATUS_FAIL,
          `User with email ${email} already exists`,
          ERROR_CODE_AUTH_007 // Custom error code for email existence conflict
        );
      }

      // Update the user in the database, setting their status to 'isActive: true'
      await dataSource.getRepository(UserEntity).update(
        { email },
        { isActive: true }
      );

      // After updating, retrieve the updated user from the database
      const user: User = await dataSource.getRepository(UserEntity).findOne({
        where: { email }, // Find the user by email
      });

      // Return the updated user object
      return user;

    } catch (error) {
      throw error;
    }
  }


  /* public async findByEmail( findByEmailUpDto: FindByEmailDto): Promise<boolean> {

    try {
      let { email} = findByEmailUpDto;
      const existingUser: User = await this.userRepo.findOne({ where: { email } });
      return !!existingUser; // Return true if a user is found, otherwise false
    } catch (error) {
      throw new HttpException(500, STATUS_FAIL, `Error checking email existence`, ERROR_CODE_AUTH_007);
    }
  } */

  /* public async findByPhone(findByPhoneNumber: FindByPhoneNumberDto): Promise<boolean> {
    try {
      let { phoneNumber} = findByPhoneNumber;
      const existingUser: User = await this.userRepo.findOne({ where: { phoneNumber } });
      return !!existingUser; // Return true if a user is found, otherwise false
    } catch (error) {
      throw new HttpException(500, STATUS_FAIL, `Error checking phoneNumber existence`, ERROR_CODE_AUTH_007);
    }
  } */

  // Method to find a user by phone number and update their status to active if found
  public async findByPhone(findByPhoneNumber: FindByEmailOrPhoneDto): Promise<User> {
    try {
      // Destructure phoneNumber 
      let { phoneNumber } = findByPhoneNumber;

      // check if a user with the provided phone number already exists in the database
      let existingUser: User = (
        await dataSource.query(
          `SELECT * FROM "user" WHERE phone_number = $1 LIMIT 1`,
          [phoneNumber] // Safely pass the phone number parameter

        )
      )[0]; // Extract the first result (if it exists)

      // throw an exception If an existing user is found
      if (existingUser != null) {
        throw new HttpException(
          400, // HTTP status code for Bad Request
          STATUS_FAIL, // Predefined constant for failure status
          `User with phoneNumber ${phoneNumber} already exists`,
          ERROR_CODE_AUTH_007 // Custom error code for phone number conflict
        );
      }

      // Update the user in the database, setting their status to 'isActive: true'
      await dataSource.getRepository(UserEntity).update(
        { phoneNumber },  // find the user by their phone number
        { isActive: true } // set 'isActive' to true
      );

      // After updating, retrieve the updated user from the database
      const user: User = await dataSource.getRepository(UserEntity).findOne({
        where: { phoneNumber }, // Find the user by phone number
      });

      // Return the updated user object
      return user;

    } catch (error) {
      throw error;
    }
  }


  // last working version
  /* public async findByPhoneOrEmail(findByEmailOrPhoneDto: FindByEmailOrPhoneDto): Promise<User> {
    try {
      let { email, phoneNumber, type } = findByEmailOrPhoneDto;
  
            // Check for existing user based on unique constraints
      let existingUser: User = (
        await dataSource.query(
          `SELECT * FROM "user" 
                WHERE phone_number = '${phoneNumber}' 
                OR email = '${email}'
                AND sign_in_type  = '${type}'
                LIMIT 1
                `
        )
      )[0];
      if (existingUser != null) {
        throw new HttpException(
          400,
          STATUS_FAIL,
          `User with email ${email} or phoneNumber ${phoneNumber} already exists`,
          ERROR_CODE_AUTH_007
        );
      }
      
  
    // Update the user in the database, setting their status to 'isActive: true'
    await dataSource.getRepository(UserEntity).update(
      { email, phoneNumber, signInType: type },        
      { isActive: true },
    );
  
    // After updating, retrieve the updated user from the database
    const user: User = await dataSource.getRepository(UserEntity).findOne({
      where: { email, phoneNumber }, // Find the user by email
    });
  
    // Return the updated user object
    return user;
    
    } catch (error) {
      throw error;
    }
  } */
}

export default AuthService;
