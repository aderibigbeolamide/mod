import { Request, Response, NextFunction } from "express";
import { STATUS_FAIL } from "../../../config/constants.js";
import Utility from "../../../utils/utility.js";
import { logger } from "../../../config/logger.js";

export const verifyBVN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    next();
  } catch (error) {
    logger.error(`BVN verification failed`);
    Utility.logError(error);
    Utility.sendResponse(res, {
      code: 422,
      status: STATUS_FAIL,
      message: `BVN verification failed: BVN does not match record`,
      data: { error },
    });
  }
};

export const verifyNIN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    next();
  } catch (error) {
    logger.error(`NIN verification failed`);
    Utility.logError(error);
    Utility.sendResponse(res, {
      code: 422,
      status: STATUS_FAIL,
      message: `NIN verification failed: BVN does not match record`,
      data: { error },
    });
  }
};
