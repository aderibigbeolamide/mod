import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import RequestCallService from "../services/request-call.service.js";
import { CreateRequestCallDto } from "../dtos/request-call.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import { STATUS_FAIL, STATUS_SUCCESS } from "../../../config/constants.js";
import Utility from "../../../utils/utility.js";
import { logger } from "../../../config/logger.js";

const RequestCallController = {
  // Create a new request call
  createRequestCall: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.sender?.id;
      if (!userId) {
        return next(new HttpException(401, STATUS_FAIL, "Authentication required", "AUTH_REQUIRED"));
      }

      const createDto = new CreateRequestCallDto(req.body);

      // Validate DTO
      const errors: ValidationError[] = await validate(createDto, {
        validationError: { target: false },
        whitelist: true,
      });

      if (errors.length > 0) {
        return next(
          new HttpException(400, STATUS_FAIL, "Validation failed", "VALIDATION_ERROR", errors)
        );
      }

      const requestCallService = new RequestCallService();
      const requestCall = await requestCallService.createRequestCall(userId, createDto);

      Utility.sendResponse(res, {
        code: 201,
        status: STATUS_SUCCESS,
        message: "Request call created successfully",
        data: requestCall,
      });
    } catch (error) {
      logger.error("Error creating request call");
      logger.error(error);
      next(error);
    }
  },

  // Get user's request calls
  getUserRequestCalls: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.sender?.id;
      if (!userId) {
        return next(new HttpException(401, STATUS_FAIL, "Authentication required", "AUTH_REQUIRED"));
      }

      const requestCallService = new RequestCallService();
      const requestCalls = await requestCallService.getUserRequestCalls(userId);

      Utility.sendResponse(res, {
        data: requestCalls,
        message: "Request calls retrieved successfully",
      });
    } catch (error) {
      logger.error("Error fetching user request calls");
      logger.error(error);
      next(error);
    }
  },

  // Get user data for confirmation (returns user's email and phone)
  getUserDataForConfirmation: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.sender?.id;
      if (!userId) {
        return next(new HttpException(401, STATUS_FAIL, "Authentication required", "AUTH_REQUIRED"));
      }

      // Get user's current email and phone
      const user = req.sender;
      
      Utility.sendResponse(res, {
        data: {
          email: user.email,
          phoneNumber: user.phoneNumber,
          hasEmail: !!user.email,
          hasPhone: !!user.phoneNumber,
        },
        message: "User contact information retrieved",
      });
    } catch (error) {
      logger.error("Error fetching user data for confirmation");
      logger.error(error);
      next(error);
    }
  },
}

export default RequestCallController;
