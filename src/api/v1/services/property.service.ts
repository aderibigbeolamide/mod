import { dataSource } from "../../../config/database.config.js";
import {
  PropertyEntity,
  PropertyMediaEntity,
  PropertyUnitEntity,
} from "../entities/property.entity.js";
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
import SearchService from "./search.service.js";
import Utility from "../../../utils/utility.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { PropertyUnit, PropertyUnitAnalytics } from "../interfaces/unit.interface.js";
import { Coordinates } from "../interfaces/base.interface.js";
import { SearchQuery, SearchQueryItem, SearchResponse } from "../interfaces/search.interface.js";
import { SearchCondition } from "../enums/search.enum.js";
import { filter, uniq } from "lodash-es";
import { User } from "../interfaces/user.interface.js";
import { MediaEntity } from "../entities/media.entity.js";
import { MediaTypes } from "../enums/media-types.enum.js";
import { MediaCategories } from "../enums/media-categories.enum.js";
import { RequestToRentEntity } from "../entities/request-to-rent.entity.js";
import { Property } from "../interfaces/property.interface.js";
import { PaymentRateDto } from "../dtos/paymentRate.dto.js";
import { PropertyFeeEntity } from "../entities/property-fee.entity.js";
import { PropertyFeeDto } from "../dtos/propertyFee.dto.js";
import PaymentRateService from "./paymentRate.service.js";
import { PaystackApi } from "./paystack.service.js";
import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { TourRequestEntity } from "../entities/tour-request.entity.js";
import { PaymentEntity } from "../entities/payment.entity.js";
import CommService from "./comm.service.js";
import { logger } from "../../../config/logger.js";
import { BillingAnalytics } from "../interfaces/billingAnalytics.interface.js";
import MediaService from "./media.service.js";
import { LeaseAgreementService } from "./lease-agreement.service.js";

import type { Request } from "express";
import { LeaseTerms } from "../enums/lease.terms.enum.js";

export default class PropertyService {
  static repo = dataSource.getRepository(PropertyEntity);
  static repoUnit = dataSource.getRepository(PropertyUnitEntity);
  static mediaRepo = dataSource.getRepository(MediaEntity);
  static propertyMediaRepo = dataSource.getRepository(PropertyMediaEntity);
  static propertyFeeRepo = dataSource.getRepository(PropertyFeeEntity);
  static paymentRateService = new PaymentRateService();
  static mediaService = new MediaService();
  static requestToRentRepo = dataSource.getRepository(RequestToRentEntity);
  static requestToTourRepo = dataSource.getRepository(TourRequestEntity);
  static paymentRepo = dataSource.getRepository(PaymentEntity);
  static paystackApi = new PaystackApi();
  unitRepo: any;
  static commService = new CommService();
  static leaseAgreementService = new LeaseAgreementService();

  public static getRates(price: number, hasAgencyFee: boolean): [number, number] {
    const rateMap = [
      {
        maxPrice: 1000000,
        tenantRate: hasAgencyFee ? 2 : 4,
        landlordRate: hasAgencyFee ? 1.25 : 2,
      },
      {
        maxPrice: 3000000,
        tenantRate: hasAgencyFee ? 1.8 : 3.8,
        landlordRate: hasAgencyFee ? 1.25 : 2,
      },
      {
        maxPrice: 6000000,
        tenantRate: hasAgencyFee ? 1.6 : 3.6,
        landlordRate: hasAgencyFee ? 1.25 : 2,
      },
      {
        maxPrice: Infinity,
        tenantRate: hasAgencyFee ? 1.4 : 3.4,
        landlordRate: hasAgencyFee ? 1.25 : 2,
      },
    ];

    const rate = rateMap.find((r) => price < r.maxPrice);
    if (!rate) {
      throw new Error("Rates not found");
    }

    return [rate.tenantRate, rate.landlordRate];
  }

  public static async initiatePropertyCreation(dto: PropertyInitiateDto, user: User) {
    const property = new PropertyEntity();
    property.createdBy = user.id;
    property.transactionType = dto.transactionType;

    const savedProperty = await this.repo.save(property);

    // try {
    //   // Send email notification
    //   await this.commService.sendPropertyPostedEmail(user.email);
    // } catch (emailError) {
    //   logger.error(`Failed to send property listing email to ${user.email}: ${emailError.message}`);
    // }

    return savedProperty;
  }

