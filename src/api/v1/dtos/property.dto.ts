import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import {
  PropertyAvailability,
  PropertyCautionFee,
  PropertyFAQItem,
  PropertyLeasePolicy,
  PropertyLeasePolicyItem,
  PropertyTourAvailability,
  PropertyUnitCategory,
  PropertyUtility,
  PropertyUtilityItem,
  Property,
} from "../interfaces/property.interface.js";
import { TransactionTypes } from "../enums/transaction.types.enums.js";
import Utility from "../../../utils/utility.js";
import { SearchQueryDto } from "./search.dto.js";
import { ObjectLiteral, Point } from "typeorm";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { EPropertyType } from "../enums/property.enums.js";
// import { Type } from "class-transformer";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { PropertyUnit } from "../interfaces/unit.interface.js";
import { Coordinates } from "../interfaces/base.interface.js";
import { query } from "express";

export class PropertyInitiateDto implements Partial<Property> {
  @IsEnum(TransactionTypes)
  public transactionType: TransactionTypes;

  constructor(obj?: Partial<PropertyInitiateDto>) {
    Utility.pickFieldsFromObject<PropertyInitiateDto>(obj, this, { transactionType: null });
  }
}

export class PropertyUpdateDto implements Partial<Property> {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  lga: string;

  @IsString()
  @IsOptional()
  floorNumber: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities: string[];

  @IsOptional()
  @ValidateNested()
  availability: PropertyAvailability;

  @IsOptional()
  @ValidateNested()
  cautionFee: PropertyCautionFee;

  @IsString()
  @IsOptional()
  city: string;

  @IsBoolean()
  @IsOptional()
  closeToNoise: boolean;

  @IsOptional()
  coordinates: Coordinates;

  @IsOptional()
  dateAvailable: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @ValidateNested({ each: true })
  faq: PropertyFAQItemDto[];

  @IsString()
  @IsOptional()
  id: string;

  @IsBoolean()
  @IsOptional()
  isArchived: boolean;

  @IsBoolean()
  @IsOptional()
  isAddressVerified: boolean;

  @IsBoolean()
  @IsOptional()
  isComplete: boolean;

  @IsUUID()
  @IsOptional()
  lessorId: string;

  @IsBoolean()
  @IsOptional()
  isDisabled: boolean;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsBoolean()
  @IsOptional()
  landlordResides: boolean;

  @IsOptional()
  @ValidateNested()
  leasePolicy: PropertyLeasePolicy;

  @IsOptional()
  @IsEnum(LeaseTerms)
  leaseTerm: LeaseTerms;

  @IsUUID()
  @IsOptional()
  lessorDocumentId: string;

  @IsUUID()
  @IsOptional()
  lessorInfoId: string;

  @IsUUID()
  @IsOptional()
  lessorUserId: string;

  @IsOptional()
  meta: {};

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  propertyMediaId: string;

  // @IsString()
  // @IsOptional()
  // propertyTourAvailabilityId: string;

  @IsBoolean()
  @IsOptional()
  religiousBuilding: boolean;

  @IsNumber()
  @IsOptional()
  sponsorshipLevel: number;

  @IsString()
  @IsOptional()
  state: string;

  @IsOptional()
  @IsEnum(AvailabilityStatuses)
  status: AvailabilityStatuses;

  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @IsOptional()
  tourAvailability: PropertyTourAvailability;

  @IsString()
  @IsOptional()
  tourLink: string;

  @IsOptional()
  @IsEnum(TransactionTypes)
  transactionType: TransactionTypes;

  @IsOptional()
  @IsEnum(EPropertyType)
  type: EPropertyType;

  @IsOptional()
  @ValidateNested({ each: true })
  unitCategories: PropertyUnitCategoryDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  units: PropertyUnitDto[];

  @IsOptional()
  @ValidateNested()
  utilities: PropertyUtility;

