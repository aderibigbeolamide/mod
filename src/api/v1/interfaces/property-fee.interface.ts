import { PaymentTypes } from "../enums/payment.types.enum.js";

export interface PropertyFee {
  id: string;
  // propertyId: string;
  feeDescription: string;
  paymentType: PaymentTypes;
  amount: number;
  totalPerMonth: number;
  total: number;
}
