import axios, { AxiosResponse } from 'axios';
import { convertObjectFromSnakeToCamelCase } from '../../../utils/snakeToCamelCase.js';
import { HttpException } from '../exceptions/http.exception.js';
import { AccountDetails, CreateSplitArgs, CreateSplitResponse, InitializeAccountArgs, InitializePaymentArgs, InitializePaymentResponse, PaystackAPIResponse, RefundPaymentArgs, RefundPaymentResponse, VerifyPaymentResponse } from '../interfaces/paystackAPIResponse.interface.js';
import PaystackBaseApi from './paystackBaseApi.service.js';

const config = {
  paystackSecret: process.env.PAYSTACK_TEST_SECRET_KEY,
  paystackUrl: process.env.PAYSTACK_BASE_URL,
};



export class PaystackApi extends PaystackBaseApi {
  requestInit = {
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${config.paystackSecret}`,
    },
  };

  constructor() {
    super(config.paystackUrl as string);
  }

  // Method to initialize a payment
  initializePayment = async (paymentDetails: InitializePaymentArgs) => {
    const response = await this.post<
      PaystackAPIResponse<InitializePaymentResponse>
    >('/transaction/initialize', paymentDetails, undefined, this.requestInit);

    return convertObjectFromSnakeToCamelCase<InitializePaymentResponse>(
      response.data
    );
  };

  // Method to verify a payment
  verifyPayment = async (paymentReference: string) => {
    const response = await this.get<
      PaystackAPIResponse<VerifyPaymentResponse>
    >(`/transaction/verify/${paymentReference}`, undefined, this.requestInit);

    return convertObjectFromSnakeToCamelCase<VerifyPaymentResponse>(
      response.data
    );
  };

  // Method to fetch bank details
  // fetchBanks = async (currency = 'NG'): Promise<BankDetails[]> => {
  //   try {
  //     // const endpoint = `/bank?currency=${currency}&enabled_for_verification=true`;
  //     const response = await this.get<PaystackAPIResponse<any>>(
  //       `/bank?currency=${currency}&enabled_for_verification=true`,
  //       undefined,
  //       this.requestInit
  //     );

  //     console.log('Raw response data from Paystack:', response.data);

  //     const banks = response.data?.data;
  //     console.log('Full API Response:', response);
  //     if (!Array.isArray(banks)) {
  //       throw new Error("Unexpected response format from Paystack API.");
  //     }

  //     // Map the response to match the BankDetails interface
  //     return banks.map((bank) => ({
  //       bankName: bank.name,
  //       bankCode: bank.code,
  //       currencyCode: bank.currency || null, // Handle optional fields
  //       type: bank.type || null,           // Handle optional fields
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching banks:", error.message || error);
  //     throw new Error("Failed to fetch bank names and codes. Please try again later.");
  //   }
  // };

  // Method to fetch account details
  fetchAccountDetails = async (
    accountDetails: InitializeAccountArgs
  ): Promise<AccountDetails> => {
    try {
      const response = await this.get<PaystackAPIResponse<AccountDetails>>(
        `/bank/resolve?account_number=${accountDetails.accountNumber}&bank_code=${accountDetails.bankCode}`,
        undefined,
        this.requestInit
      );

      console.log("Full API Response:", response);

      if (!response.data) {
        throw new Error("Invalid API response: Missing 'data' property.");
      }

      // Convert the 'data' field to camelCase if necessary
      const accountDetailsResponse = convertObjectFromSnakeToCamelCase<AccountDetails>(response.data);

      console.log("Transformed account details:", accountDetailsResponse);
      return accountDetailsResponse;
    } catch (error) {
      console.error(
        "Error fetching account details:",
        error.response?.data || error.message || error
      );
      throw new Error("Failed to fetch account details from Paystack.");
    }
  };



  // Method to process a refund
  refundPayment = async (refundDetails: RefundPaymentArgs) => {
    const response = await this.post<
      PaystackAPIResponse<RefundPaymentResponse>
    >('/refund', refundDetails, undefined, this.requestInit);

    return convertObjectFromSnakeToCamelCase<RefundPaymentResponse>(
      response.data
    );
  };
}

const paystackApi = new PaystackApi();

export default paystackApi;
