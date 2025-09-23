import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import { STATUS_SUCCESS } from "../../../config/constants.js";
import Utility from "../../../utils/utility.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import { LessorCreateDto, LessorSearchQueryDto } from "../dtos/lessor.dto.js";
import LessorService from "../services/lessor.service.js";

const LessorController = {
  save: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await LessorService.save(new LessorCreateDto(req.body), req.sender?.id),
        message: `Lessor ${req.body.id ? "updated" : "created"}`,
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getByID: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: string = req.params["id"];
      if (!id)
        Utility.throwException({
          message: "Lessor id is required",
          statusNo: 400,
          errorObject: { propertyID: id },
        });

      Utility.sendResponse(res, {
        data: await LessorService.getByID(id),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  // getAllLessors
  getAllLessors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await LessorService.getAllLessors(),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await LessorService.search(new LessorSearchQueryDto(req.query as any)),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getMyLessors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // debugger;
      if (!req.sender) throw `User was not detected`;
      Utility.sendResponse(res, {
        data: await LessorService.search({
          createdBy: req.sender.id,
          pageSize: 100000000,
          pageNumber: 1,
        }),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  props: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: lessorProps,
      });
    } catch (error) {
      logger.error("An error occured in returning property props");
      logger.error(error);
      next(error);
    }
  },
};
export const lessorProps = {
  lessorCategories: Object.values(LessorCategories),
};

export default LessorController;
