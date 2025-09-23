import Utility from "../../../utils/utility.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import VerifyController from "../controllers/verify.controller.js";
import { VerifySample } from "../samples/verify.sample.js";

const VerifyRoute = Utility.swaggerRouteToAppRoute({
  path: "verify",
  controller: VerifyController,
  routes: [
    {
      route: `/`,
      handlerName: "verify",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: VerifySample.verify,
      description: `validate ID`,
      sampleResponseData: Utility.responseFormatter({}),
    },
    {
      route: `/isVerified`,
      handlerName: "isVerified",
      method: "get",
      description: `check if a user is verified`,
      middleWares: [authenticateUser],
      sampleResponseData: Utility.responseFormatter({}),
    },
  ],
});

export default VerifyRoute;
