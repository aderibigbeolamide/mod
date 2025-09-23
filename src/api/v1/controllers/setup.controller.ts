import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import { STATUS_SUCCESS } from "../../../config/constants.js";
import SetupService from "../services/setup.service.js";

const SetupController = {
  initiate: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const locationData = await SetupService.initiate();
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: locationData,  
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
export default SetupController;
