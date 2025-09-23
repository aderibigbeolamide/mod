import { TransactionTypes } from "../enums/transaction.types.enums.js";

export interface ServiceFeeConfig {
  id: string;
  transactionType: TransactionTypes;
  minPrice: number;
  maxPrice: number;
  percentage: number;
}
