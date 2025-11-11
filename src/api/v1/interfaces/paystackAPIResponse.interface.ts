export interface PaystackAPIResponse<T> {
    pa: any;
    status: boolean;
    message: string;
    data: T;
}

export interface Metadata {
    email: string;
    amount: number;
    payerId: string;
    payeeId: string;
    propertyId?: string;
    unitId?: string;
    billingDetails?: any;
}

export interface Data {
    account_Number: string;
    account_Name: string;
    bank_code: string;
    bank_id: string;
}

export interface InitializePaymentArgs {
    email: string;
    amount: number;
    callback_url?: string;
    metadata: Metadata;
}

export interface InitializeAccountArgs {
    accountNumber: string;
    bankCode: string;
}

// export interface InitializeFetchBanksArgs {
//     currency: string;
//     bankCode: string;
// }

export interface RefundPaymentArgs {
    transaction: string; // The transaction reference to refund
    amount?: number;     // Amount to refund (optional, if partial refund)
    currency?: string;   // Optional currency (e.g., "NGN")
}

export interface CreateSplitArgs {
    name: string;
    type: string; // "percentage" or "flat"
    currency: string;
    subaccounts: Array<{
        subaccount: string;
        share: number;
    }>;
}

export interface InitializePaymentResponse {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    channel: string;
}

export interface VerifyPaymentResponse {
    id: number;
    status: string;
    reference: string;
    amount: number;
    metadata: { email: string; amount: string; payeeId: string };
    // Other fields as needed
}

export interface RefundPaymentResponse {
    status: string;
    transaction: string;
    amount: number;
    currency: string;
}

export interface AccountDetails {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    bankId: string;
}

// export interface fetchBanks{
//     bankName: string;
//     bankCode: string;
//     currencyCode?: string;
//     type?: string;
// }

export interface CreateSplitResponse {
    id: string;
    name: string;
    type: string;
    currency: string;
    subaccounts: Array<{
        subaccount: string;
        share: number;
    }>;
}