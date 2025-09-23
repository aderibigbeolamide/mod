import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import VerifyService from "../services/verify.service.js";
import { VerifyIdentityDto } from "../dtos/verify.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import {
  ERROR_CODE_000,
  ERROR_CODE_AUTH_004,
  ERROR_CODE_AUTH_006,
  STATUS_ERROR,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from "../../../config/constants.js";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

const verifyService = new VerifyService();

const VerifyController = {
  verify: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.sender?.id;

    if (!userId) {
      return next(new HttpException(404, STATUS_FAIL, "User not found", ERROR_CODE_AUTH_004));
    }

    try {
      const dto = plainToInstance(VerifyIdentityDto, req.body);
      const errors: ValidationError[] = await validate(dto, {
        validationError: { target: false },
      });

      if (errors.length > 0) {
        return next(
          new HttpException(400, STATUS_FAIL, "Validation failed", ERROR_CODE_AUTH_006, errors)
        );
      }

      const isVerified = await verifyService.verify(dto, userId);

      Utility.sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `${dto.verificationType.toUpperCase()} verification successful`,
        data: { isVerified },
        code: 200,
      });
    } catch (error) {
      logger.error("An error occurred in identity verification");
      logger.error(error);
      next(error);
    }
  },

  isVerified: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.sender?.id;

    if (!userId) {
      return next(new HttpException(404, STATUS_ERROR, `not found`, ERROR_CODE_AUTH_004));
    }
    try {
      const isVerified = await verifyService.isUserVerified(userId);

      // if (!isVerified) {
      //   return next(new HttpException(400, STATUS_ERROR, `user not verified`, ERROR_CODE_000));
      // }

      Utility.sendResponse(res, {
        status: `success`,
        message: `user verified`,
        data: { isVerified },
        code: 200,
      });
    } catch (error) {
      logger.error("An error occurred in identity verification");
      logger.error(error);
      next(error);
    }
  },
};

export default VerifyController;
