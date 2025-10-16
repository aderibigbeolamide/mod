import { Router } from "express";
import { Routes } from "../interfaces/routes.interface.js";
import RequestCallController from "../controllers/request-call.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import Utility from "../../../utils/utility.js";
import requestCallController from "../controllers/request-call.controller.js";


const RequestCallRoute = Utility.swaggerRouteToAppRoute({
    path: "request-call",
    controller: requestCallController,
    routes: [
        {
            route: "/",
            method: "post",
            handler: requestCallController.createRequestCall,
            middleWares: [authenticateUser],
            description: "Create a new request call. User must be authenticated.",
            sampleRequestData: {
                useUserData: true,
                // Optional overrides
                email: "custom@example.com",
                phoneNumber: "+1234567890",
                preferredCallTime: "9AM-5PM EST",
                preferredCallDay: "Monday - Friday",
                overrideReason: "Preferred contact method"
            },
            sampleResponseData: Utility.responseFormatter(
                {
                    id: "uuid",
                    userId: "uuid",
                    email: "user@example.com",
                    phoneNumber: "+1234567890",
                    preferredCallTime: "Monday-Friday 9AM-5PM EST",
                    isEmailOverridden: false,
                    isPhoneOverridden: false,
                    overrideReason: null,
                    createdAt: "2025-01-01T00:00:00.000Z"
                },
                "Request call created successfully"
            ),
            noAuthenticate: false,
        },
        {
            route: "/my-requests",
            method: "get",
            handler: requestCallController.getUserRequestCalls,
            middleWares: [authenticateUser],
            description: "Get all request calls for the authenticated user",
            sampleResponseData: Utility.responseFormatter(
                [
                    {
                        id: "uuid",
                        userId: "uuid",
                        email: "user@example.com",
                        phoneNumber: "+1234567890",
                        preferredCallTime: "Monday-Friday 9AM-5PM EST",
                        isEmailOverridden: false,
                        isPhoneOverridden: false,
                        processedAt: "2025-01-01T01:00:00.000Z",
                        createdAt: "2025-01-01T00:00:00.000Z"
                    }
                ],
                "Request calls retrieved successfully"
            ),
            noAuthenticate: false,
        },
        {
            route: "/user-data",
            method: "get",
            handler: requestCallController.getUserDataForConfirmation,
            middleWares: [authenticateUser],
            description: "Get user's current email and phone for confirmation before request call",
            sampleResponseData: Utility.responseFormatter(
                {
                    email: "user@example.com",
                    phoneNumber: "+1234567890",
                    hasEmail: true,
                    hasPhone: true
                },
                "User contact information retrieved"
            ),
            noAuthenticate: false,
        },
    ],
});

export default RequestCallRoute;