import { dataSource } from "../../../config/database.config.js";
import { ContactRequestEntity } from "../entities/contact-request.entity.js";

export default class ContatcRequestService {
  static repo = dataSource.getRepository(ContactRequestEntity);

  public static async NewContactRequest(fullname, email, phoneNumber, topic, message) {
    const newRequest = new ContactRequestEntity();
    newRequest.fullname = fullname;
    newRequest.email = email;
    newRequest.phoneNumber = phoneNumber;
    newRequest.topic = topic;
    newRequest.message = message;
    return await this.repo.save(newRequest);
  }

  public static async getByEmail(email) {
    return this.repo.findOne(email);
  }

  public static async getContactRequestByDateRange(startDate, endDate) {
    return await this.repo
      .createQueryBuilder("contact_request")
      .where("contact_request.created_at BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("contact_request.created_at", "DESC")
      .getMany();
  }

  public static async getContactRequestDefault() {
    return await this.repo.find({
      order: {
        createdAt: "DESC",
      },
    });
  }
}
