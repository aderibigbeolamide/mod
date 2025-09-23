import Utility from "../../../utils/utility.js";
import TourRequestController from "../controllers/tour-request.controller.js";
import { CreateTourRequestDto } from "../dtos/tour-request.dto.js";

const TourRequestRoute = Utility.swaggerRouteToAppRoute({
  path: "tour-request",
  controller: TourRequestController,
  routes: [
    {
      route: `/`,
      handlerName: "get",
      method: "get",
      description: `Retrieves all tour requests`,
      sampleResponseData: {
        status: "success",
        message: "Success",
        data: [
          {
            id: "7da5a9ad-739c-4b14-a8a2-14cbc65e4fe7",
            meta: null,
            createdAt: "2023-11-08T13:23:31.483Z",
            updatedAt: "2023-11-08T13:23:31.483Z",
            createdBy: null,
            meetDate: null,
            email: "james@email.com",
            phone: "112233445566",
            preferVirtualTour: true,
          },
          {
            id: "a145bcfb-c82d-49ac-a96a-b6ce4683ed36",
            meta: null,
            createdAt: "2023-11-08T13:29:03.393Z",
            updatedAt: "2023-11-08T13:29:03.393Z",
            createdBy: null,
            meetDate: "2023-12-12",
            email: "newUser101.email.com",
            phone: "newUser101Phone",
            preferVirtualTour: false,
          },
        ],
      },
    },
    {
      route: `/create`,
      handlerName: "createTourRequest",
      method: "post",
      description: `Use this to create a new tour request record`,
      sampleRequestData: new CreateTourRequestDto({
        meetDate: new Date("2023-12-01"),
        email: "newUser101.email.com",
        phone: "newUser101Phone",
        preferVirtualTour: false,
      }),
      sampleResponseData: {
        status: "success",
        message: "Tour Request initailted successfully",
        data: {
          meetDate: "2023-12-12",
          email: "newUser201.email.com",
          phone: "newUser201Phone",
          preferVirtualTour: true,
          meta: null,
          createdBy: null,
          id: "4434e1ab-c982-41c4-8e16-320042e4a6e2",
          createdAt: "2023-11-08T13:38:15.937Z",
          updatedAt: "2023-11-08T13:38:15.937Z",
        },
      },
    },

    {
      route: `/check`,
      handlerName: "checkIfUserRequestedTour",
      method: "get",
      description: `Check if a user has already requested a tour`,
      sampleRequestData: {
        email: "test@example.com",
        phone: "1234567890",
      },
      sampleResponseData: {
        status: "success",
        message: "User has already requested a tour.",
        data: {
          hasRequested: true,
        },
      },
    },
  ],
});

export default TourRequestRoute;
