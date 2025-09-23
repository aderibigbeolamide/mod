import { dataSource } from "../../../config/database.config.js";
// import { PropertyUnitEntity } from "../entities/unit.entity.js";

export default class PropertyUnitService {
  // static repo = dataSource.getRepository(PropertyUnitEntity);

  public static async getUnitByPropertyID(propertyId: string) {
    // return await this.repo.find({ where: { propertyId } });
  }
}
