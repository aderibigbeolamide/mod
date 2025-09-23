import Utility from "../../../utils/utility.js";
import LocationController from "../controllers/location.controller.js";
import SetupController from "../controllers/setup.controller.js";

const LocationRoute = Utility.swaggerRouteToAppRoute({
  path: "location",
  controller: LocationController,
  routes: [
    {
      route: `/initiate`,
      handler: LocationController.initiate,
      method: "post",
      description: `Use this to load default data`,
    },
    {
      route: `/states`,
      handler: LocationController.getStates,
      method: "get",
      sampleResponseData: {
        status: "success",
        data: [
          {
            name: "Abia",
          },
          {
            name: "Adamawa",
          },
          {
            name: "Anambra",
          },
        ],
      },
    },
    {
      route: `/lgas`,
      handler: LocationController.getLGAs,
      method: "get",
      parameters: [{ in: "query", name: "state" }],
      sampleResponseData: {
        status: "success",
        data: [
          {
            name: "Abia",
          },
          {
            name: "Adamawa",
          },
          {
            name: "Anambra",
          },
        ],
      },
    },
    {
      route: `/wards`,
      handler: LocationController.getWards,
      method: "get",
      parameters: [{ in: "query", name: "lga" }],
      sampleResponseData: {
        status: "success",
        data: [
          {
            name: "mafa",
          },
          {
            name: "mandadawa",
          },
          {
            name: "shekau",
          },
        ],
      },
    },
  ],
});
export default LocationRoute;
