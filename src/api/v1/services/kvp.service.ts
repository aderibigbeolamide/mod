import { dataSource } from "../../../config/database.config.js";
import SearchService from "./search.service.js";
import Utility from "../../../utils/utility.js";
import { KVPEntity, KVPEntityTableName } from "../entities/kvp.entity.js";
import { KVPSearchQueryDto, KVPUpdateDto } from "../dtos/kvp.dto.js";
import { KVPCategory } from "../interfaces/kvp.interface.js";

export default class KVPService {
  static repo = dataSource.getRepository(KVPEntity);

  static async getKeys() {
    return (await this.repo.find({ select: { key: true } })).map((x) => x.key);
  }

  static fieldsToUppercase = <T>(obj: T) => {
    const nOBj: T = {} as any;
    for (const key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key))
        nOBj[key] = obj[key]?.toString()?.toUpperCase() as any;

    return nOBj as T;
  };

  public static async update(key: KVPCategory, dto: KVPUpdateDto<any>) {
    if (!(await this.verifyKey(key)))
      Utility.throwException({
        statusNo: 400,
        message: `Code key ${key} does not exist`,
      });
    await this.repo.update({ key }, dto);
    return await this.getByKey(key);
  }

  public static async delete(id: string) {
    // if (!(await this.verifyKey(id)))
    //   Utility.throwException({
    //     statusNo: 400,
    //     message: `Code ID ${id} does not exist`,
    //   });
    // return this.repo.delete({ id });
  }

  public static async create(dto: KVPUpdateDto<any>) {
    if (await this.verifyKey(dto.key))
      Utility.throwException({
        statusNo: 400,
        message: `Code already exists`,
        errorObject: dto,
      });
    const prop = Object.assign(new KVPEntity(), dto);
    return this.repo.save(prop);
  }

  public static async getCategories() {
    return this.repo
      .createQueryBuilder("code")
      .select("code.category", "category")
      .distinct(true)
      .getRawMany<string>();
  }

  static verifyKey = async (key: KVPCategory) => {
    const res = await this.repo.find({ select: { key: true }, where: { key } });
    return !!res[0];
  };

  static getByKey = async (key: KVPCategory) => {
    return (await this.repo.findOneBy({ key })).value;
  };

  public static async search(query: KVPSearchQueryDto) {
    // debugger;
    return await SearchService.search(
      {
        entity: KVPEntity,
        tableName: KVPEntityTableName,
      },
      [
        {
          field: "key",
        },
      ],
      {
        ...query,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    );
  }
}
