import Utility from "../../../utils/utility.js";
import WishListController from "../controllers/wishlist.controller.js";

const WishListRoute = Utility.swaggerRouteToAppRoute({
  path: "wishlist",
  controller: WishListController,
  routes: [
    {
      route: `/`,
      handlerName: "save",
      method: "post",
      description: `Create wishlist`,
      sampleRequestData: {
        userId: "randomUserId100",
        propertyId: "randomPropertyId100",
      },
      sampleResponseData: {
        status: "success",
        message: "Successfully created a wishlist",
        data: {
          userId: "randomUserId100",
          propertyId: "randomPropertyId100",
          id: "fd4084d9-ec00-4fc0-be1a-e515205de0d8",
          createdAt: "2023-11-08T14:03:13.531Z",
          updatedAt: "2023-11-08T14:03:13.531Z",
        },
      },
    },
    {
      route: `/:wishlistId`,
      handlerName: "delete",
      method: "delete",
      description: `Use this to delete a wishlist`,
      sampleResponseData: {
        status: "success",
        message: "Wishlist deleted successfully",
        data: {
          raw: [],
          affected: 1,
        },
      },
    },
    {
      route: `/:userId`,
      method: "get",
      handlerName: "fetch",
      parameters: [{ name: ":userId", in: "path", required: true }],
      description: `Retrieve all wishlist owned by a user`,
      sampleResponseData: {
        status: "success",
        message: "Success",
        data: [
          {
            id: "b3fda21e-ba9a-4aa4-bce4-81032703c59e",
            userId: "c1b3a4-qw12334",
            propertyId: "2329cffd-861a-4476-908a-af0fd2fe143d",
            createdAt: "2023-10-04T22:27:19.393Z",
            updatedAt: "2023-10-04T22:27:19.393Z",
          },
          {
            id: "fb52937f-7115-44da-8849-b3fab99f623d",
            userId: "c1b3a4-qw12334",
            propertyId: "2329cffd-861a",
            createdAt: "2023-10-04T22:27:32.709Z",
            updatedAt: "2023-10-04T22:27:32.709Z",
          },
        ],
      },
    },
    {
      route: `/export/:table`,
      parameters: [
        { name: ":table", in: "path", required: true },
        { name: "format", in: "query", required: false, type: "string" },
      ],
      method: "get",
      handlerName: "exportTable",
      description: `Downlaod Data in CSV format filtered by there table name and format`,
    },
  ],
});

export default WishListRoute;
