import Utility from "../../../utils/utility.js";
import {
  PropertyAmmenityDto,
  PropertyAvailabilityUpdateDto,
  PropertyCautionFeeUpdateDto,
  PropertyLeasePolicyUpdateDto,
  PropertySearchQueryDto,
  PropertyTourAvailabilityUpdateDto,
  PropertyUnitCategoriesDto,
  PropertyUnitsDto,
  PropertyUpdateDto,
} from "../dtos/property.dto.js";
import { LessorInfoEntity } from "../entities/lessor-info.entity.js";
import { PropertyEntity } from "../entities/property.entity.js";
import { UserEntity } from "../entities/user.entity.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { EPropertyType } from "../enums/property.enums.js";
import { TransactionTypes } from "../enums/transaction.types.enums.js";
import { Coordinates } from "../interfaces/base.interface.js";
import { BillingAnalytics } from "../interfaces/billingAnalytics.interface.js";
import {
  PropertyFAQItem,
  PropertyUtility,
  PropertyUtilityItem,
  Property,
} from "../interfaces/property.interface.js";
import { SearchResponse } from "../interfaces/search.interface.js";
import { SearchSample } from "./search.sample.js";

export namespace PropertySample {
  export const availability: PropertyAvailabilityUpdateDto = {
    daysAvailable: ["Monday"],
    availableFrom: null,
    minimumStay: null,
    maximumStay: null,
  };
  export const cautionFee: PropertyCautionFeeUpdateDto = {
    hasCautionFee: true,
    cautionFeeIteration: 2,
    fixedCautionFee: Utility.generateFee(),
  };
  export const leasePolicy: PropertyLeasePolicyUpdateDto = {
    pet: {
      isAllowed: true,
      location: "Porch",
    },
    smoking: {
      isAllowed: true,
      location: "Porch",
    },
  };
  export const utilityItem: PropertyUtilityItem = {
    isRequired: true,
    fixedFee: Utility.generateFee(),
    isBasedOnUsage: false,
  };
  export const utilities: PropertyUtility = {
    electricityBill: utilityItem,
    waterBill: utilityItem,
    wasteBill: utilityItem,
    internetBill: utilityItem,
    serviceCharge: utilityItem,
    securityBill: utilityItem,
  };
  export const tourAvailability: PropertyTourAvailabilityUpdateDto = {
    timeSlots: ["8am"],
    daysAvailable: ["Monday"],
  };
  export const faq: PropertyFAQItem = {
    question: `What are the move-in requirements, such as security deposit and first month's rent?`,
    answer: `La la la`,
  };
  export const amenities: PropertyAmmenityDto = {
    amenities: ["Parking Space"],
  };
  export const unitCategories: PropertyUnitCategoriesDto = {
    unitCategories: [
      {
        label: "Category A",
        noOfBathrooms: Utility.generateCount(10),
        noOfBathroomsEnsuite: Utility.generateCount(10),
        noOfBedrooms: Utility.generateCount(10),
        noOfSimilarUnits: Utility.generateCount(10),
        squareFeet: Utility.generateCount(),
        price: Utility.generateFee(),
        paymentSchedule: PaymentTypes.MONTHLY,
        agencyFeePercentage: 2,
        fixedAgencyFee: 50000,
        hasAgencyFee: true,
        units: [],
      },
      {
        label: "Category B",
        noOfBathrooms: Utility.generateCount(10),
        noOfBathroomsEnsuite: Utility.generateCount(10),
        noOfBedrooms: Utility.generateCount(10),
        noOfSimilarUnits: Utility.generateCount(10),
        squareFeet: Utility.generateCount(),
        price: Utility.generateFee(),
        paymentSchedule: PaymentTypes.MONTHLY,
        agencyFeePercentage: 2,
        fixedAgencyFee: 50000,
        hasAgencyFee: true,
        units: [],
      },
    ],
  };
  export const units: PropertyUnitsDto = {
    units: [
      {
        meta: null,
        agencyFeePercentage: null,
        fixedAgencyFee: null,
        hasAgencyFee: null,
        label: "Category B",
        noOfBathrooms: 6,
        noOfBathroomsEnsuite: 0,
        noOfBedrooms: 5,
        paymentSchedule: PaymentTypes.MONTHLY,
        delete: true,
        price: 357924.01,
        squareFeet: 8942,
        status: AvailabilityStatuses.AVAILABLE,
        dateAvailable: null,
        id: Utility.generateUUID(),
      },
      {
        meta: null,
        agencyFeePercentage: null,
        fixedAgencyFee: null,
        hasAgencyFee: null,
        label: "Category A",
        noOfBathrooms: 9,
        noOfBathroomsEnsuite: 3,
        noOfBedrooms: 7,
        paymentSchedule: PaymentTypes.MONTHLY,
        price: 75502.89,
        squareFeet: 5410,
        status: AvailabilityStatuses.AVAILABLE,
        dateAvailable: null,
        id: Utility.generateUUID(),
      },
    ],
  };

