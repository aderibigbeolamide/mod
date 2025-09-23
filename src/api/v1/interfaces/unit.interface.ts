import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { BaseInterface } from "./base.interface.js";

export interface PropertyUnit extends BaseInterface {
  agencyFeePercentage?: number;
  dateAvailable?: string;
  fixedAgencyFee?: number;
  hasAgencyFee?: boolean;
  label?: string;
  noOfBathrooms: number;
  noOfBathroomsEnsuite: number;
  noOfBedrooms: number;
  paymentSchedule: PaymentTypes;
  price: number;
  squareFeet: number;
  status: AvailabilityStatuses;
}

export type PropertyUnitAnalytics = {
  [k in keyof PropertyUnit]?: {
    min?: number;
    max?: number;
    average?: number;
    total?: number;
    value?: PropertyUnit[k];
    values?: any[];
  };
};
