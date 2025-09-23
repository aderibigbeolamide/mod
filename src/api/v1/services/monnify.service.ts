// import axios from 'axios';
// import { convertObjectFromSnakeToCamelCase } from '../../../utils/snakeToCamelCase.js';
// import { HttpException } from '../exceptions/http.exception.js';
// import BaseApi from './paystackBaseApi.service.js';
// import {
//   MonnifyAPIResponse,
//   InitializeMonnifyPaymentArgs,
//   InitializeMonnifyPaymentResponse,
//   VerifyMonnifyPaymentResponse,
//   RefundMonnifyPaymentArgs,
//   RefundMonnifyPaymentResponse
// } from '../interfaces/monnifyAPIResponse.interface.js';

// const config = {
//   monnifyApiKey: process.env.MONNIFY_API_KEY,
//   monnifySecret: process.env.MONNIFY_SECRET_KEY,
//   monnifyContractCode: process.env.MONNIFY_CONTRACT_CODE,
//   monnifyBaseUrl: process.env.MONNIFY_BASE_URL,
// };

// export class MonnifyApi extends BaseApi {
//   token: string | null = null;

//   constructor() {
//     super(config.monnifyBaseUrl as string);
//   }

//   private async authenticate() {
//     const auth = Buffer.from(`${config.monnifyApiKey}:${config.monnifySecret}`).toString('base64');
//     const response = await axios.post(
//       `${config.monnifyBaseUrl}/api/v1/auth/login`,
//       {},
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//       }
//     );
//     this.token = response.data.responseBody.accessToken;
//   }

//   private async getAuthHeader() {
//     if (!this.token) {
//       await this.authenticate();
//     }

//     return {
//       headers: {
//         Authorization: `Bearer ${this.token}`,
//         'Content-Type': 'application/json',
//       },
//     };
//   }

//   initializePayment = async (paymentDetails: InitializeMonnifyPaymentArgs) => {
//     const payload = {
//       ...paymentDetails,
//       contractCode: config.monnifyContractCode,
//       currencyCode: paymentDetails.currencyCode ?? 'NGN',
//       paymentMethods: paymentDetails.paymentMethods ?? ['CARD', 'ACCOUNT_TRANSFER'],
//     };

//     const response = await this.post<MonnifyAPIResponse<InitializeMonnifyPaymentResponse>>(
//       '/api/v1/merchant/transactions/init-transaction',
//       payload,
//       undefined,
//       await this.getAuthHeader()
//     );

//     if (!response.requestSuccessful) {
//       throw new HttpException(500, 'Monnify Payment Initialization Failed', response.responseMessage, 'MONNIFY_INIT_FAILED');
//     }

//     return convertObjectFromSnakeToCamelCase<InitializeMonnifyPaymentResponse>(response.responseBody);
//   };

//   verifyPayment = async (transactionReference: string) => {
//     const response = await this.get<MonnifyAPIResponse<VerifyMonnifyPaymentResponse>>(
//       `/api/v2/transactions/${transactionReference}`,
//       undefined,
//       await this.getAuthHeader()
//     );

//     if (!response.requestSuccessful) {
//       throw new HttpException(500, 'Monnify Payment Verification Failed', response.responseMessage, 'MONNIFY_VERIFY_FAILED');
//     }

//     return convertObjectFromSnakeToCamelCase<VerifyMonnifyPaymentResponse>(response.responseBody);
//   };

//   refundPayment = async (refundDetails: RefundMonnifyPaymentArgs) => {
//     const response = await this.post<MonnifyAPIResponse<RefundMonnifyPaymentResponse>>(
//       '/api/v1/merchant/refund/request',
//       refundDetails,
//       undefined,
//       await this.getAuthHeader()
//     );

//     if (!response.requestSuccessful) {
//       throw new HttpException(500, 'Monnify Refund Failed', response.responseMessage, 'MONNIFY_REFUND_FAILED');
//     }

//     return convertObjectFromSnakeToCamelCase<RefundMonnifyPaymentResponse>(response.responseBody);
//   };
// }

// const monnifyApi = new MonnifyApi();
// export default monnifyApi;
