import { IsEmail, IsEnum, IsOptional, IsPhoneNumber } from "class-validator";
import Utility from "../../../utils/utility.js";
import { LessorInfo } from "../interfaces/lessor.info.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import { SearchQueryDto } from "./search.dto.js";

export class LessorCreateDto implements Partial<LessorInfo> {
  @IsOptional()
  id: string;

  @IsEnum(LessorCategories)
  lessorCategory: LessorCategories;

  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  agencyName: string;

  constructor(obj?: Partial<LessorInfo>) {
    Utility.pickFieldsFromObject<LessorCreateDto>(obj, this, {
      agencyName: null,
      email: null,
      firstName: null,
      id: null,
      lastName: null,
      lessorCategory: null,
      phoneNumber: null,
    });
  }
}

export class LessorSearchQueryDto
  extends SearchQueryDto<LessorSearchQueryDto, LessorInfo>
  implements Partial<LessorInfo> {
  @IsEnum(LessorCategories)
  lessorCategory: LessorCategories;

  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;

  agencyName: string;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

  constructor(obj?: Partial<LessorSearchQueryDto>) {
    super(obj);
    Object.assign(this, obj || {});
  }
}