  const coordinates: Coordinates = {
    x: Utility.generateCount(999),
    y: Utility.generateCount(999),
  };
  export const update: Partial<PropertyUpdateDto> = {
    address: "Address " + Math.round(Math.random() * 100000),
    amenities: amenities.amenities,
    availability,
    cautionFee,
    city: "Ikeja",
    closeToNoise: true,
    coordinates: coordinates,
    // coordinates: "(1,2)" as any,
    description: "Random",
    faq: [faq],
    isAddressVerified: null,
    isComplete: false,
    isDisabled: false,
    isVerified: null,
    landlordResides: null,
    leasePolicy,
    leaseTerm: LeaseTerms.MONTHLY,
    lessorInfoId: null,
    lessorUserId: null,
    propertyMediaId: null,
    // propertyTourAvailabilityId: null,
    sponsorshipLevel: null,
    state: "Lagos",
    status: AvailabilityStatuses.AVAILABLE,
    tags: ["fun"],
    tourAvailability,
    tourLink: null,
    transactionType: TransactionTypes.LONG_TERM_RENTAL,
    type: EPropertyType.house,
    unitCategories: unitCategories.unitCategories,
    units: units.units,
    utilities,
  };

  export const property: PropertyEntity = {
    id: "a0006ecb-9b80-4aea-86c6-756d5d3cbfea",
    meta: null,
    createdAt: "2023-09-08T23:40:41.676Z",
    updatedAt: "2023-09-12T14:59:26.038Z",
    createdBy: null,
    address: "Address 57666",
    advertisedUnit: null,
    lga: null,
    floorNumber: null,
    area: null,
    amenities: null,
    availability: {
      daysAvailable: ["Monday"],
      availableFrom: "d",
      minimumStay: "null",
      maximumStay: "null",
    },
    cautionFee: {
      hasCautionFee: true,
      cautionFeeIteration: 2,
      fixedCautionFee: 773966.55,
    },
    coordinates: coordinates,
    description: null,
    faq: [
      {
        question:
          "What are the move-in requirements, such as security deposit and first month's rent?",
        answer: "La la la",
      },
    ],
    city: null,
    closeToNoise: null,
    religiousBuilding: null,
    lessorDocumentId: null,
    isAddressVerified: null,
    isArchived: false,
    isComplete: false,
    isDisabled: false,
    isVerified: null,
    landlordResides: null,
    leaseTerm: null,
    lessorInfoId: null,
    leasePolicy: {
      pet: {
        isAllowed: true,
        location: "Porch",
      },
      smoking: {
        isAllowed: true,
        location: "Porch",
      },
    },
    lessorUserId: null,
    // propertyMediaId: null,
    // propertyTourAvailabilityId: null,
    sponsorshipLevel: null,
    state: null,
    status: AvailabilityStatuses.AVAILABLE,
    tags: null,
    tourAvailability: {
      daysAvailable: [],
      timeSlots: [],
    },
    tourLink: null,
    transactionType: TransactionTypes.LONG_TERM_RENTAL,
    type: null,
    utilities: {
      electricityBill: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
      waterBill: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
      wasteBill: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
      internetBill: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
      serviceCharge: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
      securityBill: {
        isRequired: true,
        fixedFee: 781278.68,
        isBasedOnUsage: false,
      },
    },
    units: [
      {
        id: "b5fb00a6-19a2-44ba-8906-2bcb757f6631",
        meta: null,
        createdAt: "2023-09-16T13:03:29.251Z",
        updatedAt: "2023-09-16T13:03:29.251Z",
        createdBy: null,
        agencyFeePercentage: null,
        fixedAgencyFee: null,
        hasAgencyFee: null,
        label: "Category A",
        noOfBathrooms: 9,
        noOfBathroomsEnsuite: 1,
        noOfBedrooms: 9,
        paymentSchedule: PaymentTypes.MONTHLY,
        price: 305407.28,
        squareFeet: 3216,
        status: null,
        dateAvailable: null,
        applicationApproved: false,
        // payments: [],
        property: new PropertyEntity(),
        rentRequests: [],
        tourRequest: [],
        isUnitOccupied: false,
        isLocked: false,
        lockedBy: null,
        lockExpiresAt: null,
        isPaid: false,
        paidUntil: null,
      },
      {
        id: "f73d49fc-67c1-4607-8b75-57b59e00f761",
        meta: null,
        createdAt: "2023-09-16T13:03:29.258Z",
        updatedAt: "2023-09-16T13:03:29.258Z",
        createdBy: null,
        agencyFeePercentage: null,
        fixedAgencyFee: null,
        hasAgencyFee: null,
        label: "Category B",
        noOfBathrooms: 0,
        noOfBathroomsEnsuite: 8,
        noOfBedrooms: 10,
        paymentSchedule: PaymentTypes.MONTHLY,
        price: 897591.45,
        squareFeet: 8091,
        status: null,
        dateAvailable: null,
        applicationApproved: false,
        // payments: [],
        property: new PropertyEntity(),
        rentRequests: [],
        tourRequest: [],
        isUnitOccupied: false,
        isLocked: false,
        lockedBy: null,
        lockExpiresAt: null,
        isPaid: false,
        paidUntil: null,
      },
    ],
    rentRequests: [],
  };

  export const search: SearchResponse<PropertyEntity> = {
    data: [{ ...property, units: undefined }],
    total: 1,
    sortDirection: "DESC",
    sortField: "createdAt",
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  export const billingAnalytics: BillingAnalytics = {
    agencyFee: 50000,
    cautionFee: 100000,
    tenantCharges: 75000,
    landlordCharges: 93750,
    serviceFee: 168750,
    rentalFee: 2000000,
    utilityFees: {
      electricityBill: 5000,
      waterBill: 10000,
      wasteBill: 2000,
      internetBill: 15000,
      serviceCharge: 25000,
      securityBill: 10000,
    },
    utilityFeeTotal: 67000,
    total: 2216250,
  };
}
