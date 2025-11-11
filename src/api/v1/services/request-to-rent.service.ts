import { getManager, IsNull, Not, Repository } from "typeorm";
import { dataSource } from "../../../config/database.config.js";
import Utility from "../../../utils/utility.js";
import {
  CreateRequestToRentDto,
  UpdateAdditionalInfoDto,
  UpdateHouseholdInfoDto,
  UpdateIncomeInfoDto,
  UpdateIsCompleteDto,
  UpdateResidenceInfoDto,
} from "../dtos/request-to-rent.dto.js";
import { RequestToRentEntity } from "../entities/request-to-rent.entity.js";
import { User } from "../interfaces/user.interface.js";
import { PropertyEntity, PropertyUnitEntity } from "../entities/property.entity.js";
import { UserEntity } from "../entities/user.entity.js";
import { LessorInfoEntity } from "../entities/lessor-info.entity.js";
import { In } from "typeorm";
import CommService from "./comm.service.js";
import { property } from "lodash-es";
import { userInfo } from "os";
import { LeaseAgreementService } from "./lease-agreement.service.js";
import { logger } from "../../../config/logger.js";

export default class RequestToRentService {
  static repo = dataSource.getRepository(RequestToRentEntity);
  static propertyRepo = dataSource.getRepository(PropertyEntity);
  static unitRepo = dataSource.getRepository(PropertyUnitEntity);
  static userRepo = dataSource.getRepository(UserEntity);
  static commService = new CommService();
  static leaseAgreementService = new LeaseAgreementService();

  // Create a new rental request
  public static async createRequest(dto: CreateRequestToRentDto, sender: User) {
    // Check if the user has already requested to rent this property
    const hasRequested = await this.hasUserRequestedToRent(sender.id, dto.unitId);
    if (hasRequested) {
      Utility.throwException({
        statusNo: 400,
        message: `You have already requested to rent this Unit.`,
      });
    }
    // Check if the property exists
    const property = await this.propertyRepo.findOneBy({ id: dto.propertyId });
    if (!property) {
      Utility.throwException({
        statusNo: 404,
        message: `Property with ID ${dto.propertyId} does not exist.`,
      });
    }
    //  Check if the isComplete field is set to true
    if (dto.isComplete) {
      Utility.throwException({
        statusNo: 400,
        message: `isComplete cannot be true when creating a new request.`,
      });
    }
    const newRequest = this.repo.create({
      ...dto,
      createdBy: sender.id,
      userId: sender.id,
      isComplete: false,
      isApprove: false,
    });

    const savedRequest = await this.repo.save(newRequest);



    return savedRequest;
  }

  // Update a rental request
  private static async updateRecord(id: string, updates: Partial<RequestToRentEntity>) {
    const record = await this.getById(id);

    if (!record) {
      Utility.throwException({
        statusNo: 400,
        message: `RequestToRent ID ${id} does not exist`,
      });
    }

    Object.assign(record, updates);
    return await this.repo.save(record);
  }

  // Update household information
  public static async updateHouseholdInfo(dto: UpdateHouseholdInfoDto, id: string) {
    return await this.updateRecord(id, { ...dto });
  }

  // Update residence information
  public static async updateResidenceInfo(dto: UpdateResidenceInfoDto, id: string) {
    return await this.updateRecord(id, { ...dto });
  }

  // Update income information
  public static async updateIncomeInfo(dto: UpdateIncomeInfoDto, id: string) {
    return await this.updateRecord(id, { ...dto });
  }

  // Update additional information
  public static async updateAdditionalInfo(dto: UpdateAdditionalInfoDto, id: string) {
    return await this.updateRecord(id, { ...dto });
  }

  // Update completion status
  public static async updateIsComplete(dto: UpdateIsCompleteDto, id: string, sender: User) {
    const record = await this.repo.findOne({
      where: { id },
      relations: ["property"],
    });

    if (!record) {
      Utility.throwException({
        statusNo: 400,
        message: `RequestToRent ID ${id} does not exist`,
      });
    }

    if (record.isComplete && dto.isComplete) {
      Utility.throwException({
        statusNo: 400,
        message: `This rental request has already been marked complete.`,
      });
    }

    // Notify applicant
    await this.commService.sendRequestToRentEmail(sender.email, dto.firstName, dto.lastName);

    // Fetch landlord (lessor) details from the property
    const property = record.property;
    if (property && property.lessorUserId) {
      const landlord = await this.userRepo.findOneBy({ id: property.lessorUserId });
      if (landlord) {
        await this.commService.sendRequestToLandlordEmail(
          landlord.email,      // landlord’s email
          landlord.username,   // landlord’s name
          dto.firstName,
          dto.lastName,
          sender.email         // applicant email
        );
      }
    }

    // ✅ Update to mark as complete
    return await this.updateRecord(id, { isComplete: true });
  }