  constructor(obj?: PropertyUpdateDto) {
    Object.assign(this, obj);

    if (obj) {
      this.availability = new PropertyAvailabilityUpdateDto(obj.availability);
      this.cautionFee = new PropertyCautionFeeUpdateDto(obj.cautionFee);
      this.faq = obj.faq?.map((item) => new PropertyFAQItemDto(item));
      this.leasePolicy = new PropertyLeasePolicyUpdateDto(obj.leasePolicy);
      this.tourAvailability = new PropertyTourAvailabilityUpdateDto(obj.tourAvailability);
      this.unitCategories = obj.unitCategories?.map((item) => new PropertyUnitCategoryDto(item));
      this.units = obj.units?.map((item) => new PropertyUnitDto(item));
      this.utilities = new PropertyUtilitiesUpdateDto(obj.utilities);
    }
  }
}

export class PropertyAvailabilityUpdateDto implements PropertyAvailability {
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  daysAvailable: string[];

  @IsOptional()
  @IsString()
  availableFrom: string;

  @IsOptional()
  @IsString()
  minimumStay: string;

  @IsOptional()
  @IsString()
  maximumStay: string;

  constructor(obj?: PropertyAvailabilityUpdateDto) {
    Object.assign(this, obj);
    // Utility.objectToClass(PropertyAvailabilityUpdateDto, obj, this);
    // Utility.pickFieldsFromObject<PropertyAvailabilityUpdateDto>(obj, this, {
    //   daysAvailable: null,
    //   availableFrom: null,
    //   minimumStay: null,
    //   maximumStay: null,
    // });
  }
}

export class PropertyCautionFeeUpdateDto implements PropertyCautionFee {
  @IsBoolean()
  @IsOptional()
  hasCautionFee: boolean;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  cautionFeeIteration: number;

  @IsNumber()
  @IsOptional()
  fixedCautionFee: number;

  constructor(obj?: PropertyCautionFeeUpdateDto) {
    Object.assign(this, obj);
    // Utility.objectToClass(PropertyCautionFeeUpdateDto, obj, this);
    // debugger
    // Utility.pickFieldsFromObject<PropertyCautionFeeUpdateDto>(obj, this, {
    //   hasCautionFee: null,
    //   cautionFeeIteration: null,
    //   fixedCautionFee: null,
    // });
  }
}

export class PropertyArchiveUpdateDto {
  @IsBoolean()
  isArchived: boolean;

  constructor(obj?: PropertyArchiveUpdateDto) {
    Object.assign(this, obj);
    // Utility.objectToClass(PropertyCautionFeeUpdateDto, obj, this);
    // debugger
    // Utility.pickFieldsFromObject<PropertyCautionFeeUpdateDto>(obj, this, {
    //   hasCautionFee: null,
    //   cautionFeeIteration: null,
    //   fixedCautionFee: null,
    // });
  }
}

export class PropertyTourAvailabilityUpdateDto implements PropertyTourAvailability {
  @IsArray()
  @IsString({ each: true })
  timeSlots: string[];
  @IsArray()
  @IsString({ each: true })
  daysAvailable: string[];

  constructor(obj?: PropertyTourAvailabilityUpdateDto) {
    Object.assign(this, obj);
  }
}

export class PropertyLeasePolicyUpdateDto implements PropertyLeasePolicy {
  @ValidateNested()
  @IsNotEmptyObject()
  @IsObject()
  pet: PropertyLeasePolicyItem;

  @ValidateNested()
  @IsNotEmptyObject()
  @IsObject()
  smoking: PropertyLeasePolicyItem;

  constructor(obj?: PropertyLeasePolicyUpdateDto) {
    if (obj)
      for (const key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key))
          this[key] = new PropertyLeasePolicyItemDto(obj[key]);
  }
}

export class PropertyLeasePolicyItemDto implements PropertyLeasePolicyItem {
  @IsBoolean()
  isAllowed: boolean;

  @IsString()
  location: string;

  constructor(obj?: PropertyLeasePolicyItemDto) {
    Object.assign(this, obj);
  }
}

export class PropertyUtilitiesUpdateDto implements PropertyUtility {
  @ValidateNested()
  electricityBill: PropertyUtilityItem;

  @ValidateNested()
  waterBill: PropertyUtilityItem;

  @ValidateNested()
  wasteBill: PropertyUtilityItem;

  @ValidateNested()
  internetBill: PropertyUtilityItem;

