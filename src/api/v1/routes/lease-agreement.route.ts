import Utility from "../../../utils/utility.js";
import LeaseAgreementController from "../controllers/lease-agreement.comtroller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const LeaseAgreementRoute = Utility.swaggerRouteToAppRoute({
  path: "lease-agreement",
  controller: LeaseAgreementController,
  routes: [
    {
      route: `/generate/:requestToRentId`,
      handler: LeaseAgreementController.generateLeaseAgreement,
      method: "get",
      description: `Generate and download a LetBud lease agreement PDF for a specific rental request`,
      middleWares: [authenticateUser],
      parameters: [
        {
          name: ":requestToRentId",
          in: "path",
          required: true,
          description: "The ID of the request to rent application",
        },
      ],
      sampleResponseData: {
        status: "Success",
        message: "Lease agreement PDF generated successfully",
        contentType: "application/pdf",
      },
    },
    {
      route: `/preview/:requestToRentId`,
      handler: LeaseAgreementController.previewLeaseAgreement,
      method: "get",
      description: `Preview the LetBud lease agreement PDF for a specific rental request`,
      middleWares: [authenticateUser],
      parameters: [
        {
          name: ":requestToRentId",
          in: "path",
          required: true,
          description: "The ID of the request to rent application",
        },
      ],
      sampleResponseData: {
        status: "Success",
        message: "Lease agreement preview generated successfully",
        contentType: "application/pdf",
      },
    },
    {
      route: `/sign/:requestToRentId`,
      handler: LeaseAgreementController.signLeaseAgreement,
      method: "post",
      description: `Digitally sign the lease agreement and save final version to S3 with IP tracking`,
      middleWares: [authenticateUser],
      parameters: [
        {
          name: ":requestToRentId",
          in: "path",
          required: true,
          description: "The ID of the request to rent application",
        },
      ],
      sampleResponseData: {
        status: "Success",
        message: "Lease agreement signed successfully",
        data: {
          leaseAgreementUrl: "https://bucket.s3.region.amazonaws.com/path/to/lease.pdf",
          signedAt: "2025-10-31T12:00:00.000Z",
          signedFromIp: "192.168.1.1",
        },
      },
    },
  ],
});

export default LeaseAgreementRoute;
