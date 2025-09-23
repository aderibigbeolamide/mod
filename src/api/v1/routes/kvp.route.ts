import Utility from "../../../utils/utility.js";
import SearchService from "../services/search.service.js";
import { KVPController } from "../controllers/kvp.controller.js";
import { KVPSample } from "../samples/kvp.sample.js";
const subject = "KVP",
  subjectP = "KVPs";
const KVPRoute = Utility.swaggerRouteToAppRoute<typeof KVPController>({
  path: "kvp",
  controller: KVPController,
  routes: [
    {
      route: ``,
      handler: KVPController.create,
      method: "post",
      description: `Use this to save the info of a ${subject}`,
      sampleRequestData: KVPSample.update,
    },
    {
      route: `/:key`,
      handler: KVPController.update,
      method: "put",
      description: `Use this to save the info of a ${subject} using the ${subject}'s key`,
      parameters: [{ name: ":key", in: "path", required: true }],
      sampleRequestData: KVPSample.update,
    },
    // {
    //   route: `/:codeID`,
    //   handler: CodeController.delete,
    //   method: "delete",
    //   description: `Use this to delete the info of a ${subject} using the ${subject} ID`,
    //   parameters: [{ name: ":codeID", in: "path", required: true }],
    // },
    // {
    //   route: `/:codeID/get`,
    //   handler: CodeController.getByID,
    //   method: "get",
    //   description: `Use this to get the details of a ${subject} using the ${subject} ID`,
    //   parameters: [{ name: ":codeID", in: "path", required: true }],
    // },
    // {
    //   route: `/:code/:category`,
    //   handler: CodeController.getByCodeAndCat,
    //   method: "get",
    //   description: `Use this to get the details of a ${subject} using the ${subject} code`,
    //   parameters: Utility.swaggerPathParams(CodeSample.getByCodeCategory),
    // },
    {
      route: `/keys`,
      handler: KVPController.getKeys,
      method: "get",
      description: `Use this to get all the keys in the ${subjectP} table`,
    },
    {
      route: `/search`,
      handler: KVPController.search,
      method: "get",
      description: `Use this to search for ${subjectP}`,
      parameters: SearchService.queryParams(KVPSample.searchQuery),
    },
  ],
});

export default KVPRoute;
