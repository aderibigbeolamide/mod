import Utility from "../../../utils/utility.js";
import ContactRequestController from "../controllers/contact-request.controller.js";


const ContactRequestRoute = Utility.swaggerRouteToAppRoute({
  path: "contact-request",
  controller: ContactRequestController,
  routes: [
    {
      route: `/`,
      handlerName: "contactRequest",
      method: "get",
      description: `Return all contact request filtered by a date range`,
    },
    {
      route: `/create-contact-request`,
      handlerName: "createContactRequest",
      method: "post",
      description: `Use this to create a new contact request record`,
    },
    {
      route: `/download`,
      handlerName: "download",
      method: "get",
      description: `Downlaod all WaitList in CSV format filtered by a date range`,
    },
  ],
});

export default ContactRequestRoute;