  public static async updateProperty(id: string, dto: PropertyUpdateDto) {
    // debugger;
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });
    const prop = Object.assign(new PropertyEntity(), dto);
    prop.isAddressVerified = await this.isAddressUnique(id, dto.address);
    prop.addressID = dto.address ? this.convertAddressToAddressID(dto.address) : null;
    if (prop.coordinates) prop.coordinates = `(${prop.coordinates.x},${prop.coordinates.y})` as any;
    if (prop.unitCategories?.length) {
      await this.updateUnitCategories(id, prop);
      delete prop.unitCategories;
      delete prop.units;
    } else if (prop.units?.length) {
      await this.updateUnits(id, prop);
      delete prop.units;
    } else {
      this.generateUnitAnalytics(id);
    }

    delete prop.id;
    await this.repo.update({ id }, prop);
    return this.getByID(id);
  }

  //getApprovedProperty
  public static async fetchApprovedProperties(userId: string): Promise<Property[]> {
    const properties = await this.repo
      .createQueryBuilder("property")
      .innerJoin(RequestToRentEntity, "requestToRent", "requestToRent.propertyId = property.id")
      .where("property.createdBy = :userId", { userId })
      .andWhere("requestToRent.isApproved = true")
      .getMany();

    return properties;
  }

  public static async fetchPropertiesWithReceivedApplications(userId: string): Promise<Property[]> {
    const properties = await this.repo
      .createQueryBuilder("property")
      .innerJoin(RequestToRentEntity, "requestToRent", "requestToRent.propertyId = property.id")
      .leftJoinAndSelect("property.propertyMedia", "media")
      .where("property.createdBy = :userId", { userId })
      .andWhere("requestToRent.isComplete = true")
      .getMany();

    return properties;
  }

  // public static async fetchInterestedApplicants(userId: string): Promise<Property[]> {
  //   const properties = await this.repo
  //     .createQueryBuilder("property")
  //     .innerJoinAndSelect(RequestToRentEntity, "requestToRent", "requestToRent.propertyId = property.id")
  //     .innerJoinAndSelect("requestToRent.user", "user")
  //     // .innerJoinAndSelect("requestToRent.userDetails", "userDetails")
  //     .leftJoinAndSelect("property.propertyMedia", "media")
  //     .where("property.createdBy = :userId", { userId })
  //     .andWhere("requestToRent.isComplete = true")
  //     .getMany();

  //   return properties;
  // }

  // public static async fetchInterestedApplicants(userId: string, ): Promise<Property[]> {
  //   const properties = await this.repo
  //     .createQueryBuilder("property")
  //     .innerJoin("property.rentRequests", "requestToRent", "requestToRent.isComplete = true")
  //     // .leftJoinAndSelect("property.propertyMedia", "media")
  //     .leftJoinAndSelect("property.rentRequests", "rentRequests") // include requests
  //     .leftJoinAndSelect("rentRequests.user", "user") // include user entity
  //     .leftJoinAndSelect("rentRequests.userDetails", "userDetails") // optionally include detailed user info
  //     // .leftJoinAndSelect("rentRequests.unit", "unit") // optionally include unit info
  //     .where("property.createdBy = :userId", { userId })
  //     .getMany();

  //   return properties;
  // }

  // public static async fetchInterestedApplicants(userId: string): Promise<RequestToRentEntity[]> {
  //   const rentRequests = await this.requestToRentRepo
  //     .createQueryBuilder("request")
  //     .leftJoinAndSelect("request.property", "property")
  //     .leftJoinAndSelect("request.user", "user")
  //     .leftJoinAndSelect("request.userDetails", "userDetails")
  //     // .leftJoinAndSelect("request.unit", "unit") // optionally include unit info
  //     .where("property.createdBy = :userId", { userId })
  //     .andWhere("request.isComplete = true")
  //     .getMany();

  //   return rentRequests;
  // }

  public static async fetchInterestedApplicants(propertyId: string): Promise<RequestToRentEntity[]> {
    const rentRequests = await this.requestToRentRepo
      .createQueryBuilder("request")
      .leftJoin("request.property", "property") // only joins, doesn't fetch full property object
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.userDetails", "userDetails")
      .where("property.id = :propertyId", { propertyId })
      .andWhere("request.isComplete = true")
      .addSelect(["request.propertyId"]) // ensure propertyId is selected
      .getMany();

    return rentRequests;
  }



  // public static async fetchInterestedApplicants(propertyId: string, userId: string) {
  //   const property = await this.repo.findOne({
  //     where: {
  //       id: propertyId,
  //       createdBy: userId, // Ensure the property belongs to the owner
  //     },
  //     relations: [
  //       "requestToRent",
  //       "requestToRent.unit", // Include unit details if needed
  //       "propertyMedia", // Include property media if 
  //       "requestToRent.user", // Get user details from request
  //     ],
  //   });

  //   if (!property) {
  //     Utility.throwException({
  //       statusNo: 404,
  //       message: `Property with ID ${propertyId} not found or does not belong to you.`,
  //     });
  //   }

  //   // Optionally filter only completed requests
  //   const requests = property.rentRequests.filter(req => req.isComplete);

  //   // Extract user details from each request
  //   const users = requests.map(req => req.user);

  //   return users;
  // }



  public static async fetchPropertiesWithSubmittedApplications(
    userId: string
  ): Promise<Property[]> {
    let properties = await this.repo
      .createQueryBuilder("property")
      .select([
        "property.id",
        "property.address",
        "property.lga",
        "property.floorNumber",
        "property.area",
        "property.amenities",
        "property.advertisedUnit",
        "property.availability",
        "property.cautionFee",
        "property.coordinates",
        "property.description",
        "property.city",
        "property.state",
        "property.status",
        "property.type",
        "property.utilities",
        "r.createdAt AS requestDate",
        "media.imageUrls AS propertyImages",
      ])
      .innerJoin(RequestToRentEntity, "r", "r.propertyId = property.id")
      .leftJoinAndSelect("property.propertyMedia", "media")
      .where("r.userId = :userId AND r.isComplete = true", { userId })
      .getMany();

    return properties;
  }

  public static async updatePropertyAvailabilityFee(
    id: string,
    dto: PropertyAvailabilityUpdateDto
  ) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { availability: dto });
    return this.getByID(id);
  }

  public static async updatePropertyArchive(id: string, dto: PropertyArchiveUpdateDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { isArchived: dto.isArchived });
    return this.getByID(id);
  }

  public static async deleteByID(id: string) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    const item = await this.getByID(id);
    await this.repo.delete({ id });
    // Delete associated media from S3 if applicable
    // You may need to loop through media items if there are multiple
    if (item.propertyMedia && item.propertyMedia.mediaIds) {
      for (const mediaId of item.propertyMedia.mediaIds) {
        await this.mediaService.deleteFromS3(mediaId, true);
      }
    }
    return item;
  }

  public static async updatePropertyCautionFee(id: string, dto: PropertyCautionFeeUpdateDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });
    await this.repo.update({ id }, { cautionFee: dto });
    return this.getByID(id);
  }
  public static async updatePropertyTour(id: string, dto: PropertyTourAvailabilityUpdateDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { tourAvailability: dto });
    return this.getByID(id);
  }

  public static async updateUnitCategories(id: string, dto: PropertyUnitCategoriesDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });
    try {
      const property = await this.getByID(id);

      const newUnits: PropertyUnitEntity[] = [];

      let deleteUnits: string[] = [];
      if (property.units?.length) {
        if (property.units.find((x) => x.status != AvailabilityStatuses.AVAILABLE))
          Utility.throwException({
            statusNo: 400,
            message: `Please use the update property units endpoint as the units have already been acted upon by other users`,
          });
        deleteUnits = property.units.map((x) => x.id);
      }

      for (const item of dto.unitCategories)
        newUnits.push(
          ...new Array(item.noOfSimilarUnits).fill(Object.assign(new PropertyUnitEntity(), item))
        );

      await Promise.all(
        deleteUnits
          .map<Promise<any>>((id) => this.repoUnit.delete({ id }))
          .concat(newUnits.map((unit) => this.repoUnit.save({ ...unit, property })))
      );

      this.generateUnitAnalytics(id);

      return this.getByID(id);
    } catch (error) {
      Utility.throwException({
        statusNo: 500,
        message: `Error occured while updating unit categories`,
        errorObject: error,
      });
    }
  }

  public static async updateUnits(id: string, dto: PropertyUnitsDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });
    if (!dto) return;

    try {
      const property = await this.getByID(id);
      const existingUnitsMap = Utility.arrayToMap(property.units, "id");
      delete property.units;

      const newUnits: PropertyUnitEntity[] = [];
      const updateUnits: PropertyUnitEntity[] = [];
      const deleteUnits: string[] = [];

      for (const unit of dto.units)
        if (!unit.id) newUnits.push(Object.assign(new PropertyUnitEntity(), unit));
        else if (existingUnitsMap[unit.id])
          if (unit.delete) deleteUnits.push(unit.id);
          else updateUnits.push(Object.assign(new PropertyUnitEntity(), unit));

      // await Promise.all(updateUnits.map((unit) => this.repoUnit.update({ id: unit.id }, unit)));

      // await Promise.all(deleteUnits.map((id) => this.repoUnit.delete({ id })));

      // await Promise.all(newUnits.map((unit) => this.repoUnit.save({ ...unit, property })));
      await Promise.all(
        updateUnits
          .map<Promise<any>>((unit) => this.repoUnit.update({ id: unit.id }, unit))
          .concat(deleteUnits.map((id) => this.repoUnit.delete({ id })))
          .concat(newUnits.map((unit) => this.repoUnit.save({ ...unit, property })))
      );

      this.generateUnitAnalytics(id);

      return this.getByID(id);
    } catch (error) {
      Utility.throwException({
        statusNo: 500,
        message: `Error occured while updating units`,
        errorObject: error,
      });
    }
  }

  public static async generateUnitAnalytics(propertyID: string) {
    try {
      const { units } = await this.getByID(propertyID);
      const au: Partial<PropertyUnitAnalytics> = {};
      const numFields: { field: keyof PropertyUnit; dp?: number }[] = [
        { field: "agencyFeePercentage", dp: 2 },
        { field: "fixedAgencyFee", dp: 2 },
        { field: "noOfBathrooms" },
        { field: "noOfBathroomsEnsuite" },
        { field: "noOfBedrooms" },
        { field: "price", dp: 2 },
        { field: "squareFeet" },
      ];
      const otherFields: { field: keyof PropertyUnit }[] = [
        { field: "dateAvailable" },
        { field: "hasAgencyFee" },
        { field: "paymentSchedule" },
      ];

      for (const unit of units) {
        for (const { field } of numFields) {
          const val = unit[field];
          if (typeof val == "number") {
            if (!au[field]) au[field] = {};
            if (!au[field].max || au[field].max < val) au[field].max = val;
            if (!au[field].min || au[field].min > val) au[field].min = val;
            au[field].total = (au[field].total || 0) + val;
          }
        }
      }

      for (const { field, dp } of numFields) {
        if (au[field]) {
          au[field].average = +(au[field].total / units.length).toFixed(dp || 0);
          // debugger;
          au[field].values = uniq(units.map((x) => x[field]?.toString())).filter((x) => x != null);
        } else au[field] = {};
      }

      for (const { field } of otherFields) {
        if (!au[field]) au[field] = {};
        // au[field].value = units.find((x) => x[field])?.[field];
        au[field].values = uniq(units.map((x) => x[field]?.toString())).filter((x) => x != null);
      }

      return await this.repo.update({ id: propertyID }, { advertisedUnit: au });
    } catch (error) {
      debugger;
      Utility.throwException({
        statusNo: 500,
        message: `Error occured while generating advertised unit`,
        errorObject: error,
      });
    }
  }

  public static async updateMetadataForAll() {
    const totalLenth = await this.repo.count();
    for (let index = 0; index < totalLenth; index++) {
      this.repo.find({ take: 1, skip: index, select: { id: true } }).then((element) => {
        if (element[0]) this.generateUnitAnalytics(element[0].id);
      });
    }
  }

  public static async updatePropertyLeasePolicy(id: string, dto: PropertyLeasePolicyUpdateDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { leasePolicy: dto });
    return this.getByID(id);
  }

  public static async updateAmmenities(id: string, dto: PropertyAmmenityDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, dto);
    return this.getByID(id);
  }

  public static async updateUtilities(id: string, dto: PropertyUtilitiesUpdateDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { utilities: dto });
    return this.getByID(id);
  }

  public static async updateFAQ(id: string, dto: PropertyFAQDto) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, dto);
    return this.getByID(id);
  }

  public static async finalizeProperty(id: string, user: User) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    // generate property media
    let galleryImageMedia = await this.mediaRepo.find({
      select: { id: true, publicUrl: true },
      where: {
        refId: id,
        isPublic: true,
        mediaType: MediaTypes.IMAGE,
        mediaCategory: MediaCategories.GALLERY_IMAGE,
      },
    });

    let propVideoMedia = await this.mediaRepo.find({
      select: { id: true, publicUrl: true },
      where: {
        refId: id,
        isPublic: true,
        mediaType: MediaTypes.VIDEO,
        mediaCategory: MediaCategories.GALLERY_VIDEO,
      },
    });

    let leaseDocument = await this.mediaRepo.findOne({
      select: { id: true, mediaFileName: true, publicUrl: true },
      where: {
        refId: id,
        mediaType: MediaTypes.DOCUMENT,
        mediaCategory: MediaCategories.LEASE_DOCUMENT,
      },
    });

    let leaseDocumentUrl = leaseDocument?.publicUrl;
    let imageUrls = galleryImageMedia.map((media) => media.publicUrl);
    let videoUrls = propVideoMedia.map((media) => media.publicUrl);

    let mediaIds = galleryImageMedia
      .map((media) => media.id)
      .concat(propVideoMedia.map((media) => media.id));

    if (leaseDocument) {
      mediaIds.push(leaseDocument.id);
    }

    // build propertyMedia
    let propertyMedia = new PropertyMediaEntity();
    propertyMedia.imageUrls = imageUrls;
    propertyMedia.videoUrls = videoUrls;
    propertyMedia.mediaIds = mediaIds;

    if (leaseDocument) {
      // user uploaded a lease document
      propertyMedia.leaseDocumentUrl = leaseDocumentUrl;
      propertyMedia.leaseDocumentName = leaseDocument.mediaFileName;
      propertyMedia.useLetBudTemplate = false;
    } else {
      // no lease document uploaded, assume LetBud template
      propertyMedia.leaseDocumentUrl = null;
      propertyMedia.leaseDocumentName = null;
      propertyMedia.useLetBudTemplate = true;
    }

    await this.propertyMediaRepo.save(propertyMedia);

    await this.repo.update({ id }, { isComplete: true, propertyMedia });

    try {
      // Send email notification
      await this.commService.sendPropertyPostedEmail(user.email);
    } catch (emailError) {
      logger.error(
        `Failed to send property listing email to ${user.email}: ${emailError.message}`
      );
    }

    return this.getByID(id);
  }


  public static async disable(id: string) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { isDisabled: true });
    return this.getByID(id);
  }

  // getAllProperties
  public static async getAllProperties(query: PropertySearchQueryDto) {
    // only fetch property where isComplete is true
    return this.repo.find();
  }

  public static async enable(id: string) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { isDisabled: false });
    return this.getByID(id);
  }

  public static async verify(id: string) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { isVerified: true });
    return this.getByID(id);
  }

  public static async unverify(id: string) {
    if (!(await this.verifyID(id)))
      Utility.throwException({
        statusNo: 400,
        message: `Property ID ${id} does not exist`,
      });

    await this.repo.update({ id }, { isVerified: false });
    return this.getByID(id);
  }

  public async checkUserStatus(userId: string, unitId: string) {
    // Fetch the property unit with relevant details
    const unit = await this.unitRepo.findOne({
      where: { id: unitId },
      relations: ["payments", "rentRequests", "tourRequests"], // Include relationships if they are lazy-loaded
    });

    if (!unit) {
      throw new Error(`Unit with ID ${unitId} does not exist.`);
    }

    // Check if the user has paid
    const hasPaid = unit.payments.some((payment) => payment.payerId === userId && payment.paid);

    // Check if the user's application has been approved
    const applicationApproved = unit.applicationApproved;

    // Check if the user has already applied
    const alreadyApplied = unit.alreadyApplied;

    // Check if the user has requested a tour
    const requestedTour = unit.requestedTour;

    // Check if the user has requested to rent
    const requestedToRent = unit.requestedToRent;

    // Return the status object
    return {
      hasPaid,
      applicationApproved,
      alreadyApplied,
      requestedTour,
      requestedToRent,
    };
  }

  // public static async getUnitDetails(userId: string, userEmail: string, unitId: string) {
  //   const unit = await dataSource
  //     .getRepository(PropertyUnitEntity)
  //     .createQueryBuilder("unit")
  //     .leftJoinAndSelect("unit.rentRequests", "rentRequest", "rentRequest.userId = :userId", { userId })
  //     .leftJoinAndSelect("unit.tourRequests", "tourRequest", "tourRequest.email = :email", { email: userEmail })
  //     .leftJoinAndSelect("unit.payments", "payment", "payment.payer = :userId", { userId })
  //     .where("unit.id = :unitId", { unitId })
  //     .getOne();

  //   if (!unit) {
  //     Utility.throwException({
  //       statusNo: 404,
  //       message: `Unit ID ${unitId} not found`,
  //     });
  //   }

  //   return {
  //     hasRequestedToRent: unit.rentRequests?.length > 0,
  //     hasRequestedTour: unit.tourRequest?.length > 0,
  //     hasPaid: unit.payments?.some((payment) => payment.status === PaymentStatuses.CONFIRMED),
  //     isApplicationApproved: unit.rentRequests?.some((request) => request.isApprove),
  //     hasApplied: unit.rentRequests?.length > 0,
  //     unitDetails: unit,
  //   };
  // }

  public static async getUnitStatus(userId: string, unitId: string) {
    // Check if user has requested to tour the unit
    const tourRequested = await this.requestToTourRepo.findOne({
      where: { userDetails: { id: userId }, unitId: unitId },
    });

    // Check if user has requested to rent the unit
    const rentRequested = await this.requestToRentRepo.findOne({
      where: { userId: userId, unit: { id: unitId }, applicationWithdrawn: false, isComplete: true },
    });

    // Check if user has made a payment
    const hasPaid = await this.paymentRepo.findOne({
      where: { payer: { id: userId }, unit: { id: unitId }, status: PaymentStatuses.CONFIRMED }, 
    });

    // Check if user application is approved
    const isApproved = await this.requestToRentRepo.findOne({
      where: {
        user: { id: userId },
        unit: { id: unitId },
        isApprove: true,
      },
    });

    // check if user has signed the lease agreement
    const leaseAgreementSigned = await this.requestToRentRepo.findOne({
      where: {
        user: { id: userId },
        unit: { id: unitId },
        leaseAgreementSigned: true,
      },
    });

    // get the lease agreement signed date
    if (leaseAgreementSigned) {
      leaseAgreementSigned.leaseAgreementSignedAt = leaseAgreementSigned.leaseAgreementSignedAt instanceof Date
        ? leaseAgreementSigned.leaseAgreementSignedAt
        : new Date();
    }

    return {
      tourRequested: !!tourRequested,
      rentRequested: !!rentRequested,
      hasPaid: !!hasPaid,
      isApproved: !!isApproved,
      leaseAgreementSigned: !!leaseAgreementSigned,
      leaseAgreementSignedDate: leaseAgreementSigned?.leaseAgreementSignedAt || null,
    };
  }

  public static async withdrawApplication(userId: string, unitId: string) {
    const request = await this.requestToRentRepo.findOne({
      where: {
        user: { id: userId },
        unit: { id: unitId },
        applicationWithdrawn: false,
      },
      relations: ["unit", "user"],
    });

    if (!request) {
      Utility.throwException({
        statusNo: 404,
        message: "No rental application found to withdraw.",
      });
    }

    // 2️⃣ Update rent request flags
    request.isApprove = false;
    request.isComplete = false;
    request.leaseAgreementSigned = false;
    request.applicationWithdrawn = true;
    request.withdrawnAt = new Date();

    await this.requestToRentRepo.save(request);

    // 3 Reverse any payments (if applicable)
    const payment = await this.paymentRepo.findOne({
      where: {
        payer: { id: userId },
        unit: { id: unitId },
      },
    });
    if (payment) {
      payment.status = PaymentStatuses.REFUNDED; // or PaymentStatuses.CANCELLED
      await this.paymentRepo.save(payment);
    }

    // 4 Cancel tour request if exists
    const tourRequest = await this.requestToTourRepo.findOne({
      where: {
        userDetails: { id: userId },
        unitId,
      },
    });
    if (tourRequest) {
      await this.requestToTourRepo.remove(tourRequest); // or set an `isCancelled` flag
    }

    return {
      tourRequested: !!tourRequest,
      rentRequested: !!request,
      hasPaid: !!payment,
      isApproved: !!request.isApprove,
      leaseAgreementSigned: !!request.leaseAgreementSigned,
      message: "Rental application withdrawn successfully.",
      withdrawnAt: request.withdrawnAt,
      paymentStatus: payment ? payment.status : null,
    };
  }

  public static async signLeaseAgreement(userId: string, unitId: string, clientIp?: string) {
    const request = await this.requestToRentRepo.findOne({
      where: {
        user: { id: userId },
        unit: { id: unitId },
        isApprove: true,
      },
      relations: ['property', 'property.propertyMedia', 'property.lessorInfo'],
    });

    if (!request) {
      Utility.throwException({
        statusNo: 403,
        message: "Lease cannot be signed until rent request is approved.",
      });
    }

    if (request.leaseAgreementSigned) {
      Utility.throwException({
        statusNo: 400,
        message: "Lease agreement has already been signed.",
      });
    }

    const signedAt = new Date();
    
    request.leaseAgreementSigned = true;
    request.leaseAgreementSignedAt = signedAt;
    if (clientIp) {
      request.tenantSignedByIp = clientIp;
    }

    try {
      const property = Array.isArray(request.property) ? request.property[0] : request.property;
      const propertyMedia = property?.propertyMedia;

      if (propertyMedia?.useLetBudTemplate) {
        const leaseResult = await this.leaseAgreementService.generateFinalSignedLeaseAgreement(
          request.id
        );

        request.leaseAgreementUrl = leaseResult.s3Url;

        logger.info(`LetBud template lease agreement signed and regenerated with tenant signature for request: ${request.id}`);
      } else {
        const leaseDocumentUrl = request.leaseAgreementUrl || propertyMedia?.leaseDocumentUrl;

        if (!leaseDocumentUrl) {
          throw new Error('No lease document available to sign');
        }

        const landlordPdfBuffer = await this.leaseAgreementService.downloadPDFFromS3(leaseDocumentUrl);

        const landlordName = `${property.lessorInfo?.firstName || ''} ${property.lessorInfo?.lastName || ''}`.trim();
        const tenantName = `${request.firstName || ''} ${request.lastName || ''}`.trim();

        const signaturePageBuffer = await this.leaseAgreementService.generateSignaturePage(
          landlordName,
          request.landlordSignedAt || new Date(),
          request.landlordSignedByIp || 'Unknown',
          tenantName,
          signedAt,
          clientIp || 'Unknown'
        );

        const mergedPdfBuffer = await this.leaseAgreementService.mergePDFs(
          landlordPdfBuffer,
          signaturePageBuffer
        );

        const s3Url = await this.leaseAgreementService.saveLeaseAgreementToS3(
          request.id,
          mergedPdfBuffer
        );

        request.leaseAgreementUrl = s3Url;

        logger.info(`Landlord's lease document merged with signature page for request: ${request.id}`);
      }
    } catch (error) {
      logger.error(`Failed to process lease agreement signing for request ${request.id}:`, error);
      throw error;
    }

    await this.requestToRentRepo.save(request);

    return {
      message: "Lease agreement signed successfully.",
      leaseSigned: true,
      signedAt: request.leaseAgreementSignedAt,
      leaseAgreementUrl: request.leaseAgreementUrl,
    };
  }

  public static async landlordUnitStatus(renterId: string, unitId: string) {
    // Check if user has requested to tour the unit
    const tourRequested = await this.requestToTourRepo.findOne({
      where: { userDetails: { id: renterId }, unitId: unitId },
    });

    // Check if user has requested to rent the unit
    const rentRequested = await this.requestToRentRepo.findOne({
      where: { userId: renterId, unit: { id: unitId } },
    });

    const leaseAgreementSigned = await this.requestToRentRepo.findOne({
      where: { userId: renterId, unit: { id: unitId }, leaseAgreementSigned: true },
    });

    // Check if user has made a payment
    const hasPaid = await this.paymentRepo.findOne({
      where: { payer: { id: renterId }, unit: { id: unitId } },
    });

    // get the lease agreement signed date
    if (leaseAgreementSigned) {
      leaseAgreementSigned.leaseAgreementSignedAt = leaseAgreementSigned.leaseAgreementSignedAt instanceof Date
        ? leaseAgreementSigned.leaseAgreementSignedAt
        : new Date();
    }

    // Check if user application is approved
    const isApproved = await this.requestToRentRepo.findOne({
      where: {
        user: { id: renterId },
        unit: { id: unitId },
        isApprove: true,
      },
    });

    return {
      tourRequested: !!tourRequested,
      rentRequested: !!rentRequested,
      hasPaid: !!hasPaid,
      isApproved: !!isApproved,
      leaseAgreementSigned: !!leaseAgreementSigned,
      leaseAgreementSignedDate: leaseAgreementSigned?.leaseAgreementSignedAt || null,
    };
  }

  // public static async getTenantUnitStatusForLandlord(unitId: string, renterId: string) {
  //   // Check if renter requested a tour
  //   const tourRequested = await this.requestToTourRepo.findOne({
  //     where: {
  //       unit: { id: unitId },
  //       userDetails: { id: renterId },
  //     },
  //   });

  //   // Check if renter submitted a rental application
  //   const rentRequested = await this.requestToRentRepo.findOne({
  //     where: {
  //       user: { id: renterId },
  //       unit: { id: unitId },
  //     },
  //   });

  //   // Check if application was approved
  //   const isApproved = await this.requestToRentRepo.findOne({
  //     where: {
  //       user: { id: renterId },
  //       unit: { id: unitId },
  //       isApprove: true,
  //     },
  //   });

  //   // Check if payment was made
  //   const hasPaid = await this.paymentRepo.findOne({
  //     where: {
  //       payer: { id: renterId },
  //       unit: { id: unitId },
  //     },
  //   });

  //   // Check if lease is signed (usually reflected in the unit record)
  //   const unit = await dataSource.getRepository(PropertyUnitEntity).findOne({
  //     where: {
  //       id: unitId,
  //       leaseAgreementSigned: true,
  //     },
  //   });

  //   return {
  //     tourRequested: !!tourRequested,
  //     rentRequested: !!rentRequested,
  //     isApproved: !!isApproved,
  //     hasPaid: !!hasPaid,
  //     leaseAgreementSigned: !!unit,
  //   };
  // }


  public static async getByID(id: string) {
    const res = (
      await this.repo.find({ where: { id }, relations: { units: true, propertyMedia: true } })
    )?.[0];
    res?.units?.forEach((x) => {
      x.noOfBathrooms = x.noOfBathrooms ? +x.noOfBathrooms : null;
      x.noOfBathroomsEnsuite = x.noOfBathroomsEnsuite ? +x.noOfBathroomsEnsuite : null;
      x.noOfBedrooms = x.noOfBedrooms ? +x.noOfBedrooms : null;
      x.price = x.price ? +x.price : null;
      x.squareFeet = x.squareFeet ? +x.squareFeet : null;
    });
    return res;
  }

  public static async getPropertyByUserId(userId: string) {
    // Ensure the user ID is valid (you may want to add a user verification check if needed)
    if (!userId) {
      Utility.throwException({
        statusNo: 400,
        message: "User ID is required to fetch properties.",
      });
    }

    // Query the repository for properties posted by the user
    const properties = await this.repo.find({
      where: { lessorUserId: userId },
      relations: ["units", "propertyMedia"], // make sure the relation name is correct
    });

    // Format or process the properties as needed
    // properties.forEach((property) => {
    //   property.units?.forEach((x) => {
    //     x.noOfBathrooms = x.noOfBathrooms ? +x.noOfBathrooms : null;
    //     x.noOfBathroomsEnsuite = x.noOfBathroomsEnsuite ? +x.noOfBathroomsEnsuite : null;
    //     x.noOfBedrooms = x.noOfBedrooms ? +x.noOfBedrooms : null;
    //     x.price = x.price ? +x.price : null;
    //     x.squareFeet = x.squareFeet ? +x.squareFeet : null;
    //   });
    // });

    return properties;
  }

  public static async getPropertiesByLessorId(userId: string) {
    // Ensure the user ID is valid (you may want to add a user verification check if needed)
    if (!userId) {
      Utility.throwException({
        statusNo: 400,
        message: "User ID is required to fetch properties.",
      });
    }

    // Query the repository for properties posted by the user
    const properties = await this.repo.find({
      where: { lessorUserId: userId }, // Filter properties by user ID
      relations: ["units", "propertyMedia", "lessorUserId"], // Include related entities if needed
    });

    // Format or process the properties as needed
    properties.forEach((property) => {
      property.units?.forEach((x) => {
        x.noOfBathrooms = x.noOfBathrooms ? +x.noOfBathrooms : null;
        x.noOfBathroomsEnsuite = x.noOfBathroomsEnsuite ? +x.noOfBathroomsEnsuite : null;
        x.noOfBedrooms = x.noOfBedrooms ? +x.noOfBedrooms : null;
        x.price = x.price ? +x.price : null;
        x.squareFeet = x.squareFeet ? +x.squareFeet : null;
      });
    });

    return properties;
  }
  // public static async myProperties(
  //   lessorUserId: string,
  //   query: SearchQuery<any>,
  //   req: Request
  // ) {
  //   if (!lessorUserId) {
  //     Utility.throwException({
  //       statusNo: 400,
  //       message: "Lessor User ID is required to fetch properties.",
  //     });
  //   }

  //   // Build filter object
  //   const filter: any = {
  //     ...query,
  //     createdBy: lessorUserId,
  //   };

  //   // Allow ?isComplete=true/false if present in query
  //   if (query.hasOwnProperty("isComplete")) {
  //     filter.isComplete = query.isComplete === "true"; // Convert to boolean
  //   }

  //   return await SearchService.search(
  //     {
  //       entity: PropertyEntity,
  //       tableName: "property",
  //     },
  //     [
  //       { field: "isComplete", fieldName: "isComplete" },
  //       {
  //         field: "createdBy",
  //         fieldName: "createdBy",
  //         subFields: ["createdBy"],
  //         condition: SearchCondition.equal,
  //       },

  //     ],
  //     filter,
  //     [
  //       { columnName: "units", tableName: "unit" },
  //       { columnName: "propertyMedia", tableName: "propertyMedia" },
  //     ],
  //     false,
  //     req
  //   );
  // }

  // get Property by User Id
  public static async myProperties
    (lessorUserId: string, query: SearchQuery<any>,
    ) {
    if (!lessorUserId) {
      Utility.throwException({
        statusNo: 400,
        message: "User ID is required to fetch properties.",
      });
    }

    // Query the repository for properties posted by the user
    // const properties = await this.repo.find({
    //   where: { lessorUserId: lessorUserId }, // Filter properties by user ID
    //   // relations: ["units", "propertyMedia", "lessorUserId"], // Include related entities if needed
    // });

    // Build filter object
    const filter: any = {
      ...query,
      lessorUserId: lessorUserId,
    };

    // Allow ?isComplete=true/false if present in query
    if (query.hasOwnProperty("isComplete")) {
      filter.isComplete = query.isComplete === "true"; // Convert to boolean
    }

    return await SearchService.search(
      {
        entity: PropertyEntity,
        tableName: "property",
      },
      [
        { field: "isComplete"},
        {
          field: "lessorUserId",
          subFields: ["lessorUserId"],
          condition: SearchCondition.equal,
        },

      ],
      filter,
      [
        // { columnName: "units", tableName: "unit" },
        // { columnName: "propertyMedia", tableName: "propertyMedia" },
      ],
      false,
      false,
    );

  }



  static verifyID = (id: string) => Utility.verifyID(this.repo, id);

  /**
   *
   * @param id Property ID
   * @param address Address to check
   * @returns `true` if address is unique and `false` if it is not unique.
   */
  public static async isAddressUnique(id: string, address: string) {
    const found = await this.repo.find({
      select: { id: true, address: true, addressID: true },
      where: {
        addressID: this.convertAddressToAddressID(address),
      },
    });
    return found?.length ? (found.find((x) => x.id == id) ? true : false) : true;
  }

  static convertAddressToAddressID = (address: string) => {
    const seperator = `~//~`;
    const addr = ((address || "") + "")
      .trim()
      .toUpperCase()
      .split(" ")
      .filter((x) => x != null)
      .join(seperator);
    return addr;
  };

  // static searchPropertiesStruct: SearchQueryItem<PropertySearchQueryDto>[] = [
  //   {
  //     field: "address", condition: SearchCondition.contains,
  //     fieldName: "address"
  //   },
  //   { field: "hasCautionFee", subFields: ["cautionFee", "hasCautionFee"], fieldName: "hasCautionFee" },
  //   { field: "city", fieldName: "city" },
  //   { field: "closeToNoise", fieldName: "closeToNoise" },
  //   { field: "dateAvailable", fieldName: "dateAvailable" },
  //   { field: "description", fieldName: "description" },
  //   { field: "id", fieldName: "id" },
  //   { field: "isArchived", fieldName: "isArchived" },
  //   { field: "isAddressVerified", fieldName: "isAddressVerified" },

  //   { field: "lga", fieldName: "lga" },

  //   { field: "floorNumber", fieldName: "floorNumber" },

  //   { field: "area", fieldName: "area" },
  //   { field: "isComplete", fieldName: "isComplete" },
  //   { field: "religiousBuilding", fieldName: "religiousBuilding" },
  //   { field: "isDisabled", fieldName: "isDisabled" },
  //   { field: "isVerified", fieldName: "isVerified" },
  //   {
  //     field: "landlordResides",
  //     fieldName: "landlordResides"
  //   },
  //   {
  //     field: "pet", subFields: ["leasePolicy", "pet", "isAllowed"],
  //     fieldName: "pet"
  //   },
  //   {
  //     field: "smoking", subFields: ["leasePolicy", "smoking", "isAllowed"],
  //     fieldName: "smoking"
  //   },
  //   { field: "leaseTerm", fieldName: "leaseTerm" },
  //   { field: "lessorInfoId", fieldName: "lessorInfoId" },
  //   { field: "lessorUserId", fieldName: "lessorUserId" },
  //   {
  //     condition: SearchCondition.between,
  //     lowerRange: "priceLower",
  //     upperRange: "priceUpper",
  //     subFields: ["advertisedUnit", "price", "min"],
  //     field: "price",
  //     fieldName: "price"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBedrooms", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBedrooms",
  //     fieldName: "noOfBedrooms"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBedrooms", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBedroomsGreaterThan",
  //     fieldName: "noOfBedroomsGreaterThan"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "dateAvailable", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "dateAvailable",
  //     fieldName: "dateAvailable"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBathroomsEnsuite",
  //     fieldName: "noOfBathroomsEnsuite"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBathroomsEnsuiteGreaterThan",
  //     fieldName: "noOfBathroomsEnsuiteGreaterThan"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathrooms", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBathrooms",
  //     fieldName: "noOfBathrooms"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathrooms", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBathroomsGreaterThan",
  //     fieldName: "noOfBathroomsGreaterThan"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "hasAgencyFee", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "hasAgencyFee",
  //     fieldName: "hasAgencyFee"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "squareFeet", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "squareFeet",
  //     fieldName: "squareFeet"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "paymentSchedule", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "paymentSchedule",
  //     fieldName: "paymentSchedule"
  //   },
  //   {
  //     condition: SearchCondition.inArray,
  //     field: "amenities",
  //     fieldName: "amenities"
  //   },
  //   { field: "sponsorshipLevel", fieldName: "sponsorshipLevel" },
  //   { field: "state", fieldName: "state" },
  //   { field: "status", fieldName: "status" },
  //   { field: "tag", fieldName: "tag" },
  //   { field: "tourLink", fieldName: "tourLink" },
  //   { field: "transactionType", fieldName: "transactionType" },
  //   { field: "type", fieldName: "type" },
  // ];
  // static searchPropertiesStruct: SearchQueryItem<PropertySearchQueryDto>[] = [
  //   {
  //     field: "address", condition: SearchCondition.contains,
  //     fieldName: "",
  //     valueType: "string"
  //   },
  //   {
  //     field: "hasCautionFee",
  //     fieldName: "caution_fee",          // the DB column name
  //     valueType: "boolean",
  //     condition: SearchCondition.equal
  //   },
  //   {
  //     field: "city",
  //     fieldName: "",
  //     valueType: "string",
  //     condition: SearchCondition.equal
  //   },
  //   {
  //     field: "closeToNoise",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     field: "dateAvailable",
  //     fieldName: "availability",          // the DB column name
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "description",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "id",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     field: "isArchived",
  //     fieldName: "is_archived",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },
  //   {
  //     field: "isAddressVerified",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },this.repo.find({where: {isComplete: true}});  

  //   {
  //     field: "lga",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },

  //   {
  //     field: "floorNumber",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },

  //   {
  //     field: "area",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "isComplete",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },
  //   {
  //     field: "religiousBuilding",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     field: "isDisabled",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },
  //   {
  //     field: "isVerified",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },
  //   {
  //     field: "landlordResides",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "boolean"
  //   },
  //   {
  //     field: "pet", subFields: ["leasePolicy", "pet", "isAllowed"],
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "json"
  //   },
  //   {
  //     field: "smoking", subFields: ["leasePolicy", "smoking", "isAllowed"],
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "json"
  //   },
  //   {
  //     field: "leaseTerm",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "lessorInfoId",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     field: "lessorUserId",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     condition: SearchCondition.between,
  //     lowerRange: "priceLower",
  //     upperRange: "priceUpper",
  //     subFields: ["advertisedUnit", "price", "min"],
  //     field: "price",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBedrooms", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBedrooms",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBedrooms", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBedroomsGreaterThan",
  //     valueType: "number",
  //     fieldName: ""
  //   },
  //   {
  //     subFields: ["advertisedUnit", "dateAvailable", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "dateAvailable",
  //     fieldName: "",
  //     valueType: "date"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBathroomsEnsuite",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBathroomsEnsuiteGreaterThan",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathrooms", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "noOfBathrooms",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "noOfBathrooms", "min"],
  //     condition: SearchCondition.greaterThan,
  //     field: "noOfBathroomsGreaterThan",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "hasAgencyFee", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "hasAgencyFee",
  //     fieldName: "",
  //     valueType: "json"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "squareFeet", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "squareFeet",
  //     fieldName: "",
  //     valueType: "number"
  //   },
  //   {
  //     subFields: ["advertisedUnit", "paymentSchedule", "values"],
  //     condition: SearchCondition.inArray,
  //     field: "paymentSchedule",
  //     fieldName: "",
  //     valueType: "json"
  //   },
  //   {
  //     condition: SearchCondition.inArray,
  //     field: "amenities",
  //     fieldName: "",
  //     valueType: "string"
  //   },
  //   {
  //     field: "sponsorshipLevel",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "state",
  //     fieldName: "",
  //     condition: SearchCondition.equal,
  //     valueType: "string"
  //   },
  //   {
  //     field: "status",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "tag",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "tourLink",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "transactionType",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  //   {
  //     field: "type",
  //     fieldName: "",
  //     condition: SearchCondition.contains,
  //     valueType: "string"
  //   },
  // ];
  // // this.repo.find({where: {isComplete: true}});                      

  // public static async searchProperties(query: PropertySearchQueryDto, req: Request) {
  //   return await SearchService.search(
  //     {
  //       entity: PropertyEntity,
  //       tableName: "property",
  //     },
  //     this.searchPropertiesStruct,
  //     query,
  //     [
  //       { columnName: "units", tableName: "unit" },
  //       { columnName: "propertyMedia", tableName: "propertyMedia" },
  //     ],
  //     false,
  //     req as Request
  //   );

  // }

    static searchPropertiesStruct: SearchQueryItem<PropertySearchQueryDto>[] = [
    { field: "address", condition: SearchCondition.fuzzy },
    { field: "hasCautionFee", subFields: ["cautionFee", "hasCautionFee"], condition: SearchCondition.fuzzy },
    { field: "city", condition: SearchCondition.fuzzy },
    { field: "closeToNoise", condition: SearchCondition.fuzzy },
    { field: "dateAvailable", condition: SearchCondition.fuzzy },
    { field: "description", condition: SearchCondition.fuzzy },
    { field: "id", condition: SearchCondition.fuzzy },
    { field: "isArchived", condition: SearchCondition.fuzzy },
    { field: "isAddressVerified", condition: SearchCondition.fuzzy },

    { field: "lga", condition: SearchCondition.fuzzy },

    { field: "floorNumber", condition: SearchCondition.fuzzy },

    { field: "area", condition: SearchCondition.fuzzy },
    { field: "isComplete", condition: SearchCondition.fuzzy },
    { field: "religiousBuilding", condition: SearchCondition.fuzzy },
    { field: "isDisabled", condition: SearchCondition.fuzzy },
    { field: "isVerified", condition: SearchCondition.fuzzy },
    { field: "landlordResides", condition: SearchCondition.fuzzy },
    { field: "pet", subFields: ["leasePolicy", "pet", "isAllowed"], condition: SearchCondition.fuzzy },
    { field: "smoking", subFields: ["leasePolicy", "smoking", "isAllowed"], condition: SearchCondition.fuzzy },
    // { field: "leaseTerm", condition: SearchCondition.fuzzy },
    { field: "lessorInfoId", condition: SearchCondition.fuzzy },
    { field: "lessorUserId", condition: SearchCondition.fuzzy },
    {
      condition: SearchCondition.between,
      lowerRange: "priceLower",
      upperRange: "priceUpper",
      subFields: ["advertisedUnit", "price", "min"],
      field: "price",
    },
    {
      subFields: ["advertisedUnit", "noOfBedrooms", "values"],
      condition: SearchCondition.inArray,
      field: "noOfBedrooms",
    },
    {
      subFields: ["advertisedUnit", "noOfBedrooms", "min"],
      condition: SearchCondition.greaterThan,
      field: "noOfBedroomsGreaterThan",
    },
    {
      subFields: ["advertisedUnit", "dateAvailable", "values"],
      condition: SearchCondition.inArray,
      field: "dateAvailable",
    },
    {
      subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "values"],
      condition: SearchCondition.inArray,
      field: "noOfBathroomsEnsuite",
    },
    {
      subFields: ["advertisedUnit", "noOfBathroomsEnsuite", "min"],
      condition: SearchCondition.greaterThan,
      field: "noOfBathroomsEnsuiteGreaterThan",
    },
    {
      subFields: ["advertisedUnit", "noOfBathrooms", "values"],
      condition: SearchCondition.inArray,
      field: "noOfBathrooms",
    },
    {
      subFields: ["advertisedUnit", "noOfBathrooms", "min"],
      condition: SearchCondition.greaterThan,
      field: "noOfBathroomsGreaterThan",
    },
    {
      subFields: ["advertisedUnit", "hasAgencyFee", "values"],
      condition: SearchCondition.inArray,
      field: "hasAgencyFee",
    },
    {
      subFields: ["advertisedUnit", "squareFeet", "values"],
      condition: SearchCondition.inArray,
      field: "squareFeet",
    },
    {
      subFields: ["advertisedUnit", "paymentSchedule", "values"],
      condition: SearchCondition.inArray,
      field: "paymentSchedule",
    },
    {
      condition: SearchCondition.inArray,
      field: "amenities",
    },
    { field: "sponsorshipLevel", condition: SearchCondition.fuzzy },
    { field: "state", condition: SearchCondition.fuzzy },
    { field: "status", condition: SearchCondition.fuzzy },
    { field: "tag", condition: SearchCondition.fuzzy },
    { field: "tourLink", condition: SearchCondition.fuzzy },
    { field: "transactionType", condition: SearchCondition.fuzzy },
    { field: "type", condition: SearchCondition.fuzzy },
  ];
  



