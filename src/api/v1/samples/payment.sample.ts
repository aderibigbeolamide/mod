// import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
// import { UserEntity } from "../entities/user.entity.js";
// import { PaymentDto, verifyPaymentDto } from "../dtos/payment.dto.js";
// import { CreateAccountDto } from "../dtos/createAccount.dto.js";
// import { PropertyEntity, PropertyUnitEntity } from "../entities/property.entity.js";
// import { v4 as uuidv4 } from 'uuid';

// export namespace PaymentSample {
//   export const makePayment: PaymentDto = {
//     email: "user.one@zdmail.com",
//     callbackUrl: "", // include sample reference in callback
//     amount: 1000,
//     channel: "card",
//     payer: Object.assign(new UserEntity(), {
//       id: "user-id-1",
//       username: "User One"
//     }),
//     payee: Object.assign(new UserEntity(), {
//       id: "user-id-2",
//       username: "Payee User"
//     }),
//     status: PaymentStatuses.INITIALIZED,
//     accessCode: "access-code-123",
//     authorizationUrl: "https://sandbox.monnify.com/checkout/xyz",
//     propertyId: "example-property-id",
//     unitId: "example-unit-id",
//     property: new PropertyEntity(),
//     unit: new PropertyUnitEntity(),
//     paymentReference: "" // Include for Monnify testing
//   };

//   export const monnifyInitPayload = {
//     amount: 1000,
//     customerEmail: "user.one@zdmail.com",
//     paymentReference: "", // dynamically generate if using in Postman
//     redirectUrl: "",
//     paymentDescription: "Rent payment for unit",
//     contractCode: "YOUR_CONTRACT_CODE", // replace with env or sample
//     metadata: {
//       payerId: "user-id-1",
//       payeeId: "user-id-2",
//       email: "user.one@zdmail.com",
//       amount: 1000
//     },
//     customerName: "User One",
//     paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
//     currencyCode: "NGN"
//   };

//   export const verifyPayment = {
//     reference: "ref-123456"
//   };

//   export const createAccountDetails: CreateAccountDto = {
//     payee: new UserEntity(),
//     accountNumber: "0480569976",
//     accountName: "",
//     bankCode: "",
//     bankName: "Access Bank",
//     bankId: "",
//   };

//   export const fetchAccountDetails: CreateAccountDto = {
//     payee: new UserEntity(),
//     accountNumber: "0480569976",
//     accountName: "",
//     bankCode: "",
//     bankName: "Access Bank",
//     bankId: "",
//   };
// }

import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { UserEntity } from "../entities/user.entity.js";
import { PaymentDto, verifyPaymentDto } from "../dtos/payment.dto.js";
import { CreateAccountDto } from "../dtos/createAccount.dto.js";

export namespace PaymentSample {
  export const makePayment: PaymentDto = {
    email: "user.one@zdmail.com",
    callbackUrl: "https://letbud.com",
    amount: 1000, // Example amount
    channel: "card", // Example payment method
    payer: new UserEntity(), // Mock UserEntity object
    status: PaymentStatuses.INITIALIZED,
    accessCode: "",
    authorizationUrl: "",
    propertyId: "example-property-id", // Mock property ID
    unitId: "example-unit-id",       // Mock unit ID
    // property: new PropertyEntity(),
    // unit: new PropertyUnitEntity(),
  };

  export const verifyPayment = {
    reference: "",
  };

  export const createAccountDetails: CreateAccountDto = {
    payee: new UserEntity(),
    accountNumber: "0480569976",
    accountName: "",
    bankCode: "",
    bankName: "Access Bank",
    bankId: "",
  };

  export const fetchAccountDetails: CreateAccountDto = {
    payee: new UserEntity(),
    accountNumber: "0480569976",
    accountName: "",
    bankCode: "",
    bankName: "Access Bank",
    bankId: "",
  };
}

