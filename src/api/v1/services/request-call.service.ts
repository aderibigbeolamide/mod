import { dataSource } from "../../../config/database.config.js";
import { RequestCallEntity } from "../entities/request-call.entity.js";
import { UserEntity } from "../entities/user.entity.js";
import { CreateRequestCallDto } from "../dtos/request-call.dto.js";
import { RequestCall } from "../interfaces/request-call.interface.js";
import { HttpException } from "../exceptions/http.exception.js";
import { STATUS_FAIL } from "../../../config/constants.js";
import { Repository } from "typeorm";

export default class RequestCallService {
  private repo: Repository<RequestCallEntity>;
  private userRepo: Repository<UserEntity>;

  constructor() {
    this.repo = dataSource.getRepository(RequestCallEntity);
    this.userRepo = dataSource.getRepository(UserEntity);
  }

  public async createRequestCall(userId: string, createDto: CreateRequestCallDto): Promise<RequestCall> {
    try {
      // Get user data
      const user = await this.userRepo.findOne({ 
        where: { id: userId },
        select: { id: true, email: true, phoneNumber: true }
      });

      if (!user) {
        throw new HttpException(404, STATUS_FAIL, "User not found", "USER_NOT_FOUND");
      }

      // Determine which contact info to use
      let finalEmail = user.email;
      let finalPhone = user.phoneNumber;
      let isEmailOverridden = false;
      let isPhoneOverridden = false;

      // If user wants to use custom data or their data is missing
      if (!createDto.useUserData || !user.email || !user.phoneNumber) {
        if (createDto.email && createDto.email !== user.email) {
          finalEmail = createDto.email;
          isEmailOverridden = true;
        }
        if (createDto.phoneNumber && createDto.phoneNumber !== user.phoneNumber) {
          finalPhone = createDto.phoneNumber;
          isPhoneOverridden = true;
        }
      }

      // Validate that we have both email and phone
      if (!finalEmail || !finalPhone) {
        throw new HttpException(
          400,
          STATUS_FAIL,
          "Both email and phone number are required. Please provide missing information.",
          "MISSING_CONTACT_INFO"
        );
      }

      // Create the request
      const requestCall = new RequestCallEntity();
      requestCall.userId = userId;
      requestCall.email = finalEmail;
      requestCall.phoneNumber = finalPhone;
      requestCall.preferredCallTime = createDto.preferredCallTime;
      requestCall.isEmailOverridden = isEmailOverridden;
      requestCall.isPhoneOverridden = isPhoneOverridden;
      requestCall.overrideReason = createDto.overrideReason;
      requestCall.createdBy = userId;

      const savedRequest = await this.repo.save(requestCall);

      return savedRequest;
    } catch (error) {
      throw error;
    }
  }

  public async getUnprocessedRequests(): Promise<RequestCall[]> {
    try {
      return await this.repo.find({
        where: { processedAt: null },
        relations: ["user"],
        order: { createdAt: "ASC" }
      });
    } catch (error) {
      throw error;
    }
  }

  public async markRequestsAsProcessed(requestIds: string[], batchId: string): Promise<void> {
    try {
        await this.repo
        .createQueryBuilder()
        .update(RequestCallEntity)
        .set({
          processedAt: new Date(),
          processedInBatch: batchId
        })
        .whereInIds(requestIds)
        .execute();
    } catch (error) {
      throw error;
    }
  }

  public async getUserRequestCalls(userId: string): Promise<RequestCall[]> {
    try {
      return await this.repo.find({
        where: { userId },
        order: { createdAt: "DESC" }
      });
    } catch (error) {
      throw error;
    }
  }
}