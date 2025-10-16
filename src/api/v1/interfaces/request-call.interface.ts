import { UserEntity } from "../entities/user.entity.js";
import { BaseInterface } from "./base.interface.js";

export interface RequestCall extends BaseInterface {
  id: string;
  userId: string;
  email: string;
  phoneNumber: string;
  preferredCallTime?: string;
  preferredCallDay?: string;
  isEmailOverridden: boolean;
  isPhoneOverridden: boolean;
  overrideReason?: string;
  processedAt?: Date;
  processedInBatch?: string;
  user?: UserEntity;
}

export interface RequestCallCreateDto {
  email?: string;
  phoneNumber?: string;
  preferredCallTime?: string;
  preferredCallDay?: string;
  useUserData?: boolean;
  overrideReason?: string;
}

export interface RequestCallBatchSummary {
  totalRequests: number;
  requests: RequestCall[];
  batchId: string;
  processedAt: Date;
}