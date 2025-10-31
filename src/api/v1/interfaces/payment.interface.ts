import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { UserEntity } from "../entities/user.entity.js";
import { PayeeRole } from "../enums/payeeRole.enum.js";
import { PropertyEntity, PropertyUnitEntity } from "../entities/property.entity.js";

export interface Payment {
  amount: number;
  email: string;
  reference?: string;
  channel?: string;
  status?: PaymentStatuses;
  callbackUrl?: string;
  payer?: UserEntity;          // User making the payment
  payee?: UserEntity;           // Property owner or designated recipient
  payeeRole?: PayeeRole;        // Role of the payee
  // transactions?: PaymentTransactionEntity[];  // Associated transactions
  unit: PropertyUnitEntity;     // Property unit
  property: PropertyEntity; // Property
}

export interface verifyPayment{
  reference: string;
  metadata?: {
    origin?: string;
  };
}
