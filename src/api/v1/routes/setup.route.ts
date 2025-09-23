import Utility from "../../../utils/utility.js";
import SetupController from "../controllers/setup.controller.js";

const SetupRoute = Utility.swaggerRouteToAppRoute({
  path: "setup",
  controller: SetupController,
  routes: [
    {
      route: `/initiate`,
      handler: SetupController.initiate,
      method: "post",
      description: `Use this to load default data`,
    },
  ],
});
export default SetupRoute;
