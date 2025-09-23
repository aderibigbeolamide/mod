import { ReportProperty } from "../interfaces/report-property.interface.js";
import Utility from "../../../utils/utility.js";


export class ReportPropertyDto implements ReportProperty {
  reportId: string;
  userId: string;
  reason: string;
  
  constructor(obj?: ReportPropertyDto) {
    Utility.pickFieldsFromObject<ReportPropertyDto>(obj, this, {
      reportId: null,
      userId: null,
      reason: null,
    });
  }
}



