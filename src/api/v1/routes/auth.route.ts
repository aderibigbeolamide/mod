import AuthController from "../controllers/auth.controller.js";
import Utility from "../../../utils/utility.js";
import { AuthSample } from "../samples/auth.sample.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const AuthRoute = Utility.swaggerRouteToAppRoute({
  path: "auth",
  controller: AuthController,
  routes: [
    {
      route: `/sign-in`,
      handlerName: "signIn",
      method: "post",
      sampleRequestData: AuthSample.signIn,
      description: `Use this to login to system.`,
      sampleResponseData: Utility.responseFormatter(
        { data: AuthSample.user, token: AuthSample.token },
        "Login successful"
      ),
    },
    {
      route: `/forget-password`,
      handlerName: "forgetPassword",
      method: "post",
      description: "Initiate password reset by sending an OTP to the user's email.",
      sampleRequestData: {
        email: "user@example.com"
      },
      sampleResponseData: {
        status: "Success",
        message: "OTP for password reset has been sent to your email.",
        data: {}
      },
    },
    {
      route: `/reset-password`,
      handlerName: "resetPassword",
      method: "post",
      description: "Reset the user's password using the OTP received via email.",
      sampleRequestData: {
        email: "user@example.com",
        otp: "123456",
        newPassword: "newSecurePassword123!"
      },
      sampleResponseData: {
        status: "Success",
        message: "Password reset successfully.",
        data: {
          id: "user-id",
          email: "user@example.com",
          // other non-sensitive user fields
        }
      },
    },
    {
      route: `/sign-up`,
      handlerName: "signUp",
      method: "post",
      sampleRequestData: AuthSample.signUp,
      description: `Use this to sign up a new user onto the system.`,
      sampleResponseData: Utility.responseFormatter(
        { data: AuthSample.user, token: AuthSample.token },
        "Sign up successful"
      ),
    },
    {
      route: `/complete-sign-up`,
      handlerName: "completeSignUp",
      method: "post",
      middleWares: [authenticateUser],
      sampleRequestData: AuthSample.completeSignUp,
      description: `Use this complete sign up of a user`,
      sampleResponseData: Utility.responseFormatter({ data: AuthSample.user2 }, "Sign up complete"),
      noAuthenticate: false,
    },

    {
      route: "/users/all",
      method: "get",
      handler: AuthController.fetchAllUsers,
      description: "Fetch all users and return total count",
      sampleResponseData: Utility.responseFormatter({
        users: [],
        total: 0
      }),
      // middleWares: [authenticateUser],
    },

    /* {
      route: `/find-by-email`,
      handlerName: "findByEmail",
      method: "post",
      // middleWares: [authenticateUser],
      sampleRequestData: AuthSample.findByEmail,
      description: `Use this complete sign up of a user`,
      sampleResponseData: Utility.responseFormatter({ data: AuthSample.user2 }, "Sign up complete"),
      noAuthenticate: false,
    },

    {
      route: `/find-by-number`,
      handlerName: "findByNumber",
      method: "post",
      // middleWares: [authenticateUser],
      sampleRequestData: AuthSample.findByPhoneNumber,
      description: `Use this complete sign up of a user`,
      sampleResponseData: Utility.responseFormatter({ data: AuthSample.user2 }, "Sign up complete"),
      noAuthenticate: false,
    }, */

    {
      route: `/check-user`,
      handlerName: "findByEmailOrPhone",
      method: "post",
      // middleWares: [authenticateUser],
      sampleRequestData: AuthSample.findByEmailOrPhone,
      description: `Use this complete sign up of a user`,
      sampleResponseData: Utility.responseFormatter({ data: AuthSample.user }, "Check complete"),
      noAuthenticate: false,
    },

  ],
});

export default AuthRoute;
