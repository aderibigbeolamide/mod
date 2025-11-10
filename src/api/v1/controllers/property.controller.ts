import { NextFunction, Request, Response, query } from "express";
import { logger } from "../../../config/logger.js";
import { STATUS_SUCCESS } from "../../../config/constants.js";
import Utility from "../../../utils/utility.js";
import { TransactionTypes } from "../enums/transaction.types.enums.js";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import PropertyService from "../services/property.service.js";
import PropertyUnitService from "../services/unit.service.js";
import { EErrorCode } from "../enums/errors.enum.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import {
  PropertyAmmenityDto,
  PropertyArchiveUpdateDto,
  PropertyAvailabilityUpdateDto,
  PropertyCautionFeeUpdateDto,
  PropertyFAQDto,
  PropertyInitiateDto,
  PropertyLeasePolicyUpdateDto,
  PropertySearchQueryDto,
  PropertyTourAvailabilityUpdateDto,
  PropertyUnitCategoriesDto,
  PropertyUnitsDto,
  PropertyUpdateDto,
  PropertyUtilitiesUpdateDto,
} from "../dtos/property.dto.js";
import { EPropertyType as PropertyType } from "../enums/property.enums.js";
import KVPService from "../services/kvp.service.js";
import { KVPCategory } from "../interfaces/kvp.interface.js";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { PropertyEntity } from "../entities/property.entity.js";
import { dataSource } from "../../../config/database.config.js";
import { Property } from "../interfaces/property.interface.js";
import { error } from "console";
import { instanceToPlain } from "class-transformer";

