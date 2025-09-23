import Utility from "../../../utils/utility.js";
import { ICreateTourRequest } from "../interfaces/tour-request.interface.js";

export class CreateTourRequestDto implements ICreateTourRequest {
  meetDate: Date;
  email: string;
  phone: string;
  preferVirtualTour: boolean;

  constructor(obj?: CreateTourRequestDto) {
    Utility.pickFieldsFromObject<CreateTourRequestDto>(obj, this, {
      meetDate: null,
      email: null,
      phone: null,
      preferVirtualTour: null,
    });
  }
}
