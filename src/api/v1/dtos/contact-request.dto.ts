import Utility from "../../../utils/utility.js";
import { ContactRequest, ContactRequestByDateRange } from "../interfaces/contact-request.interface.js";


export class NewContactRequestDto implements ContactRequest {
    id: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    topic: string;
    message: string;
  
  constructor(obj?: NewContactRequestDto) {
    Utility.pickFieldsFromObject<NewContactRequestDto>(obj, this, {
      id: null,
      fullname: null,
      email: null,
      phoneNumber: null,
      topic: null,
      message: null,
    });
  }
}
export class ContactRequestByDateRangeDto implements ContactRequestByDateRange {
    startDate: string;
    endDate: string;

    constructor(obj?: ContactRequestByDateRangeDto) {
        Utility.pickFieldsFromObject<ContactRequestByDateRangeDto>(obj, this, {
          startDate: null,
          endDate: null,
        });
      }
}



