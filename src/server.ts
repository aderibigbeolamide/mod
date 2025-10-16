import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import "reflect-metadata";
import App from "./app.js";
import AuthRoute from "./api/v1/routes/auth.route.js";
import OtpRoute from "./api/v1/routes/otp.route.js";
import PropertyRoute from "./api/v1/routes/property.route.js";
import SwaggerRoute from "./api/v1/routes/swagger.route.js";
import LessorRoute from "./api/v1/routes/lessor.route.js";
import WaitListRoute from "./api/v1/routes/waitlist.route.js";
import ContactRequestRoute from "./api/v1/routes/contact-request.route.js";
import ReportPropertyRoute from "./api/v1/routes/report-property.route.js";
import WishListRoute from "./api/v1/routes/wishlist.route.js";
import RequestToRentRoute from "./api/v1/routes/request-to-rent.route.js";
import KVPRoute from "./api/v1/routes/kvp.route.js";
import MediaRoute from "./api/v1/routes/media.route.js";
import TourRequestRoute from "./api/v1/routes/tour-request.route.js";
import SetupRoute from "./api/v1/routes/setup.route.js";
import LocationRoute from "./api/v1/routes/location.route.js";
import PaymentRoute from "./api/v1/routes/payment.route.js";
import PaymentTransactionRoute from "./api/v1/routes/paymentTransaction.route.js";
import VerifyRoute from "./api/v1/routes/verify.route.js";
import RequestCallRoute from "./api/v1/routes/request-call.route.js";
import ListedElseWhereRoute from "./api/v1/routes/listedElseWhere.route.js";
// import LeaseAgreementRoute from "./api/v1/routes/lease-agreement.route.js";


// dotenv.config()
const app = new App([
  AuthRoute(),
  OtpRoute(),
  KVPRoute(),
  PropertyRoute(),
  SwaggerRoute(),
  LessorRoute(),
  MediaRoute(),
  WaitListRoute(),
  WishListRoute(),
  ContactRequestRoute(),
  ReportPropertyRoute(),
  RequestToRentRoute(),
  TourRequestRoute(),
  SetupRoute(),
  LocationRoute(),
  PaymentRoute(),
  PaymentTransactionRoute(),
  VerifyRoute(),
  RequestCallRoute(),
  ListedElseWhereRoute(),
  // LeaseAgreementRoute(),
]);
app.listen();
