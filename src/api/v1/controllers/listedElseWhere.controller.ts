import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import { STATUS_SUCCESS } from "../../../config/constants.js";
import ListedElseWhereService from "../services/listedElseWhere.service.js";
import { CreateListedElseWhereDto } from "../dtos/listedElseWhere.dto.js";

const ListedElseWhereController = {
  /**
   * Create a new listed-elsewhere record
   */
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id; // assumes user is added to req by auth middleware
      const createDto = new CreateListedElseWhereDto(req.body);

      const listedElseWhere = await new ListedElseWhereService().createListedElseWhere(userId, createDto);

      res.status(201).json({
        status: STATUS_SUCCESS,
        data: listedElseWhere,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  /**
   * Get all listings created by a user
   */
  getUserListings: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      const listings = await new ListedElseWhereService().getListingsByUser(userId);

      res.status(200).json({
        status: STATUS_SUCCESS,
        data: listings,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  /**
   * Delete a specific listing belonging to a user
   */
  deleteListing: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { listingId } = req.params;

      await new ListedElseWhereService().deleteListing(userId, listingId);

      res.status(200).json({
        status: STATUS_SUCCESS,
        message: "Listing deleted successfully",
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};

export default ListedElseWhereController;