  // Fetch a record by ID
  public static async getById(id: string) {
    return await this.repo.findOneBy({ id });
  }

  // Fetch all rental requests
  public static async getAll() {
    return await this.repo.find();
  }

  // delete a rental request
  public static async deleteRequest(id: string) {
    const record = await this.getById(id);
    if (!record) {
      Utility.throwException({
        statusNo: 404,
        message: `RequestToRent ID ${id} does not exist`,
      });
    }
    return await this.repo.remove(record);
  }

  // Fetch applications for a specific property
  public static async fetchApplicationsByPropertyID(propertyId: string, userId?: string) {
    const query = userId ? { propertyId, userId } : { propertyId };
    return await this.repo.find({ where: query });
  }

  // Fetch all applications
  public static async fetchApplications() {
    return await this.getAll();
  }

  // Fetch interested applicants for a property
  public static async fetchInterestedApplicant(lessorUserId: string): Promise<any> {
    return await this.repo.query(
      `
      SELECT DISTINCT ON (r.property_id, r.created_by)
        r.*, 
        un.*, 
        usr.*, 
        d.*, 
        pm.*
      FROM request_to_rent AS r
      LEFT JOIN unit AS un ON un.id = r.unit_id
      LEFT JOIN "user" AS usr ON usr.id = r.created_by
      LEFT JOIN user_details AS d ON d.id::VARCHAR = usr.details_id
      LEFT JOIN property AS p ON p.id = r.property_id
      LEFT JOIN property_media AS pm ON pm.id = p.property_media_id
      WHERE r.property_id = $1 AND r.is_complete = true
      `,
      [lessorUserId]
    );
  }

  public static async fetchInterestedApplicants(propertyId: string): Promise<any> {
    return await this.repo.query(
      `
      SELECT DISTINCT ON (r.property_id, r.created_by)
        r.id AS request_to_rent_id,
        r.id AS id,
        r.*, 
        un.*, 
        usr.*, 
        d.*, 
        pm.*
      FROM request_to_rent AS r
      LEFT JOIN unit AS un ON un.id = r.unit_id
      LEFT JOIN "user" AS usr ON usr.id = r.created_by
      LEFT JOIN user_details AS d ON d.id::VARCHAR = usr.details_id
      LEFT JOIN property AS p ON p.id = r.property_id
      LEFT JOIN request_to_rent AS rt ON rt.property_id = p.id
      LEFT JOIN property_media AS pm ON pm.id = p.property_media_id
      WHERE r.property_id = $1 AND r.is_complete = true
      `,
      [propertyId]
    );
  }











  /**
   * Fetch the unit associated with a request to rent.
   * @param requestToRentID Request ID
   * @returns Property unit details
   */
  public static async getUnitForRequest(requestToRentID: string) {
    const request = await this.repo.findOne({
      where: { id: requestToRentID },
      relations: ["unit"],
    });

    if (!request) {
      Utility.throwException({
        statusNo: 404,
        message: `RequestToRent ID ${requestToRentID} does not exist`,
      });
    }

    return request.unit;
  }

  /**
   * Fetch details of the user who made a request to rent.
   * @param requestToRentID Request ID
   * @returns User details
   */
  public static async getUserForRequest(requestToRentID: string, propertyId: string) {
    const request = await this.repo.findOne({
      where: { id: requestToRentID },
      relations: ["user", "units"],
    });

    if (!request) {
      Utility.throwException({
        statusNo: 404,
        message: `RequestToRent ID ${requestToRentID} does not exist`,
      });
    }

    return request.userDetails;
  }

  /**
   * Fetch pending requests to rent for a landlord's property.
   * @param landlordId Landlord's user ID
   * @returns List of pending requests
   */
  public static async getPendingRequestsForLandlord(userId: string) {
    const properties = await this.repo.find({
      where: { userId: userId },
    });

    console.log(`Found ${properties.length} properties for landlord ID ${userId}`);

    if (properties.length === 0) {
      Utility.throwException({
        statusNo: 404,
        message: `No properties found for landlord ID ${userId}`,
      });
    }

    const propertyIds = properties.map((property) => property.id);
    return await this.repo.find({
      where: { property: In(propertyIds), isApprove: false },
      relations: ["user", "unit"],
    });
  }

