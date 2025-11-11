import { IsBoolean, IsOptional, IsString } from "class-validator";
import Utility from "../../../utils/utility.js";
import {
  IAdditionalInfo,
  ICreateRequestToRent,
  IHouseholdInfo,
  IIncomeInfo,
  IResidenceInfo,
  ITenantInfo,
} from "../interfaces/request-to-rent.interface.js";

export class CreateRequestToRentDto implements ICreateRequestToRent {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  identificationMode: string;

  @IsString()
  email: string;


  @IsOptional()
  @IsString()
  landlordSignedAt: Date;

  @IsOptional()
  @IsString()
  landlordSignedByIp?: string;

  @IsOptional()
  @IsString()
  tenantSignedByIp?: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  summary: string;

  @IsString()
  unitId: string;

  @IsOptional()
  @IsBoolean()
  isApprove?: boolean;

  @IsString()
  propertyId: string;

  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;

  constructor(obj?: CreateRequestToRentDto) {
    Utility.pickFieldsFromObject<CreateRequestToRentDto>(obj, this, {
      firstName: null,
      middleName: null,
      lastName: null,
      identificationMode: null,
      email: null,
      phoneNumber: null,
      summary: null,
      unitId: null,
      propertyId: null,
      isApprove: null,
      isComplete: null,
      landlordSignedAt: undefined,
      landlordSignedByIp: "",
      tenantSignedByIp: ""
    });
  }
}

export class UpdateHouseholdInfoDto implements IHouseholdInfo {
  numPeopleLiving: number;
  numCoTenantsAbove18: number;
  coTenants: ITenantInfo[];
  hasPets: boolean;
  petType: string;
  numPets: number;
  moveInDate: Date;

  constructor(obj?: UpdateHouseholdInfoDto) {
    Utility.pickFieldsFromObject<UpdateHouseholdInfoDto>(obj, this, {
      numPeopleLiving: null,
      numCoTenantsAbove18: null,
      coTenants: null,
      hasPets: null,
      petType: null,
      numPets: null,
      moveInDate: null,
    });
  }
}

export class UpdateResidenceInfoDto implements IResidenceInfo {
  currentAddress: string;
  switchReason: string;
  propertyManagerName: string;
  propertyManagerContact: string;
  pastAddress: string;
  pastMoveInDate: Date;
  pastMoveOutDate: Date;
  reasonForLeaving: string;
  pastPropertyManagerContact: string;

  constructor(obj?: UpdateResidenceInfoDto) {
    Utility.pickFieldsFromObject<UpdateResidenceInfoDto>(obj, this, {
      currentAddress: null,
      switchReason: null,
      propertyManagerName: null,
      propertyManagerContact: null,
      pastAddress: null,
      pastMoveInDate: null,
      pastMoveOutDate: null,
      reasonForLeaving: null,
      pastPropertyManagerContact: null,
    });
  }
}

export class UpdateIncomeInfoDto implements IIncomeInfo {
  currentSalaryEstimate: string;
  workplace: string;
  startDateAtCompany: Date;
  companyRefereeName: string;
  refereeEmail: string;
  refereePhoneNumber: string;

  constructor(obj?: UpdateIncomeInfoDto) {
    Utility.pickFieldsFromObject<UpdateIncomeInfoDto>(obj, this, {
      currentSalaryEstimate: null,
      workplace: null,
      startDateAtCompany: null,
      companyRefereeName: null,
      refereeEmail: null,
      refereePhoneNumber: null,
    });
  }
}

export class UpdateAdditionalInfoDto implements IAdditionalInfo {
  evictedBefore: boolean;
  evictionReason: string;
  convictedBefore: boolean;
  convictionDetails: string;
  emergencyContactName: string;
  relationshipWithContact: string;
  emergencyContactEmail: string;
  emergencyContactPhoneNumber: string;

  constructor(obj?: UpdateAdditionalInfoDto) {
    Utility.pickFieldsFromObject<UpdateAdditionalInfoDto>(obj, this, {
      evictedBefore: null,
      evictionReason: null,
      convictedBefore: null,
      convictionDetails: null,
      emergencyContactName: null,
      relationshipWithContact: null,
      emergencyContactEmail: null,
      emergencyContactPhoneNumber: null,
    });
  }
}

export class UpdateIsCompleteDto {
  isComplete: boolean;

  firstName: string;
  lastName: string;

  constructor(obj?: UpdateIsCompleteDto) {
    Utility.pickFieldsFromObject<UpdateIsCompleteDto>(obj, this, {
      isComplete: null,
      firstName: null,
      lastName: null,
    });
  }
}
