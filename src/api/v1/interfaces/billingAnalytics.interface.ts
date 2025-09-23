export interface BillingAnalytics {
  agencyFee: number;
  cautionFee: number;
  tenantCharges: number;
  landlordCharges: number;
  serviceFee: number;
  rentalFee: number;
  utilityFees: { [key: string]: number };
  utilityFeeTotal: number;
  total: number;
}