  /**
 * Check if a user has already requested to rent a specific property.
 * @param userId - ID of the user making the request.
 * @param propertyId - ID of the property the user is interested in.
 * @returns True if the user has already requested to rent the property, false otherwise.
  */
  public static async hasUserRequestedToRent(userId: string, propertyId: string): Promise<boolean> {
    const existingRequest = await this.repo.findOne({
      where: {
        userId,
        propertyId,
      },
    });

    return !!existingRequest; // Return true if a record exists, false otherwise.
  }

  /**
   * Approve or reject a request to rent.
   * @param requestToRentID Request ID
   * @param _isApprove Approve status (true or false)
   * @param landlordId Landlord's user ID
   * @returns Updated request
   *
   */
  public static async approveRequestToRent(
    requestToRentId: string,
    _isApprove: boolean,
    landlordId: string,
    moveInDate?: Date,
    landlordIp?: string
  ): Promise<RequestToRentEntity> {
    const request = await this.repo.findOne({
      where: { id: requestToRentId, isComplete: true },
      relations: ["unit", "property", "property.propertyMedia"],
    });

    if (!request) {
      Utility.throwException({
        statusNo: 404,
        message: `Rental request with ID ${requestToRentId} not found.`,
      });
    }

    if (!request.property || request.property.lessorUserId !== landlordId) {
      Utility.throwException({
        statusNo: 403,
        message: "You do not have permission to approve this rental request.",
      });
    }

    if (moveInDate) {
      request.moveInDate = moveInDate;
    }

    request.isApprove = _isApprove;

    if (_isApprove) {
      request.landlordSignedAt = new Date();
      if (landlordIp) {
        request.landlordSignedByIp = landlordIp;
      }
    }

    const updatedRequest = await this.repo.save(request);

    if (_isApprove) {
      await this.commService.sendPropertyApprovalEmail(
        request.email,
        request.firstName,
        request.lastName,
        request.moveInDate
      );

      const propertyMedia = request.property.propertyMedia;

      if (propertyMedia?.useLetBudTemplate) {
        const leaseResult = await this.leaseAgreementService.generateSignedLeaseAgreement(
          requestToRentId,
          { includeLandlord: true, includeTenant: false }
        );

        await this.repo.update(
          { id: requestToRentId },
          { leaseAgreementUrl: leaseResult.s3Url } as any
        );

        logger.info(`LetBud template lease agreement with landlord signature generated for approved request: ${requestToRentId}`);
      } else if (propertyMedia?.leaseDocumentUrl) {
        try {
          const landlordPdfBuffer = await this.leaseAgreementService.downloadPDFFromS3(
            propertyMedia.leaseDocumentUrl
          );

          const lessorInfo = await dataSource.getRepository(LessorInfoEntity).findOne({
            where: { id: request.property.lessorInfoId },
          });

          const landlordName = lessorInfo 
            ? `${lessorInfo.firstName || ''} ${lessorInfo.lastName || ''}`.trim()
            : 'Unknown';

          const landlordSignaturePage = await this.leaseAgreementService.generateSignaturePage(
            landlordName,
            request.landlordSignedAt || new Date(),
            request.landlordSignedByIp || 'Unknown'
          );

          const mergedPdfBuffer = await this.leaseAgreementService.mergePDFs(
            landlordPdfBuffer,
            landlordSignaturePage
          );

          const s3Url = await this.leaseAgreementService.saveLeaseAgreementToS3(
            requestToRentId,
            mergedPdfBuffer,
            'landlord-signed'
          );

          await this.repo.update(
            { id: requestToRentId },
            { leaseAgreementUrl: s3Url } as any
          );

          logger.info(`Landlord's uploaded lease document merged with landlord signature for request: ${requestToRentId}`);
        } catch (error) {
          logger.error(`Failed to process landlord's uploaded lease document for request ${requestToRentId}:`, error);
          
          await this.repo.update(
            { id: requestToRentId },
            { leaseAgreementUrl: propertyMedia.leaseDocumentUrl } as any
          );

          logger.warn(`Fallback: Using original uploaded lease document for request: ${requestToRentId}`);
        }
      } else {
        logger.warn(`No lease document available for request: ${requestToRentId}`);
      }
    }

    return updatedRequest;
  }


  public static async fetchRenterApplications(renterId: string) {
    const renterApplications = await this.repo.query(
      `
      SELECT
        property.id AS property_id,
        property.name AS property_name,
        property.address,
        property.city,
        property.state,
        property.description,
        property_media.image_urls,
        request_to_rent.id AS rent_request_id,
        request_to_rent.user_id,
        request_to_rent.is_approve,
        request_to_rent.createdAt
      FROM
        request_to_rent
      JOIN
        property ON request_to_rent.property_id = property.id
      LEFT JOIN
        property_media ON property.id = property_media.property_id
      WHERE
        request_to_rent.user_id = $1;
    `,
      [renterId]
    );

    const applications = renterApplications.map((application) => ({
      property: {
        id: application.property_id,
        name: application.property_name,
        address: application.address,
        city: application.city,
        state: application.state,
        description: application.description,
        propertyMedia: application.image_urls ? application.image_urls : [],
      },
      rentRequest: {
        id: application.rent_request_id,
        userId: application.user_id,
        isApprove: application.is_approve,
        createdAt: application.createdAt,
      },
    }));

    return applications;
  }

