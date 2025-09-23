import Utility from "../../../utils/utility.js";
import WaitListController from "../controllers/waitlist.controller.js";

const WaitListRoute = Utility.swaggerRouteToAppRoute({
  path: "waitlist",
  controller: WaitListController,
  routes: [
    {
      route: `/`,
      handlerName: "waitlist",
      method: "get",
      description: `Return all waitlist filtered by a date range`,
      sampleResponseData: {
        status: "success",
        message: "Success",
        data: [
          {
            id: "4380bed2-96f6-43c6-9901-02bbb5397b53",
            meta: null,
            createdAt: "2023-09-29T00:16:24.526Z",
            updatedAt: "2023-09-29T00:16:24.526Z",
            createdBy: null,
            email: "test.email@example.com",
          },
          {
            id: "dd3065ae-1e29-4118-bf51-6fd42220e71f",
            meta: null,
            createdAt: "2023-09-26T00:06:54.112Z",
            updatedAt: "2023-09-26T00:06:54.112Z",
            createdBy: null,
            email: "kylie.byrd@example.com",
          },
        ],
      },
    },
    {
      route: `/join-waitlist`,
      handlerName: "joinWaitList",
      method: "post",
      description: `Use this to create a new waitlist record`,
      sampleRequestData: {
        email: "testEmail@example.com",
      },
      sampleResponseData: {
        status: "success",
        message: "Successfully joined waitlist",
        data: {
          email: "testEmail@example.com",
          meta: null,
          createdBy: null,
          id: "89a13c51-a95e-4031-9c0e-c2b3572eb268",
          createdAt: "2023-11-08T13:45:03.014Z",
          updatedAt: "2023-11-08T13:45:03.014Z",
        },
      },
    },
    {
      route: `/download`,
      method: "get",
      handlerName: "download",
      description: `Downlaod all WaitList in CSV format filtered by a date range`,
    },
  ],
});

export default WaitListRoute;
