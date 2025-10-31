import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import RequestToRentService from "../services/request-to-rent.service.js";
import {
  CreateRequestToRentDto,
  UpdateAdditionalInfoDto,
  UpdateHouseholdInfoDto,
  UpdateIncomeInfoDto,
  UpdateIsCompleteDto,
  UpdateResidenceInfoDto,
} from "../dtos/request-to-rent.dto.js";
import { UserEntity } from "../entities/user.entity.js";
import { dataSource } from "../../../config/database.config.js";
import { EErrorCode } from "../enums/errors.enum.js";

const RequestToRentController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Utility.sendResponse(res, {
      data: await RequestToRentService.getAll(),
    });
  },

  createRequestToRent: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let requestToRentDto = new CreateRequestToRentDto(req.body);
      await Utility.validate(requestToRentDto);

      // Todo: validate unitId and propertyId
      // Todo: check if property is not taking applications
      // Todo: check if user has already applied for property, resume pending application or reject

      const newEntry = await RequestToRentService.createRequest(requestToRentDto, req.sender);
      Utility.sendResponse(res, {
        data: newEntry,
        message: "Request to rent initiated successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  //  myReceivedApplicationProperties: async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     try {
  //       let properties = await RequestToRentService.fetchPropertiesWithReceivedApplications(req.sender.id);
  //       Utility.sendResponse(res, {
  //         data: { data: properties },
  //         message: "Successfully fetched properties",
  //       });
  //     } catch (error) {
  //       Utility.returnError(res, error);
  //     }
  //   },

  // HouseholdInfo
  updateHouseholdInfo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;
      const record = await RequestToRentService.updateHouseholdInfo(
        new UpdateHouseholdInfoDto(req.body),
        requestToRentID
      );
      Utility.sendResponse(res, {
        data: record,
        message: "Household Info updated successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // ResidenceInfo
  updateResidenceInfo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;

      const record = await RequestToRentService.updateResidenceInfo(
        new UpdateResidenceInfoDto(req.body),
        requestToRentID
      );
      Utility.sendResponse(res, {
        data: record,
        message: "Residence Info updated successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // IncomeInfo
  updateIncomeInfo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;

      const record = await RequestToRentService.updateIncomeInfo(
        new UpdateIncomeInfoDto(req.body),
        requestToRentID
      );
      Utility.sendResponse(res, {
        data: record,
        message: "Income Info updated successfully",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // AdditionalInfo
  updateAdditionalInfo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;

      const record = await RequestToRentService.updateAdditionalInfo(
        new UpdateAdditionalInfoDto(req.body),
        requestToRentID
      );
      Utility.sendResponse(res, {
        data: record,
        message: "Additional Info updated successfully",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // ISComplete
  updateIsComplete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;

      const record = await RequestToRentService.updateIsComplete(
        new UpdateIsCompleteDto(req.body),
        requestToRentID,
        req.sender
      );
      Utility.sendResponse(res, {
        data: record,
        message: "Completion status updated successfully",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // summary
  summary: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { requestToRentID } = req.params;
    try {
      Utility.sendResponse(res, {
        data: await RequestToRentService.getById(requestToRentID),
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  interestedUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyId } = req.params;
      if (!propertyId)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await RequestToRentService.fetchInterestedApplicants(propertyId),
        message: "Interested applicants fetched successfully",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  interestedUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lessorUserId = req.sender?.id;
      if (!lessorUserId)
        Utility.throwException({
          statusNo: 400,
          message: "Lessor User ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await RequestToRentService.fetchInterestedApplicant(lessorUserId),
        message: "Interested applicants fetched successfully",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  /**
   * Fetch pending requests for a landlord's properties.
   */
  getPendingRequestsForLandlord: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id; // Assuming `req.sender` contains the logged-in user's data.
      const pendingRequests = await RequestToRentService.getPendingRequestsForLandlord(userId);

      Utility.sendResponse(res, {
        data: pendingRequests,
        message: "Pending requests fetched successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },


  /**
   * Approve or reject a rental request.
   */
  reviewRequestToRent: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;

      // Convert the query parameter "isApprove" from string to boolean.
      const isApproveParam = req.query.isApprove;
      if (isApproveParam !== "true" && isApproveParam !== "false") {
        Utility.throwException({
          statusNo: 400,
          message: "isApprove must be a boolean value",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      }
      const isApprove = isApproveParam === "true";

      // Convert moveInDate to a Date object if provided
      const moveInDateParam = req.query.moveInDate;
      const moveInDate = moveInDateParam ? new Date(moveInDateParam.toString()) : undefined;

      // Assuming req.sender contains the authenticated landlord's details
      const landlordId = req.sender.id;

      const landlordIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() 
        || req.headers['x-real-ip']?.toString() 
        || req.socket.remoteAddress 
        || 'Unknown';

      const updatedRequest = await RequestToRentService.approveRequestToRent(
        requestToRentID,
        isApprove,
        landlordId,
        moveInDate,
        landlordIp
      );

      Utility.sendResponse(res, {
        data: updatedRequest,
        message: `Rental request ${isApprove ? "approved" : "rejected"} successfully`,
        code: 200,
      });
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  },

  /**
   * Check if a user has already requested to rent a specific property.
   * @param req - The incoming request object.
   * @param res - The outgoing response object.
   * @param next - The next middleware function.
   */
  hasUserRequestedToRent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { propertyId } = req.params; // Get propertyId from the route parameters
      const userId = req.sender.id; // Assuming `req.sender` contains the logged-in user's data

      if (!propertyId) {
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      }

      const hasRequested = await RequestToRentService.hasUserRequestedToRent(userId, propertyId);

      Utility.sendResponse(res, {
        data: { hasRequested },
        message: hasRequested
          ? "User has already requested to rent this property."
          : "User has not requested to rent this property.",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  applications: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyId } = req.params;
      const { userId } = req.query;

      Utility.sendResponse(res, {
        data: await RequestToRentService.fetchApplicationsByPropertyID(
          propertyId,
          userId as string
        ),
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  getRenterApplications: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { renterId } = req.params;

      Utility.sendResponse(res, {
        data: await RequestToRentService.fetchRenterApplications(renterId),
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // delete
  deleteRequestToRent: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentID } = req.params;
      const deleted = await RequestToRentService.deleteRequest(requestToRentID);
      Utility.sendResponse(res, {
        data: deleted,
        message: "Request to rent deleted successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  // get Approved Request to rent by User Id
  getApprovedRequestToRentByUserId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.sender.id; // Assuming `req.sender` contains the logged-in user's data.
      const approvedRequests = await RequestToRentService.getApprovedRequestToRentBylessorUserId(userId);

      Utility.sendResponse(res, {
        data: approvedRequests,
        message: "Approved requests fetched successfully",
        code: 200,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },
};

// getApprovedRequestToRentBylessorUserId
export const getApprovedRequestToRentBylessorUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.sender.id; // Assuming `req.sender` contains the logged-in user's data.
    const approvedRequests = await RequestToRentService.getApprovedRequestToRentBylessorUserId(userId);

    Utility.sendResponse(res, {
      data: approvedRequests,
      message: "Approved requests fetched successfully",
      code: 200,
    });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};

export default RequestToRentController;
