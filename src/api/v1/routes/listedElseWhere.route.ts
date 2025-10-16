import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import ListedElseWhereController from "../controllers/listedElseWhere.controller.js";
import { authenticateLessor, authenticateUser } from "../middlewares/auth.middleware.js";
import Utility from "../../../utils/utility.js";

const ListedElseWhereRoute = Utility.swaggerRouteToAppRoute({
    path: "listed-elsewhere",
    controller: ListedElseWhereController,
    routes: [
        {
            route: "/",
            method: "post",
            handler: ListedElseWhereController.create,
            middleWares: [authenticateLessor],
            description: "Create a new 'Listed Elsewhere' entry for a property. User must be authenticated.",
            sampleRequestData: {
                propertyLink: "https://example.com/property/12345",
                propertyAddress: "123 Freedom Street, Abuja, Nigeria",
                description: "This property is listed on multiple platforms."
            },
            sampleResponseData: Utility.responseFormatter(
                {
                    id: "uuid",
                    userId: "uuid",
                    propertyLink: "https://example.com/property/12345",
                    propertyAddress: "123 Freedom Street, Abuja, Nigeria",
                    description: "This property is listed on multiple platforms.",
                    createdAt: "2025-01-01T00:00:00.000Z",
                },
                "Listing created successfully"
            ),
            noAuthenticate: false,
        },
        {
            route: "/my-listings",
            method: "get",
            handler: ListedElseWhereController.getUserListings,
            middleWares: [authenticateLessor],
            description: "Retrieve all 'Listed Elsewhere' entries created by the authenticated user.",
            sampleResponseData: Utility.responseFormatter(
                [
                    {
                        id: "uuid",
                        userId: "uuid",
                        propertyLink: "https://example.com/property/12345",
                        propertyAddress: "123 Freedom Street, Abuja, Nigeria",
                        description: "This property is listed on multiple platforms.",
                        createdAt: "2025-01-01T00:00:00.000Z",
                    }
                ],
                "User listings retrieved successfully"
            ),
            noAuthenticate: false,
        },
        {
            route: "/:listingId",
            method: "delete",
            handler: ListedElseWhereController.deleteListing,
            middleWares: [authenticateLessor],
            description: "Delete a specific 'Listed Elsewhere' entry belonging to the authenticated user.",
            sampleRequestData: null,
            sampleResponseData: Utility.responseFormatter(
                null,
                "Listing deleted successfully"
            ),
            noAuthenticate: false,
        },
    ],
});

export default ListedElseWhereRoute;
