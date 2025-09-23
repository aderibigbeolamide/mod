import { NextFunction } from "express";
import { logger } from "../../../config/logger.js";

const UserController = {
  setUserRole: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      logger.error("An error occured setting user role");
      logger.error(error);
      next(error);
    }
  },
};

export default UserController;
