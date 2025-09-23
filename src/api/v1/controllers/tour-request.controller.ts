import { NextFunction, Request, Response } from "express";
import Utility from "../../../utils/utility.js";
import TourRequestService from "../services/tour-request.service.js";
import { CreateTourRequestDto } from "../dtos/tour-request.dto.js";
import { logger } from "../../../config/logger.js";

const TourRequestController = {
  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Utility.sendResponse(res, {
      data: await TourRequestService.GetAll(),
    });
  },

  createTourRequest: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newEntry = await TourRequestService.CreateTourRequest(
        new CreateTourRequestDto(req.body)
      );
      Utility.sendResponse(res, {
        data: newEntry,
        message: "Tour Request initailted successfully",
        code: 201,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  /**
   * Check if a user has already requested a tour.
   * @param req - Express request object containing `email` and `phone` in query parameters.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
  checkIfUserRequestedTour: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, phone } = req.query;

      // Ensure required parameters are provided
      if (!email || !phone) {
        Utility.sendResponse(res, {
          message: "Email and phone are required to check if the user has requested a tour.",
          code: 400,
        });
        return;
      }

      // Check if the user has already requested a tour
      const hasRequested = await TourRequestService.HasUserRequestedTour(
        String(email),
        String(phone)
      );

      Utility.sendResponse(res, {
        data: { hasRequested },
        message: hasRequested
          ? "User has already requested a tour."
          : "User has not requested a tour.",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

};

export default TourRequestController;
