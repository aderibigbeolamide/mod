import { NextFunction, Request, Response } from "express";
import Utility from "../../../utils/utility.js";
import { EErrorCode } from "../enums/errors.enum.js";
import KVPService from "../services/kvp.service.js";
import { KVPSearchQueryDto, KVPUpdateDto } from "../dtos/kvp.dto.js";

const subject="KVP"
export const KVPController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let dto = new KVPUpdateDto(req.body);
      await Utility.validate(dto);
      Utility.sendResponse(res, {
        data: await KVPService.create(dto),
        message: `${subject} saved`,
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let dto = new KVPUpdateDto(req.body);
      const id = req.params.key;
      if (!id)
        Utility.throwException({
          statusNo: 400,
          message: `${subject} key is required`,
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await KVPService.update(id, dto),
        message: `${subject} saved`,
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  // delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const id = req.params.codeID;
  //     if (!id)
  //       Utility.throwException({
  //         statusNo: 400,
  //         message: "Code ID is required",
  //         errorCode: EErrorCode.ERROR_CODE_400,
  //       });
  //     Utility.sendResponse(res, {
  //       data: await CodeService.delete(id),
  //       message: "Code deleted",
  //     });
  //   } catch (error) {
  //     Utility.returnError(res, error);
  //   }
  // },

  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await KVPService.search(new KVPSearchQueryDto(req.query)),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getKeys: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await KVPService.getKeys(),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  }, 
};
