import { dataSource } from "../../../config/database.config.js";
import { ReportPropertyDto } from "../dtos/report-property.dto.js";
import { ReportPropertyEntity } from "../entities/report-property.entity.js";

export default class ReportPropertyService {
  static repo = dataSource.getRepository(ReportPropertyEntity);

  public static async createNewReport(propertyId:string, dto: ReportPropertyDto) {
    const report = new ReportPropertyEntity();
    report.reportId = dto.reportId;
    report.propertyId = propertyId;
    report.userId = dto.userId;
    report.reason = dto.reason;
    return this.repo.save(report);
  }
}