  @ValidateNested()
  serviceCharge: PropertyUtilityItem;

  @ValidateNested()
  securityBill: PropertyUtilityItem;

  constructor(obj?: PropertyUtilitiesUpdateDto) {
    if (obj)
      for (const key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key))
          this[key] = new PropertyUtilityItemDto(obj[key]);
  }
}

export class PropertyUtilityItemDto implements PropertyUtilityItem {
  @IsBoolean()
  isRequired: boolean;
  @IsNumber()
  @IsOptional()
  fixedFee: number;
  @IsBoolean()
  @IsOptional()
  isBasedOnUsage: boolean;
  constructor(obj?: PropertyUtilityItem) {
    Object.assign(this, obj);
  }
}

export class PropertyFAQDto implements Partial<Property> {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  faq: PropertyFAQItemDto[];

  constructor(obj?: PropertyFAQDto) {
    this.faq = obj?.faq?.map((x) => new PropertyFAQItemDto(x));
  }
}

export class PropertyAmmenityDto implements Partial<Property> {
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  constructor(obj?: PropertyAmmenityDto) {
    Object.assign(this, obj || {});
  }
}

export class PropertyFAQItemDto implements PropertyFAQItem {
  @IsString()
  question: string;
  @IsString()
  answer: string;

  constructor(obj?: PropertyFAQItemDto) {
    Object.assign(this, obj || {});
  }
}

export class PropertyUnitCategoriesDto {
  @ValidateNested({ each: true })
  unitCategories: PropertyUnitCategoryDto[];

  constructor(obj?: PropertyUnitCategoriesDto) {
    // Object.assign(this, obj || {});
    this.unitCategories = obj?.unitCategories?.map((x) => new PropertyUnitCategoryDto(x));
  }
}

export class PropertyUnitCategoryDto implements PropertyUnitCategory {
  @IsOptional()
  @IsNumber()
  agencyFeePercentage?: number;
  @IsOptional()
  @IsNumber()
  fixedAgencyFee?: number;
  @IsOptional()
  @IsBoolean()
  hasAgencyFee?: boolean;
  @IsString()
  label: string;
  @IsNumber()
  noOfBedrooms: number;
  @IsNumber()
  noOfBathrooms: number; units
  @IsInt()
  noOfSimilarUnits: number;
  @IsNumber()
  noOfBathroomsEnsuite: number;
  @IsEnum(PaymentTypes)
  paymentSchedule?: PaymentTypes;
  @IsNumber()
  price: number;
  @IsOptional()
  @IsNumber()
  squareFeet: number;

  constructor(obj?: PropertyUnitCategoryDto) {
    Object.assign(this, obj || {});
  }
}

export class PropertyUnitsDto {
  @ValidateNested({ each: true })
  units: PropertyUnitDto[];

  constructor(obj?: PropertyUnitsDto) {
    Object.assign(this, obj || {});
    this.units = obj?.units?.map((x) => new PropertyUnitDto(x));
  }
}

export class PropertyUnitDto implements PropertyUnit {
  @IsOptional()
  @IsNumber()
  agencyFeePercentage?: number;

  @IsOptional()
  @IsNumber()
  fixedAgencyFee?: number;

  @IsOptional()
  @IsBoolean()
  hasAgencyFee?: boolean;

  @IsOptional()
  @IsBoolean()
  requestedToRent?: boolean;

  @IsOptional()
  @IsBoolean()
  requestedTour?: boolean;

  @IsOptional()
  @IsBoolean()
  alreadyApplied?: boolean;

  @IsOptional()
  @IsBoolean()
  applicationApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsBoolean()
  isUnitOccupied?: boolean;

  @IsOptional()
  @IsBoolean()
  leaseAgreementSigned?: boolean;

  @IsOptional()
  @IsBoolean()
  delete?: boolean;

  @IsString()
  label: string;

  @IsNumber()
  noOfBedrooms: number;

  @IsNumber()
  noOfBathrooms: number;

  @IsNumber()
  noOfBathroomsEnsuite: number;

  @IsEnum(PaymentTypes)
  paymentSchedule: PaymentTypes;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  squareFeet: number;

