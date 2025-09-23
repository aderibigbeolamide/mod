import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Transform } from "class-transformer";
import { SortDirection, SearchQuery } from "../interfaces/search.interface.js";

export class SearchQueryDto<TQuery extends SearchQuery<TResultRow>, TResultRow = any>
  implements Partial<SearchQuery<TResultRow>>
{
  @IsOptional()
  @IsNumber({}, { message: "pageNumber must be a valid number" })
  @Transform(({ value }) => (isNaN(Number(value)) ? value : Number(value)), { toClassOnly: true })
  pageNumber?: number;

  @IsOptional()
  @IsNumber({}, { message: "pageSize must be a valid number" })
  @Transform(({ value }) => (isNaN(Number(value)) ? value : Number(value)), { toClassOnly: true })
  pageSize?: number;

  @IsOptional()
  @IsString()
  sortField?: keyof TResultRow;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalPages?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  hasNextPage?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  hasPreviousPage?: boolean;

  constructor(obj?: Partial<TQuery>) {
    this.pageNumber = obj?.pageNumber ? Number(obj.pageNumber) : undefined;
    this.pageSize = obj?.pageSize ? Number(obj.pageSize) : undefined;
    this.sortField = obj?.sortField;
    this.sortDirection = obj?.sortDirection;
    this.createdFrom = obj?.createdFrom;
    this.createdTo = obj?.createdTo;
    this.createdBy = obj?.createdBy;
    this.totalPages = obj?.totalPages;
    this.hasNextPage = obj?.hasNextPage;
    this.hasPreviousPage = obj?.hasPreviousPage;
    Object.assign(this, obj || {});
  }
}
