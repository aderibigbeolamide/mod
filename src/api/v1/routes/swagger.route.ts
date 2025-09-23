import Utility from "../../../utils/utility.js";
import SwaggerController from "../controllers/swagger.controller.js";
 
const SwaggerRoute = Utility.swaggerRouteToAppRoute({
  path: "swagger",
  controller: SwaggerController,
  routes: [
    {
      route: `/post`,
      handlerName: 'post',
      method:'post'
    },
    {
      route: `/get`,
      handlerName: 'get',
      method:'get'
    },
  ],
});

export default SwaggerRoute;
