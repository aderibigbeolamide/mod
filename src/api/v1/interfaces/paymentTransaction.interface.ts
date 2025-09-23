import { PaymentTransactionStatus } from "../enums/paymentTransaction.status.enum.js";

export interface PaymentTransaction {
  status: PaymentTransactionStatus;
  invoiceURL?: string;
  reference: string;
  amount: number;
}