public static async searchProperties(query: PropertySearchQueryDto): Promise<SearchResponse<PropertyEntity>> {
  const result = await SearchService.search(
    {
      entity: PropertyEntity,
      tableName: 'property',
    },
    this.searchPropertiesStruct,
    query,
    [
      // { columnName: 'units', tableName: 'unit' },
      // { columnName: 'propertyMedia', tableName: 'propertyMedia' },
    ],
    false,
    true,
  );

  // result.data = result.data.filter((property: PropertyEntity) =>
  //   // property.units?.some((unit: PropertyUnitEntity) => unit.isPaid === false)
  // );

  return result;
}





  public static async getLocations() { }

  public static async getDefaultLocations() {
    const locations = await this.repo
      .createQueryBuilder("property")
      .select("property.city, property.state")
      .groupBy("property.city, property.state")
      .getRawMany();

    locations.sort((a, b) => {
      if (a.city < b.city) return -1;
      if (a.city > b.city) return 1;
      return 0;
    });

    return locations;
  }


  public static async getLocationsByKeyword(keyword: string) {
    const locations = await this.repo
      .createQueryBuilder("property")
      .select("property.address, property.city, property.state")
      .where("property.address ILIKE :keyword", { keyword: `%${keyword}%` })
      .groupBy("property.address, property.city, property.state")
      .getRawMany();

    // Sort alphabetically
    locations.sort((a, b) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    });

    return locations;
  }

  // public static async getPropertyFullDetails(propertyID: string, )

  // public static async generateBillingAnalytics(
  //   propertyID: string,
  //   unitID: string
  // ): Promise<BillingAnalytics & { utilityBreakdown: any }> {
  //   try {
  //     const { cautionFee: propCautionFee, units, utilities } = await this.getByID(propertyID);

  //     const cautionFee = propCautionFee?.fixedCautionFee || 0;

  //     const filteredUnit = units.find((unit) => unit.id === unitID);
  //     if (!filteredUnit) {
  //       throw new Error("Unit not found");
  //     }

  //     const { price, hasAgencyFee, fixedAgencyFee, agencyFeePercentage } = filteredUnit;
  //     const rentalFee = price;

  //     const calculateShare = (rate: number, price: number): number => (rate / 100) * price;

  //     const rates = PropertyService.getRates(price, hasAgencyFee);
  //     const tenantCharges = calculateShare(rates[0], price);
  //     const landlordCharges = calculateShare(rates[1], price);

  //     const agencyFee = hasAgencyFee
  //       ? 0
  //       : fixedAgencyFee || (agencyFeePercentage ? calculateShare(agencyFeePercentage, price) : 0);

  //     const {
  //       utilityFees,
  //       utilityFeeTotal,
  //       utilityBreakdown,
  //     } = Object.entries(utilities || {}).reduce(
  //       (acc, [key, utility]) => {
  //         if (utility.isRequired && utility.fixedFee !== undefined) {
  //           acc.utilityFees[key] = utility.fixedFee;
  //           acc.utilityFeeTotal += utility.fixedFee;
  //         }

  //         // Always include the structure for transparency
  //         acc.utilityBreakdown[key] = {
  //           isRequired: utility.isRequired ?? false,
  //           fixedFee: utility.fixedFee ?? 0,
  //           isBasedOnUsage: utility.isBasedOnUsage ?? false,
  //         };

  //         return acc;
  //       },
  //       {
  //         utilityFees: {} as { [key: string]: number },
  //         utilityFeeTotal: 0,
  //         utilityBreakdown: {} as {
  //           [key: string]: {
  //             isRequired: boolean;
  //             fixedFee: number;
  //             isBasedOnUsage: boolean;
  //           };
  //         },
  //       }
  //     );

  //     const serviceFee = tenantCharges + landlordCharges;
  //     const total = rentalFee + serviceFee + cautionFee + agencyFee;

  //     return {
  //       agencyFee,
  //       cautionFee,
  //       tenantCharges,
  //       landlordCharges,
  //       serviceFee,
  //       rentalFee,
  //       utilityFees,
  //       utilityFeeTotal,
  //       total,
  //       utilityBreakdown, // 👈 Add this to your return
  //     };
  //   } catch (error) {
  //     Utility.throwException({
  //       statusNo: 500,
  //       message: "Error occurred while generating billing analytics",
  //       errorObject: error,
  //     });
  //   }
  // }

  public static async generateBillingAnalytics(
    propertyID: string,
    unitID: string
  ): Promise<BillingAnalytics & { utilityBreakdown: any }> {
    try {
      const {
        cautionFee: propCautionFee,
        leaseTerm,
        units,
        utilities,
      } = await this.getByID(propertyID);

      const filteredUnit = units.find((unit) => unit.id === unitID);
      if (!filteredUnit) {
        throw new Error("Unit not found");
      }

      const {
        price,
        hasAgencyFee,
        fixedAgencyFee,
        agencyFeePercentage, // 5 or 10 (not actual percent, just number)
      } = filteredUnit;

      const rentalFee = price;
      const calculateShare = (rate: number, amount: number): number => (rate / 100) * amount;

      const rates = PropertyService.getRates(price, hasAgencyFee);
      const tenantCharges = calculateShare(rates[0], price);
      const landlordCharges = calculateShare(rates[1], price);

      /**
       * AGENCY FEE
       * - If `hasAgencyFee` is true
       * - Prefer `fixedAgencyFee`
       * - Fallback to percentage: 5% or 10%
       */
      let agencyFee = 0;

      if (hasAgencyFee) {
        if (fixedAgencyFee !== undefined && fixedAgencyFee !== null) {
          agencyFee = fixedAgencyFee;
        } else if (agencyFeePercentage !== undefined && agencyFeePercentage !== null) {
          agencyFee = (agencyFeePercentage / 100) * price;
        }
      }

      /**
       * CAUTION FEE
       * - Prefer `fixedCautionFee`
       * - Else calculate based on number of months (percentageCautionFee holds months: 1, 2, etc.)
       */
      let cautionFee = 0;

      if (propCautionFee?.fixedCautionFee) {
        cautionFee = propCautionFee.fixedCautionFee;
      } else if (propCautionFee?.cautionFeeIteration) {
        // Determine 1 month rent based on frequency
        let oneMonthRent = 0;
        if (leaseTerm === LeaseTerms.YEARLY) {
          oneMonthRent = rentalFee / 12;
        } else if (leaseTerm === LeaseTerms.MONTHLY) {
          oneMonthRent = rentalFee;
        }

        cautionFee = oneMonthRent * propCautionFee.cautionFeeIteration; // e.g., 2 * 1 month rent
      }

      /**
       * UTILITIES
       */
      const {
        utilityFees,
        utilityFeeTotal,
        utilityBreakdown,
      } = Object.entries(utilities || {}).reduce(
        (acc, [key, utility]) => {
          if (utility.isRequired && utility.fixedFee !== undefined) {
            acc.utilityFees[key] = utility.fixedFee;
            acc.utilityFeeTotal += utility.fixedFee;
          }

          acc.utilityBreakdown[key] = {
            isRequired: utility.isRequired ?? false,
            fixedFee: utility.fixedFee ?? 0,
            isBasedOnUsage: utility.isBasedOnUsage ?? false,
          };

          return acc;
        },
        {
          utilityFees: {} as { [key: string]: number },
          utilityFeeTotal: 0,
          utilityBreakdown: {} as {
            [key: string]: {
              isRequired: boolean;
              fixedFee: number;
              isBasedOnUsage: boolean;
            };
          },
        }
      );

      const serviceFee = tenantCharges + landlordCharges;
      const total = rentalFee + serviceFee + cautionFee + agencyFee;

      return {
        agencyFee,
        cautionFee,
        tenantCharges,
        landlordCharges,
        serviceFee,
        rentalFee,
        utilityFees,
        utilityFeeTotal,
        total,
        utilityBreakdown,
      };
    } catch (error) {
      Utility.throwException({
        statusNo: 500,
        message: "Error occurred while generating billing analytics",
        errorObject: error,
      });
    }
  }



  // public static async getRentedUnits(userId: string) {
  //   const payments = await this.paymentRepo
  //     .createQueryBuilder("payment")
  //     .innerJoinAndSelect("payment.unit", "unit")
  //     .innerJoinAndSelect("unit.property", "property")
  //     .leftJoinAndSelect("property.propertyMedia", "media")
  //     .select([
  //       "payment.createdAt",
  //       "unit.label",
  //       "unit.price",
  //       "property.address",
  //       "property.city",
  //       "property.state",
  //       "media.imageUrls",
  //     ])
  //     .where("payment.payer = :userId AND payment.status = :status", {
  //       userId,
  //       status: PaymentStatuses.CONFIRMED,
  //     })
  //     .orderBy("payment.createdAt", "DESC")
  //     .getMany();

  //   const rentedUnits = payments.map((payment) => {
  //     const unit = payment.unit;
  //     const property = unit.property;
  //     const media = property.propertyMedia;

  //     return {
  //       paymentDate: payment.createdAt,
  //       dueDate: new Date(
  //         new Date(payment.createdAt).setFullYear(payment.createdAt.getFullYear() + 1)
  //       ),
  //       propertyAddress: property.address,
  //       propertyCity: property.city,
  //       propertyState: property.state,
  //       unitLabel: unit.label,
  //       unitPrice: unit.price,
  //       propertyImages: media?.imageUrls || [],
  //     };
  //   });

  //   return rentedUnits;
  // }

