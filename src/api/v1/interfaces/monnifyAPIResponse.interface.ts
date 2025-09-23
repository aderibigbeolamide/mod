export interface MonnifyAPIResponse<T> {
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
    responseBody: T;
}

export interface MonnifyMetadata {
    email: string;
    amount: number;
    payerId: string;
    payeeId: string;
    propertyId?: string;
    unitId?: string;
}

export interface InitializeMonnifyPaymentArgs {
    amount: number;
    customerName: string;
    customerEmail: string;
    paymentReference: string;
    paymentDescription: string;
    currencyCode?: string;
    contractCode: string;
    redirectUrl?: string;
    metadata: MonnifyMetadata;
    paymentMethods?: string[]; // e.g. ['CARD', 'ACCOUNT_TRANSFER']
}

export interface InitializeMonnifyPaymentResponse {
    accessCode: string;
    paymentReference: string;
    checkoutUrl: string;
    paymentStatus: string;
}

export interface VerifyMonnifyPaymentResponse {
    amount: number;
    status: string;
    paymentReference: string;
    amountPaid: number;
    totalPayable: number;
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
    paymentMethod: string;
    paidOn: string;
    paymentDescription: string;
    customerName: string;
    customerEmail: string;
    createdOn: string;
    currency: string;
    merchantName: string;
    product: string;
    transactionReference: string;
    metaData: MonnifyMetadata;
}

export interface RefundMonnifyPaymentArgs {
    transactionReference: string;
    amount: number;
    reason: string;
}

export interface RefundMonnifyPaymentResponse {
    refundReference: string;
    amount: number;
    refundStatus: string;
    refundedOn: string;
}
