import Utility from "../../../utils/utility.js";
import PaymentTransactionController from "../controllers/paymentTransaction.controller.js";
import paymentTransactionController from "../controllers/paymentTransaction.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { PaymentTransactionSample } from "../samples/paymentTransaction.sample.js";


const PaymentTransactionRoute = Utility.swaggerRouteToAppRoute({
  path: "paymentTransaction",
  controller: paymentTransactionController,
  routes: [
    {
        route: `/:paymentId/:requestToRentId/createPaymentTransaction`,
        handler: PaymentTransactionController.createPaymentTransaction,
        method: "patch",
        middleWares: [authenticateUser],
        description: `This route can be used to create a transaction for a given payment and request to rent.`,
        parameters: [
            { name: "paymentId", in: "path", required: true, description: "The ID of the payment" },
            { name: "requestToRentId", in: "path", required: true, description: "The ID of the request to rent" }
        ],
        // sampleResponseData: Utility.responseFormatter(PaymentTransactionSample.createPaymentTransaction),
    },
    
    {
      route: `/:transactionId/getTransactionById`,
      handler: PaymentTransactionController.getTransactionById,
      method: "get",
      middleWares: [authenticateUser],
      description: `Use this to get a Transaction by their Id`,
      parameters: [{ name: ":transactionId", in: "path", required: true }],
    },
    {
      route: `/getAllPendingTransactions`,
      handler: PaymentTransactionController.getAllPendingTransactions,
      method: "get",
      middleWares: [authenticateUser],
      description: `Use this to get all Pending Transaction`,
    },
    {
      route: `/getAllConfirmedTransactions`,
      handler: PaymentTransactionController.getAllConfirmedTransactions,
      method: "get",
      middleWares: [authenticateUser],
      description: `Use this to get all Successfull Transaction`,
    },
  ],
});

export default PaymentTransactionRoute;