public static async getRentedUnits(userId: string, query: SearchQuery<any>) {
  if (!userId) {
    Utility.throwException({
      statusNo: 400,
      message: "User ID is required to fetch rented units.",
    });
  }

  // Build filter options
  const filter: any = {
    ...query,
    userId, // tenant’s user ID
  };

  // Optional filter for completion
  if (query.hasOwnProperty("isComplete")) {
    filter.isComplete = query.isComplete === "true";
  }

  // ✅ Fetch all rental requests by this tenant, including propertyMedia
  const rentRequests = await SearchService.search(
    {
      entity: RequestToRentEntity,
      tableName: "request_to_rent",
    },
    [
      { field: "isComplete" },
      { field: "isApprove" },
      { field: "applicationWithdrawn" },
    ],
    filter,
    [
      { columnName: "property", tableName: "property" },
      { columnName: "unit", tableName: "unit" },
      { columnName: "user", tableName: "user" },
      { columnName: "property.propertyMedia", tableName: "propertyMedia" }, // ✅ nested join
    ],
    false,
  );

  // ✅ Map to desired output structure
  const rentedUnits = rentRequests.data.map((request) => {
      const property = request.property ?? ({} as PropertyEntity);
      const propertyMedia = (property?.propertyMedia ?? ({} as PropertyMediaEntity)) as PropertyMediaEntity;
      const rentedDate = request.leaseAgreementSignedAt || request.createdAt;

      return {
        rentedDate,
        tenantName: `${request.firstName ?? ""} ${request.lastName ?? ""}`.trim(),
        tenantEmail: request.email,
        tenantPhone: request.phoneNumber,
        propertyId: property.id,
        propertyAddress: property.address,
        isApproved: request.isApprove,
        isComplete: request.isComplete,
        propertyState: property.state,
        propertyArea: property.area,
        propertyLga: property.lga,
        propertyDescription: property.description,
        propertyFloorNumber: property.floorNumber,
        propertyIsComplete: property.isComplete,

        // ✅ Units
        propertyUnits: Array.isArray(property.units)
          ? property.units.map((u) => ({
              unitLabel: u.label,
              unitPrice: u.price,
              unitIsPaid: u.isPaid,
              unitNoOfBedrooms: u.noOfBedrooms,
              unitNoOfBathrooms: u.noOfBathrooms,
              unitNoOfBathroomsEnsuite: u.noOfBathroomsEnsuite
            }))
          : [],

  // ✅ Property media
      propertyMedia: {
        images: propertyMedia.imageUrls ?? [],
        videos: propertyMedia.videoUrls ?? [],
        leaseDocumentUrl: propertyMedia.leaseDocumentUrl ?? null,
        useLetBudTemplate: propertyMedia.useLetBudTemplate ?? false,
      },
    };
  });

  return {
    ...rentRequests,
    data: rentedUnits,
  };
}

}
