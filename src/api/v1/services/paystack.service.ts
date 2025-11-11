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

//   //Payment TimeOut
//   // ✅ Fetch payment session timeout from Paystack
// getPaymentSessionTimeout = async (): Promise<number> => {
//   try {
//     const response = await this.get<
//       PaystackAPIResponse<{
//         payment_session_timeout: any; timeout: number 
// }>
//     >('/integration/payment_session_timeout', undefined, this.requestInit);

//     if (response.data.payment_session_timeout) {
//       console.log(`Paystack session timeout: ${response.data.payment_session_timeout} minutes`);
//       return response.data.payment_session_timeout;
//     }

//     console.warn('⚠️ Could not fetch Paystack session timeout, defaulting to 30 minutes');
//     return 30;
//   } catch (error) {
//     console.error('❌ Error fetching Paystack session timeout:', error.message || error);
//     return 30; // default fallback
//   }
// };



  // Method to verify a payment
  verifyPayment = async (paymentReference: string) => {
    const response = await this.get<
      PaystackAPIResponse<VerifyPaymentResponse>
    >(`/transaction/verify/${paymentReference}`, undefined, this.requestInit);

    return convertObjectFromSnakeToCamelCase<VerifyPaymentResponse>(
      response.data
    );
  };

  // Method to cancel a payment (if supported by Paystack)
  cancelPayment = async (paymentId: string) => {
    try {
      const response: AxiosResponse<PaystackAPIResponse<null>> = await axios.post(
        `${this.baseUrl}/transaction/cancel/${paymentId}`,
        {},
        this.requestInit
      );

      if (response.data.status) {
        return { message: 'Payment cancelled successfully' };
      } else {
        throw new Error('Failed to cancel payment');
      }
    } catch (error) {
      console.error('Error cancelling payment:', error.response?.data || error.message || error);
    }
  }

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
