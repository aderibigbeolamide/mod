import { NextFunction, Request, Response, query } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import ReportPropertyService from "../services/report-property.service.js";
import { ReportPropertyDto } from "../dtos/report-property.dto.js";
import { EErrorCode } from "../enums/errors.enum.js";
import PropertyService from "../services/property.service.js";

const ReportPropertyController = {
  report: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyId } = req.params;
      if (!propertyId)
        Utility.throwException({
          statusNo: 400,
          message: `Property ID is required`,
          errorCode: EErrorCode.ERROR_CODE_400,
        });

      if (!(await PropertyService.verifyID(propertyId)))
        Utility.throwException({
          statusNo: 400,
          message: `Property ID ${propertyId} does not exist`,
          errorCode: EErrorCode.ERROR_CODE_400,
      })

      Utility.sendResponse(res, {
        data: await ReportPropertyService.createNewReport(
          propertyId,
          new ReportPropertyDto(req.body)
        ),
        message: `Property Report Initiated`,
      });
    } catch (err) {
      
      Utility.returnError(res, err);
    }
  },
};

export default ReportPropertyController;
