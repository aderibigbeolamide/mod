import Utility from "../../../utils/utility.js";
import RequestToRentController from "../controllers/request-to-rent.controller.js";
import {
  CreateRequestToRentDto,
  UpdateAdditionalInfoDto,
  UpdateHouseholdInfoDto,
  UpdateIncomeInfoDto,
  UpdateResidenceInfoDto,
} from "../dtos/request-to-rent.dto.js";
import {
  authenticateLessor,
  authenticateRenter,
  authenticateUser,
} from "../middlewares/auth.middleware.js";

const RequestToRentRoute = Utility.swaggerRouteToAppRoute({
  path: "request-to-rent",
  controller: RequestToRentController,
  routes: [
    {
      route: `/`,
      handlerName: "getAll",
      method: "get",
      description: `Retrieve all records with complete status based on authentication`,
      middleWares: [authenticateUser],
      sampleResponseData: {
        status: "Success",
        message: "Request to rent success",
        data: {},
      },
    },
    {
      route: "/:userId/getPendingRequestsForLandlord",
      handlerName: "getPendingRequestsForLandlord",
      method: "get",
      description: "Retrieve all pending requests for a landlord",
      middleWares: [authenticateLessor],
    },
    // {
    //   route: `/receivedApplications`,
    //   handler: RequestToRentController.myReceivedApplicationProperties,
    //   method: "get",
    //   description: `Use this to get properties that have received applications`,
    //   // sampleResponseData: Utility.responseFormatter(R.search),
    //   middleWares: [authenticateLessor],
    // },
    {
      route: "/review/:requestToRentID",
      handlerName: "reviewRequestToRent",
      method: "put",
      description: "Approve or reject a request to rent based on landlord's review",
      middleWares: [authenticateLessor], // Ensure only landlords can access this
      parameters: [
        {
          name: "requestToRentID",
          in: "path",
          required: true,
          description: "ID of the rental request",
        },
        {
          name: "isApprove",
          in: "query",
          required: true,
          type: "string",
          description: "Boolean value (true/false) to approve or reject",
        },
      ],
      sampleRequestData: {
        isApprove: true, // or false, depending on approval
      },
      sampleResponseData: {
        status: "Success",
        message: "Request reviewed successfully",
        data: {
          id: "requestToRentID",
          isApprove: true,
        },
      },
    },
    {
      route: `/create`,
      handlerName: "createRequestToRent",
      method: "post",
      description: `Create a new rent request`,
      middleWares: [authenticateRenter],
      sampleRequestData: new CreateRequestToRentDto({
        firstName: "Bobby",
        middleName: "Tarantino",
        lastName: "Fischer",
        identificationMode: "NIN",
        email: "bobfish@gmail.com",
        phoneNumber: "+2348081818289",
        summary: "Some summary",
        propertyId: "b43627cf-376b-4db9-b1f2-ba5379cd9f24",
        unitId: "079d662c-42c9-4f0e-bd84-aedfbe0dfc04",
        landlordSignedAt: new Date(),
        landlordSignedByIp: "127.0.0.1",
        tenantSignedByIp: "127.0.0.1"
      }),
      sampleResponseData: {
        status: "Success",
        message: "Request to rent initailted successfully",
        data: {},
      },
    },
    {
      route: `/household/:requestToRentID`,
      handlerName: "updateHouseholdInfo",
      method: "put",
      description: `Updates HouseholdInfo`,
      middleWares: [authenticateRenter],
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
      sampleRequestData: new UpdateHouseholdInfoDto({
        numPeopleLiving: 2,
        numCoTenantsAbove18: 2,
        coTenants: [
          {
            coTenantFirstName: "James",
            coTenantLastName: "Smith",
            coTenantEmail: "James@Smith.com",
            coTenantIdentificationMode: "NIN",
          },
          {
            coTenantFirstName: "John",
            coTenantLastName: "Doe",
            coTenantEmail: "Johm@Doe.com",
            coTenantIdentificationMode: "NIN",
          },
        ],
        hasPets: true,
        petType: "dog",
        numPets: 1,
        moveInDate: new Date("2023-12-01"),
      }),
      sampleResponseData: {
        status: "Success",
        message: "Household Info updated successfully",
        data: {},
      },
    },
    {
      route: `/residence/:requestToRentID`,
      handlerName: "updateResidenceInfo",
      method: "put",
      description: `Updates ResidenceInfo`,
      middleWares: [authenticateRenter],
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
      sampleRequestData: new UpdateResidenceInfoDto({
        currentAddress: "1 western avenur",
        switchReason: "relcation",
        propertyManagerName: "Chigozie",
        propertyManagerContact: "123456",
        pastAddress: "1 western avenue",
        pastMoveInDate: new Date(""),
        pastMoveOutDate: new Date(""),
        reasonForLeaving: "relocation",
        pastPropertyManagerContact: "0909090",
      }),
      sampleResponseData: {
        status: "Success",
        message: "Residence Info updated successfully",
        data: {},
      },
    },
    {
      route: `/income/:requestToRentID`,
      handlerName: "updateIncomeInfo",
      method: "put",
      description: `Updates Income Info`,
      middleWares: [authenticateRenter],
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
      sampleRequestData: new UpdateIncomeInfoDto({
        currentSalaryEstimate: "100,000-200,000",
        workplace: "Jumia",
        startDateAtCompany: new Date("2020-01-01"),
        companyRefereeName: "John",
        refereeEmail: "John@jumia.com",
        refereePhoneNumber: "90923397",
      }),
      sampleResponseData: {
        status: "Success",
        message: "Income Info updated successfully",
        data: {},
      },
    },
    // get Approved Request To rent by User id 
    {
      route: `/getApprovedRequestToRent`,
      handlerName: "getApprovedRequestToRentByUserId",
      method: "get",
      description: `Get Approved Request To Rent by User ID`,
      middleWares: [authenticateRenter],
      sampleResponseData: {
        status: "Success",
        message: "Approved Request To Rent fetched successfully",
        data: {},
      },
    },
    // get Approved Request To rent by lessor user id 
    {
      route: `/getApprovedRequestToRentByLessorUserId`,
      handlerName: "getApprovedRequestToRentByUserId",
      method: "get",
      description: `Get Approved Request To Rent by Lessor User ID`,
      middleWares: [authenticateLessor],
      sampleResponseData: {
        status: "Success",
        message: "Approved Request To Rent fetched successfully",
        data: {},
      },
    },
    {
      route: `/additional/:requestToRentID`,
      handlerName: "updateAdditionalInfo",
      method: "put",
      description: `Updates Additional Info`,
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
      middleWares: [authenticateRenter],
      sampleRequestData: new UpdateAdditionalInfoDto({
        evictedBefore: false,
        evictionReason: "",
        convictedBefore: false,
        convictionDetails: "string",
        emergencyContactName: "Ngozi",
        relationshipWithContact: "aunt",
        emergencyContactEmail: "Ngozi",
        emergencyContactPhoneNumber: "123455667",
      }),
      sampleResponseData: {
        status: "Success",
        message: "Additional Info updated successfully",
        data: {},
      },
    },
    {
      route: `/is-complete/:requestToRentID`,
      handlerName: "updateIsComplete",
      method: "put",
      description: `Completes the Property application process`,
      middleWares: [authenticateRenter],
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
    },
    {
      route: `/delete/:requestToRentID`,
      handlerName: "deleteRequestToRent",
      method: "delete",
      description: `Delete a request to rent`,
      middleWares: [authenticateRenter],
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
      sampleResponseData: {
        status: "Success",
        message: "Request to rent deleted successfully",
        data: {},
      },
    },
    {
      route: `/summary/:requestToRentID`,
      handlerName: "summary",
      method: "get",
      description: `summary details`,
      parameters: [{ name: ":requestToRentID", in: "path", required: true }],
    },
    {
      route: `/applications/:propertyId`,
      handlerName: "applications",
      middleWares: [authenticateLessor],
      method: "get",
      parameters: [
        { name: ":propertyId", in: "path", required: true },
        { name: "userId", in: "query", required: false },
      ],
      description: `Fetch all property applications by propertyId and userId(optional)`,
    },
    {
      route: `/applications/:propertyId/users`,
      handlerName: "interestedUsers",
      middleWares: [authenticateLessor],
      method: "get",
      parameters: [{ name: ":propertyId", in: "path", required: true }],
      description: `Fetch all users interested in a property:`,
    },

    {
      route: `/applications/lessorUerId/users`,
      handlerName: "interestedUsers",
      middleWares: [authenticateLessor],
      method: "get",
      // parameters: [{ name: ":propertyId", in: "path", required: true }],
      description: `Fetch all users interested in a property:`,
    },
    {
      route: `/review/:requestToRentId`,
      handlerName: "reviewRequestToRent",
      method: "put",
      description: `Approve or reject a rental request. Optionally, pass a moveInDate in the request body.`,
      middleWares: [authenticateLessor],
      parameters: [
        { name: ":requestToRentId", in: "path", required: true },
        {
          name: "isApprove", in: "query", required: true, type: "string",
          description: "Boolean value (true/false) to approve or reject the request",
        },
        {
          name: "moveInDate",
          in: "query",
          required: false,
          type: "string",
          description: "Optional move-in date in ISO format",
        },
      ],
      sampleRequestData: {
        isApprove: true,
        moveInDate: "2025-03-01T00:00:00.000Z",
      },
      sampleResponseData: {
        status: "Success",
        message: "Rental request approved successfully",
        data: {
          id: "requestToRentID",
          isApprove: true,
          moveInDate: "2025-03-01T00:00:00.000Z",
        },
      },
    },
    {
      route: `/hasUserRequestedToRent/:propertyId`,
      handlerName: "hasUserRequestedToRent",
      method: "get",
      description: `Check if a user has already requested to rent a specific property`,
      middleWares: [authenticateUser],
      parameters: [
        {
          name: ":propertyId",
          in: "path",
          required: true,
          type: "string",
          description: "The ID of the property to check",
        },
      ],
      sampleResponseData: {
        status: "Success",
        message: "User has already requested to rent this property.",
        data: {
          hasRequested: true, // or false
        },
      },
    },
    {
      route: `/renter/applications/:renterId`,
      handlerName: "getRenterApplications",
      method: "get",
      description: `Get all the properties that a renter has applied to (approved or not)`,
      middleWares: [authenticateRenter],
      parameters: [
        {
          name: ":renterId",
          in: "path",
          required: true,
          type: "string",
          description: "Renter ID",
        },
      ],
      sampleResponseData: {
        status: "Success",
        message: "Properties that user applied to",
        data: {},
      },
    },
  ],
});

export default RequestToRentRoute;
