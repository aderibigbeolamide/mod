import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import {
  STATUS_SUCCESS
} from "../../../config/constants.js";

const SwaggerController = {
  post: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Success",
        data: req.body,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  get: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Hello",
      });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};

export default SwaggerController;
