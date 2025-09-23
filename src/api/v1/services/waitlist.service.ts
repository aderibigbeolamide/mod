import { dataSource } from "../../../config/database.config.js";
import { WaitList } from "../interfaces/waitlist.interface.js";
import { WaitListEntity } from "../entities/waitlist.entity.js";

export default class WaitListService {
  static repo = dataSource.getRepository(WaitListEntity);

  public static async joinWaitList(email) {
    this.repo.create({ email });
  }

  public static async create(email) {
    const waitlist = new WaitListEntity();
    waitlist.email = email;
    return this.repo.save(waitlist);
  }

  public static async getByEmail(email) {
    return await this.repo.findOne({
      where: {
        email: email,
      },
    });
  }

  public static async getWaitListByDateRange(startDate, endDate) {
    return await this.repo
      .createQueryBuilder("waitlist")
      .where("waitlist.created_at BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("waitlist.created_at", "DESC")
      .getMany();
  }

  public static async getWaitListDefault() {
    return await this.repo.find({
      order: {
        createdAt: "DESC",
      },
    });
  }
}
