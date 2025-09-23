import Utility from "../../../utils/utility.js";
import paymentController from "../controllers/payment.controller.js";
import { PaymentDto } from "../dtos/payment.dto.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { PaymentSample } from "../samples/payment.sample.js";

const PaymentRoute = Utility.swaggerRouteToAppRoute({
  path: "payment",
  controller: paymentController,
  routes: [
    {
      route: `/makePayment`,
      handlerName: "makePayment",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: PaymentSample.makePayment,
      description: `Use this to proceed with your payment.`,
      sampleResponseData: Utility.responseFormatter(PaymentSample.makePayment, "Payment initiated"),
    },

    {
      route: `/verifyPayment`,
      handlerName: "verifyPayment",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: PaymentSample.verifyPayment,
      description: `Use this to proceed with your payment.`,
      sampleResponseData: Utility.responseFormatter(PaymentSample.verifyPayment, "Payment verified"),
    },

    {
      route: `/createAccountDetails`,
      handlerName: "createAccountDetails",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: PaymentSample.createAccountDetails,
      description: `Please confirm your account details.`,
      sampleResponseData: Utility.responseFormatter(PaymentSample.createAccountDetails, "Account Saved"),
    },

    

    {
      route: `/fetchAccountDetails`,
      handlerName: "fetchAccountDetails",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: PaymentSample.fetchAccountDetails,
      description: `Please enter your account Number.`,
      sampleResponseData: Utility.responseFormatter(PaymentSample.fetchAccountDetails, "Account Saved"),
    },


    // {
    //   route: `/getPayerByUnitId`,
    //   handler: paymentController.getPayerByUnitId,
    //   method: "get",
    //   description: `Use this to get Payer by Unit ID`,
    // },

    // {
    //   route: `/`,
    //   handlerName: "confirmAndTransfer",
    //   method: "post",
    // },
    {
        route: `/`,
        handlerName: "refundPayment",
        method: "post",
      },
    {
      route: `/checkUnitAvailability/:unitId`,
      handlerName: "checkUnitAvailability",
      method: "get",
      middleWares: [authenticateUser],
      description: `Check if a unit is available for payment (not locked, occupied, or already paid).`,
      parameters: [{ name: "unitId", in: "path", required: true, description: "The ID of the unit to check" }],
    },
    {
      route: `/cleanupExpiredLocks`,
      handlerName: "cleanupExpiredLocks",
      method: "post",
      middleWares: [authenticateUser],
      description: `Cleanup expired payment locks from units.`,
    },
  ],
});

export default PaymentRoute;
