import Utility from "../../../utils/utility.js";
import ReportPropertyController from "../controllers/report-property.controller.js";

const ReportPropertyRoute = Utility.swaggerRouteToAppRoute({
  path: "report-property",
  controller: ReportPropertyController,
  routes: [
    {
      route: `/:propertyId`,
      handlerName: "report",
      method: "post",
      parameters: [{ name: ":propertyId", in: "path", required: true }],
      description: `Report a property`,
    },
  ],
});

export default ReportPropertyRoute;
