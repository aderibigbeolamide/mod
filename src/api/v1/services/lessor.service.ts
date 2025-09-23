import { dataSource } from "../../../config/database.config.js";
import { LessorInfoEntity } from "../entities/lessor-info.entity.js";
import { LessorCreateDto, LessorSearchQueryDto } from "../dtos/lessor.dto.js";
import { PropertySearchQueryDto } from "../dtos/property.dto.js";
import SearchService from "./search.service.js";
import Utility from "../../../utils/utility.js";
import { SearchCondition } from "../enums/search.enum.js";

export default class LessorService {
  static repo = dataSource.getRepository(LessorInfoEntity);

  public static async create(dto: LessorCreateDto, userID: string) {
    const item = new LessorInfoEntity();
    if (dto?.id) delete dto?.id;
    item.createdBy = userID;
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  public static async update(dto: LessorCreateDto) {
    if (!dto.id) throw `An ID is required to update Lessor info`;
    return this.repo.update({ id: dto.id }, dto);
  }

  static verifyID = (id: string) => Utility.verifyID(this.repo, id);

  public static async save(dto: LessorCreateDto, userID: string) {
    return dto.id ? this.update(dto) : this.create(dto, userID);
  }

  public static async getByID(id: string) {
    return this.repo.findOneBy({ id: id });
  }

  // getAllLessors
  public static async getAllLessors() {
    return this.repo.find();
  }

  public static async search(query: Partial<LessorSearchQueryDto>) {
    return await SearchService.search(
      {
        entity: LessorInfoEntity,
        tableName: "lessor_info",
      },
      [
        {
          field: "lessorCategory",
          condition: SearchCondition.contains,
        },
        { field: "firstName", condition: SearchCondition.contains },
        { field: "lastName", condition: SearchCondition.contains },
        { field: "email", condition: SearchCondition.contains },
        { field: "phoneNumber", condition: SearchCondition.contains },
        { field: "agencyName", condition: SearchCondition.contains },
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