const PropertyController = {
  initiatePropertyCreation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let propertyDto = new PropertyInitiateDto(req.body);
      await Utility.validate(propertyDto);
      if (!req.sender?.id) throw `User info is required`;
      Utility.sendResponse(res, {
        data: await PropertyService.initiatePropertyCreation(propertyDto, req.sender),
        message: "Property initiated",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  save: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyUpdateDto(req.body);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      await Utility.validate(propertyDto);
      Utility.sendResponse(res, {
        data: await PropertyService.updateProperty(propertyID, propertyDto),
        message: "Property details saved",
      });
    } catch (error) {
      // debugger;
      Utility.returnError(res, error);
    }
  },

  updateAmmenity: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyAmmenityDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updateAmmenities(propertyID, propertyDto),
        message: "Property amenity saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  archive: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyArchiveUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updatePropertyArchive(propertyID, propertyDto),
        message: "Property availability saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.deleteByID(propertyID),
        message: "Property deleted",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateAvailability: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyAvailabilityUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updatePropertyAvailabilityFee(propertyID, propertyDto),
        message: "Property availability saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateCautionFee: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // debugger;
      let propertyDto = new PropertyCautionFeeUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updatePropertyCautionFee(propertyID, propertyDto),
        message: "Property caution fee saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateUnitCategories: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyUnitCategoriesDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updateUnitCategories(propertyID, propertyDto),
        message: "Property unit categories saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateUnits: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyUnitsDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updateUnits(propertyID, propertyDto),
        message: "Property unit saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateTourAvailability: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let propertyDto = new PropertyTourAvailabilityUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updatePropertyTour(propertyID, propertyDto),
        message: "Property tour details saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateLeasePolicy: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyLeasePolicyUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updatePropertyLeasePolicy(propertyID, propertyDto),
        message: "Property lease policy details saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateUtilities: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyUtilitiesUpdateDto(req.body);
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updateUtilities(propertyID, propertyDto),
        message: "Property utility details saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateFAQ: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let propertyDto = new PropertyFAQDto(req.body);
      // let propertyDto = (<any[]>req.body.faq).map((x) => new PropertyFAQDto(x));
      await Utility.validate(propertyDto);
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.updateFAQ(propertyID, propertyDto),
        message: "Property utility details saved",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  finalizeProperty: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!req.sender?.id) throw `User info is required`;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.finalizeProperty(propertyID, req.sender),
        message: "Property finalized successfully",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  generateLeasePreview: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.generateLeasePreview(propertyID),
        message: "Lease preview generated successfully",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getUnitStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, unitId } = req.params;

      if (!userId || !unitId) {
        return Utility.throwException({
          statusNo: 400,
          message: "User ID and Unit ID are required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      }

      const data = await PropertyService.getUnitStatus(userId, unitId);

      return Utility.sendResponse(res, {
        data,
        message: "Rental status retrieved successfully",
      });
    } catch (error) {
      return Utility.returnError(res, error);
    }
  },

  // signLeaseAgreement
  signLeaseAgreement: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.sender?.id;
      const { unitId } = req.body;

      if (!userId || !unitId) {
        return Utility.throwException({
          statusNo: 400,
          message: "User ID and Unit ID are required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      }

      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() 
        || req.headers['x-real-ip']?.toString() 
        || req.socket.remoteAddress 
        || 'Unknown';

      const data = await PropertyService.signLeaseAgreement(userId, unitId, clientIp);

      return Utility.sendResponse(res, {
        data,
        message: "Lease agreement signed successfully",
      });
    } catch (error) {
      return Utility.returnError(res, error);
    }
  },

  // landlordUnitStatus
  landlordUnitStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { renterId, unitId } = req.params;

      if (!renterId || !unitId) {
        return Utility.throwException({
          statusNo: 400,
          message: "Renter ID and Unit ID are required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      }

      const data = await PropertyService.landlordUnitStatus(renterId as string, unitId as string);

      return Utility.sendResponse(res, {
        data,
        message: "Landlord unit status retrieved successfully",
      });
    } catch (error) {
      return Utility.returnError(res, error);
    }
  },

  getPropertyByUserId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;
      if (!userId)
        Utility.throwException({
          statusNo: 400,
          message: "user ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.getPropertyByUserId(userId),
        message: "User fetch successfully",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getPropertyByLessorId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lessorId = req.params.lessorId;
      if (!lessorId)
        Utility.throwException({
          statusNo: 400,
          message: "lessor ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.getPropertiesByLessorId(lessorId),
        message: "Lessor fetch successfully",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  disable: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.disable(propertyID),
        message: "Property disabled",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  enable: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.enable(propertyID),
        message: "Property enabled",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  verify: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.verify(propertyID),
        message: "Property verified",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  //getAllProperties
  getAllProperties: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = new PropertySearchQueryDto(req.query as any);
      await Utility.validate(query);
      Utility.sendResponse(res, {
        data: await PropertyService.getAllProperties(query),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  unverify: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID = req.params.propertyID;
      if (!propertyID)
        Utility.throwException({
          statusNo: 400,
          message: "Property ID is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
      Utility.sendResponse(res, {
        data: await PropertyService.unverify(propertyID),
        message: "Property unverified",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID: string = req.params["propertyID"];
      if (!propertyID)
        Utility.throwException({
          message: "Property id is required",
          statusNo: 400,
          errorObject: { propertyID },
        });

      Utility.sendResponse(res, {
        data: await PropertyService.getByID(propertyID),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  // getUnitDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const userId = req.user?.id; // Assuming user is authenticated and attached to `req.user`
  //     const userEmail = req.user?.email; // Assuming user email is attached to `req.user`
  //     const unitId = req.params.unitId;

  //     // Validate input
  //     if (!userId || !userEmail || !unitId) {
  //       Utility.throwException({
  //         statusNo: 400,
  //         message: "User ID, email, and Unit ID are required",
  //         errorCode: EErrorCode.ERROR_CODE_400,
  //       });
  //     }

  //     // Fetch unit details from the service
  //     const unitDetails = await PropertyService.getUnitDetails(userId, userEmail, unitId);

  //     // Send successful response
  //     Utility.sendResponse(res, {
  //       data: unitDetails,
  //       message: "Unit details retrieved successfully",
  //     });
  //   } catch (error) {
  //     // Handle errors
  //     Utility.returnError(res, error);
  //   }
  // },

  isAddressUnique: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyID: string = req.params["propertyID"];
      const address = req.query.address as string;
      Utility.checkRequiredFields({ propertyID, address });

      Utility.sendResponse(res, {
        data: { isUnique: await PropertyService.isAddressUnique(propertyID, address) },
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Explicitly convert query params
      const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 8;

      // Ensure converted values are passed correctly
      const query = new PropertySearchQueryDto({
        ...req.query,
        pageNumber,
        pageSize,
      });

      await Utility.validate(query);
      Utility.sendResponse(res, {
        data: await PropertyService.searchProperties(query),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getAmenities: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await KVPService.getByKey(KVPCategory.amenity),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  updateMetadataForAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Utility.sendResponse(res, {
        data: await PropertyService.updateMetadataForAll(),
        message: `Metadata generated for all properties`,
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  getProperties: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let properties: Property = await dataSource.getRepository(PropertyEntity).query(`
        SELECT * FROM "property"
        `);

      Utility.sendResponse(res, {
        data: properties,
        message: "All properties",
      });
    } catch (err) {
      logger.error("An error occured in returning all properties");
      logger.error(err);
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyID } = req.params;
      const { description, type, city, state, address, price } = req.body;
      const updatedProperty = await dataSource.getRepository(PropertyEntity).query(
        `
            UPDATE "property" set description = $1, type = $2, city = $3, state  = $4, address = $5, price = $6 
            WHERE property_id = $7`,
        [description, type, city, state, address, price, propertyID]
      );

      Utility.sendResponse(res, {
        data: updatedProperty,
        message: "property details updated",
      });
    } catch (err) {
      logger.error("An error occured updating property");
      logger.error(err);
      next(err);
    }
  },

  searchPartOne: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { priceRange, amenities, bedrooms, bathrooms, propertyType, rentLength } = req.query;

      let query = dataSource.getRepository(PropertyEntity).createQueryBuilder("property");

      if (propertyType) {
        query = query.andWhere("property.type = propertyType", {
          propertyType,
        });
      }

      if (priceRange) {
        const [minPrice, maxPrice] = String(priceRange).split("-").map(Number);
        query = query
          .andWhere("property.price >= minPrice", { minPrice })
          .andWhere("property.price <= maxPrice", { maxPrice });
      }

      if (bedrooms) {
      }

      if (bathrooms) {
      }

      if (rentLength) {
      }

      if (amenities) {
        query = query.andWhere("property.amenities ILIKE amenities", {
          amenities: `%${amenities}%`,
        });
      }

      const properties = await query.getMany();

      Utility.sendResponse(res, {
        data: { properties },
      });
    } catch (err) {
      logger.error("Error fetch the property");
      logger.error(err.message);
      next(error);
    }
  },

  // fetch amenities endpoint
  uniqueAmenities: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const properties = await dataSource.getRepository(PropertyEntity).find();
      const allAmenities: string[] = [];

      properties.forEach((property) => {
        if (property.amenities) {
          allAmenities.push(...property.amenities);
        }
      });

      const uniqueAmenities = Array.from(new Set(allAmenities));
      Utility.sendResponse(res, {
        data: { uniqueAmenities },
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  propAmenities: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyID } = req.params;
      const result = (await PropertyService.getByID(propertyID)).amenities;

      Utility.sendResponse(res, {
        data: result,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  propertyTypes: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const AVAILABLE = AvailabilityStatuses.AVAILABLE;
      const query = `
        SELECT DISTINCT type
        FROM property
        WHERE status = $1`;

      const result = await dataSource.getRepository(PropertyEntity).query(query, [AVAILABLE]);

      Utility.sendResponse(res, {
        data: result,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  propCombo: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyID } = req.params;
      const property = await PropertyService.getByID(propertyID);
      // const unit = await PropertyUnitService.getUnitByPropertyID(propertyID);
      const combo = {
        ...property,
        // ...unit,
      };
      Utility.sendResponse(res, {
        data: combo,
      });
    } catch (err) {
      logger.error(err);
    }
  },

  location: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { keyword } = req.params;

      const locations = keyword
        ? await PropertyService.getLocationsByKeyword(keyword)
        : await PropertyService.getDefaultLocations();
      Utility.sendResponse(res, {
        data: locations,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  props: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: STATUS_SUCCESS,
        data: propertyProps,
      });
    } catch (error) {
      logger.error("An error occured in returning property props");
      logger.error(error);
      next(error);
    }
  },

  myProperties: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      // Explicitly convert query params
      const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 8;

      // Ensure converted values are passed correctly
      const query = new PropertySearchQueryDto({
        ...req.query,
        pageNumber,
        pageSize,
      });
      await Utility.validate(query);
      const sender = req.sender.id;
      console.log("Query created by is", sender);
      Utility.sendResponse(res, {
        data: await PropertyService.myProperties(sender, query),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  withdrawApplication: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userid = req.sender.id;
      const unitid = req.body.unitId;
      const result = await PropertyService.withdrawApplication(userid, unitid);
      Utility.sendResponse(res, {
        data: result,
        message: "Application withdrawn successfully",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  //fetchApprovedProperties
  fetchApprovedProperties: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const lessorUserId = req.sender.id;
      let properties = await PropertyService.fetchApprovedProperties(lessorUserId);
      Utility.sendResponse(res, {
        data: { data: properties, total: properties.length },
        message: "Successfully fetched properties",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  myReceivedApplicationProperties: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const lessorUserId = req.params.lessorUserId;
      let properties = await PropertyService.fetchPropertiesWithReceivedApplications(lessorUserId);
      Utility.sendResponse(res, {
        data: { data: properties, total: properties.length },
        message: "Successfully fetched properties",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  fetchInterestedApplicants: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const propertyId = req.params.propertyId;
      let properties = await PropertyService.fetchInterestedApplicants(propertyId);
      Utility.sendResponse(res, {
        data: {
          data: instanceToPlain(properties), // <<< Important part here
          total: properties.length,
        },
        message: "Successfully fetched properties",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  // fetchInterestedApplicants: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const propertyId = req.params.propertyId;
  //     const lessorUserId = req.user.id; // Ensure `req.user` is populated from middleware

  //     const users = await PropertyService.fetchInterestedApplicants(propertyId, lessorUserId);

  //     Utility.sendResponse(res, {
  //       data: { data: users, total: users.length },
  //       message: "Successfully fetched applicants",
  //     });
  //   } catch (error) {
  //     Utility.returnError(res, error);
  //   }
  // },



  mySubmittedApplications: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let properties = await PropertyService.fetchPropertiesWithSubmittedApplications(
        req.sender.id
      );
      Utility.sendResponse(res, {
        data: { data: properties, total: properties.length },
        message: "Successfully fetched properties",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  billingStructure: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyID, unitID } = req.params;
      const billingStructure = await PropertyService.generateBillingAnalytics(propertyID, unitID);

      Utility.sendResponse(res, {
        data: billingStructure,
        message: "Successfully generated billing analytics",
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },

  rentedUnits: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     try {

      // Explicitly convert query params
      const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 8;

      // Ensure converted values are passed correctly
      const query = new PropertySearchQueryDto({
        ...req.query,
        pageNumber,
        pageSize,
      });
      await Utility.validate(query);
      const sender = req.sender.id;
      console.log("Query created by is", sender);
      Utility.sendResponse(res, {
        data: await PropertyService.getRentedUnits(sender, query),
      });
    } catch (error) {
      Utility.returnError(res, error);
    }
  },
};

export const propertyProps = {
  transactionTypes: Object.values(TransactionTypes),
  leaseTerms: Object.values(LeaseTerms),
  lessorCategories: Object.values(LessorCategories),
  availabilityStatuses: Object.values(AvailabilityStatuses),
  propertyTypes: Object.values(PropertyType),
  paymentTypes: Object.values(PaymentTypes),
};
export default PropertyController;
