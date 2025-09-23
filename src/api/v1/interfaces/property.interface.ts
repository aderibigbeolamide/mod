import { TransactionTypes } from "../enums/transaction.types.enums.js";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { EPropertyType } from "../enums/property.enums.js";
import { PropertyUnit, PropertyUnitAnalytics } from "./unit.interface.js";
import { BaseInterface, Coordinates } from "./base.interface.js";

export interface Property extends BaseInterface {
  address: string;
  /**
   * Holds the address in a system format to help improve unique identification
   */
  addressID?: string;
  advertisedUnit: PropertyUnitAnalytics;
  amenities: string[];
  area: string;
  availability: PropertyAvailability;
  cautionFee: PropertyCautionFee;
  city: string;
  /**
   * Are there any religious buildings or event centers within 400 meters of the property you are listing?
   */
  closeToNoise: boolean;
  coordinates: string | Coordinates;
  description: string;
  faq: PropertyFAQItem[];
  floorNumber: string;
  id: string;
  isAddressVerified: boolean;
  isArchived: boolean;
  isComplete: boolean;
  isVerified: boolean;
  isDisabled: boolean;
  lga: string;
  religiousBuilding: boolean;
  landlordResides: boolean;
  leasePolicy: PropertyLeasePolicy;
  leaseTerm: LeaseTerms;
  lessorInfoId: string;
  lessorDocumentId: string;
  lessorUserId: string;
  propertyMediaId?: string;
  // propertyTourAvailabilityId: string;
  sponsorshipLevel: number;
  state: string;
  status: AvailabilityStatuses;
  tags: string[];
  tourAvailability: PropertyTourAvailability;
  tourLink: string;
  transactionType: TransactionTypes;
  type: EPropertyType;
  unitCategories?: PropertyUnitCategory[];
  utilities: PropertyUtility;
}

export interface PropertyUnitCategory extends Partial<PropertyUnit> {
  noOfSimilarUnits: number;
}

export interface PropertyAvailability {
  daysAvailable: string[];
  availableFrom: string;
  minimumStay: string;
  maximumStay: string;
}

export interface PropertyCautionFee {
  hasCautionFee: boolean;
  /**Based on the payment schedule */
  cautionFeeIteration: number;
  fixedCautionFee: number;
  // percentageCautionFee?: number;
}
export interface PropertyTourAvailability {
  daysAvailable: string[];
  timeSlots: string[];
}

export interface PropertyLeasePolicy {
  pet: PropertyLeasePolicyItem;
  smoking: PropertyLeasePolicyItem;
}
export interface PropertyLeasePolicyItem {
  isAllowed: boolean;
  location: string;
}

export interface PropertyUtility {
  electricityBill: PropertyUtilityItem;
  waterBill: PropertyUtilityItem;
  wasteBill: PropertyUtilityItem;
  internetBill: PropertyUtilityItem;
  serviceCharge: PropertyUtilityItem;
  securityBill: PropertyUtilityItem;
}
export interface PropertyUtilityItem {
  isRequired: boolean;
  fixedFee: number;
  isBasedOnUsage: boolean;
}

export interface PropertyFAQItem {
  question: string;
  answer: string;
}