  // get Approved Request To Rent by user id
  // getApprovedRequestToRentBylessorUserId
  // public static async getApprovedRequestToRentBylessorUserId(userId: string) {
  //   const approvedRequests = await this.repo.find({
  //     where: {
  //       isApprove: true,
  //       property: { lessorUserId: userId },
  //     },
  //     relations: ["property"],
  //   });

  //   if (approvedRequests.length === 0) {
  //     Utility.throwException({
  //       statusNo: 404,
  //       message: `No approved requests found for user ID ${userId}`,
  //     });
  //   }

  //   return approvedRequests;
  // }

  //just want to fetch properties that have been approved, i don´t want the request to rent details, just only the properties
  public static async getApprovedRequestToRentBylessorUserId(lessorUserId: string) {
    // Fetch properties for the lessor
    const properties = await this.propertyRepo.find({
      where: {
        lessorUserId: lessorUserId,
      },
      relations: ["propertyMedia", "units"],
    });

    // Filter properties that have at least one approved request
    const approvedPropertyIds = (
      await this.repo.find({
        where: {
          isApprove: true,
          property: { lessorUserId: lessorUserId },
        },
        relations: ["property"],
      })
    ).map((req) => req.property.id);

    const approvedProperties = properties.filter((property) =>
      approvedPropertyIds.includes(property.id)
    );

    if (approvedProperties.length === 0) {
      Utility.throwException({
        statusNo: 404,
        message: `No approved properties found for user ID ${lessorUserId}`,
      });
    }

    return approvedProperties;
  }
  // public static async fetchApprovedProperties(lessorUserId: string) {
  //   // Fetch properties for the lessor
  //   const properties = await this.propertyRepo.find({
  //     where: {
  //       lessorUserId: lessorUserId,
  //     },
  //     relations: ["propertyMedia", "units"],
  //   });

  //   // Filter properties that have at least one approved request
  //   const approvedPropertyIds = (
  //     await this.repo.find({
  //       where: {
  //         isApprove: true,
  //         property: { lessorUserId: lessorUserId },
  //       },
  //       relations: ["property"],
  //     })
  //   ).map((req) => req.property.id);

  //   const approvedProperties = properties.filter((property) =>
  //     approvedPropertyIds.includes(property.id)
  //   );

  //   if (approvedProperties.length === 0) {
  //     Utility.throwException({
  //       statusNo: 404,
  //       message: `No approved properties found for user ID ${lessorUserId}`,
  //     });
  //   }

  //   return approvedProperties;
  // }

  // public static async getApprovedRequestToRentBylessorUserId(userId: string) {
  //   const approvedRequests = await this.repo.find({
  //     where: {
  //       userId: userId,
  //       isApprove: true,
  //     },
  //     relations: ["property", "unit"],
  //   });

  //   if (approvedRequests.length === 0) {
  //     Utility.throwException({
  //       statusNo: 404,
  //       message: `No approved requests found for user ID ${userId}`,
  //     });
  //   }

  //   return approvedRequests;
  // }

  public static async fetchApprovedRenterApplications(renterId: string) {
    const approvedApplications = await this.repo.query(
      `
      SELECT
        property.id AS property_id,
        property.address,
        property.city,
        property.state,
        property.description,
        property_media.image_urls,
        request_to_rent.id AS rent_request_id,
        request_to_rent.user_id,
        request_to_rent.is_approve,
        request_to_rent.createdAt
      FROM
        request_to_rent
      JOIN
        property ON request_to_rent.property_id = property.id
      LEFT JOIN
        property_media ON property.id = property_media.property_id
      WHERE
        request_to_rent.user_id = $1 AND request_to_rent.is_approve = TRUE;
    `,
      [renterId]
    );

    const applications = approvedApplications.map((application) => ({
      property: {
        id: application.property_id,
        address: application.address,
        city: application.city,
        state: application.state,
        description: application.description,
        propertyMedia: application.image_urls ? application.image_urls : [],
      },
      rentRequest: {
        id: application.rent_request_id,
        userId: application.user_id,
        isApprove: application.is_approve,
        createdAt: application.createdAt,
      },
    }));

    return applications;
  }
}