  @IsOptional()
  dateAvailable?: string;

  @IsOptional()
  @IsEnum(AvailabilityStatuses)
  status: AvailabilityStatuses;

  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  meta: {};

  constructor(obj?: PropertyUnitDto) {
    Object.assign(this, obj || {});
  }
}

export class PropertySearchQueryDto
  extends SearchQueryDto<PropertySearchQueryDto, Property>
  implements Partial<Property> {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  lga: string;

  @IsString()
  @IsOptional()
  floorNumber: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsString()
  @IsOptional()
  amenities: any;

  @IsBooleanString()
  @IsOptional()
  hasCautionFee: boolean;

  @IsString()
  @IsOptional()
  city: string;

  @IsBooleanString()
  @IsOptional()
  closeToNoise: boolean;

  @IsOptional()
  dateAvailable: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsBooleanString()
  @IsOptional()
  isArchived: boolean;

  @IsBooleanString()
  @IsOptional()
  isAddressVerified: boolean;

  @IsBooleanString()
  @IsOptional()
  isComplete: boolean;

  @IsBooleanString()
  @IsOptional()
  isDisabled: boolean;

  @IsBooleanString()
  @IsOptional()
  isVerified: boolean;

  @IsBooleanString()
  @IsOptional()
  landlordResides: boolean;

  @IsBooleanString()
  @IsOptional()
  pet: boolean;

  @IsBooleanString()
  @IsOptional()
  smoking: boolean;

  @IsOptional()
  @IsEnum(LeaseTerms)
  leaseTerm: LeaseTerms;

  @IsUUID()
  @IsOptional()
  lessorInfoId: string;

  @IsUUID()
  @IsOptional()
  lessorUserId: string;

  @IsNumberString()
  @IsOptional()
  priceLower: number;

  @IsNumberString()
  @IsOptional()
  priceUpper: number;

  price?: number;

  @IsNumberString()
  @IsOptional()
  noOfBedrooms?: number;

  @IsNumberString()
  @IsOptional()
  noOfBedroomsGreaterThan?: number;

  @IsNumberString()
  @IsOptional()
  noOfBathroomsEnsuiteGreaterThan?: number;

  @IsNumberString()
  @IsOptional()
  noOfBathrooms?: number;

  @IsNumberString()
  @IsOptional()
  noOfBathroomsGreaterThan?: number;

  @IsNumberString()
  @IsOptional()
  squareFeet?: number;

  @IsNumber()
  @IsOptional()
  noOfBathroomsEnsuite?: number;

  @IsBooleanString()
  @IsOptional()
  hasAgencyFee?: boolean;

  @IsBoolean()
  @IsOptional()
  religiousBuilding: true;

  // @IsString()
  // @IsOptional()
  // propertyMediaId: string;

  // @IsString()
  // @IsOptional()
  // propertyTourAvailabilityId: string;

  @IsNumberString()
  @IsOptional()
  sponsorshipLevel: number;

  @IsString()
  @IsOptional()
  state: string;

  @IsEnum(PaymentTypes)
  @IsOptional()
  paymentSchedule: PaymentTypes;

  @IsOptional()
  @IsEnum(AvailabilityStatuses)
  status: AvailabilityStatuses;

  @IsString()
  @IsOptional()
  tag;

  @IsString()
  @IsOptional()
  tourLink: string;

  @IsOptional()
  @IsEnum(TransactionTypes)
  transactionType: TransactionTypes;

  @IsOptional()
  @IsEnum(EPropertyType)
  type: EPropertyType;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsNumber()
  @IsOptional()
  totalPages: number;

  @IsBoolean()
  @IsOptional()
  hasNextPage: boolean;

  @IsBoolean()
  @IsOptional()
  hasPreviousPage: boolean;

  constructor(obj?: Partial<PropertySearchQueryDto>) {
    super(obj);
    this.totalPages = obj?.totalPages ? Number(obj.totalPages) : 0;
    this.hasNextPage = obj?.hasNextPage ?? false;
    this.hasPreviousPage = obj?.hasPreviousPage ?? false;
    // super(obj);
    Object.assign(this, obj || {});
  }
}
