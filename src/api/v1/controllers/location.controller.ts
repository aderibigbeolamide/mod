import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import { STATUS_SUCCESS } from "../../../config/constants.js";
import LocationService from "../services/location.service.js";

const LocationController = {
  getStates: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: await LocationService.getAllStates(),
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  getLGAs: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: await LocationService.getLGAS({ state: req.query.state?.toString() }),
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  getWards: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: await LocationService.getWards({ lga: req.query.lga?.toString() }),
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  initiate: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await LocationService.loadStatesAndLGAs();
      res.status(200).json({
        status: STATUS_SUCCESS,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
export default LocationController;
