import OtpController from "../controllers/otp.controller.js";
import Utility from "../../../utils/utility.js";

const OtpRoute = Utility.swaggerRouteToAppRoute({
  path: "otp",
  controller: OtpController,
  routes: [
    {
      route: `/`,
      handlerName: "generateOtp",
      method: "get",
    },
    {
      route: `/`,
      handlerName: "validateOtp",
      method: "post",
    },
    {
      route: `/`,
      handlerName: "verifyEmailLink",
      method: "post",
    },
  ],
});

export default OtpRoute;
