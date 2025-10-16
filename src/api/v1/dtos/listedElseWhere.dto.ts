import { IsOptional, IsString, IsUrl } from "class-validator";
import { CreateListedElseWhereDto as ICreateListedElseWhereDto } from "../interfaces/listedElseWhere.interface.js";

export class CreateListedElseWhereDto implements ICreateListedElseWhereDto {
  @IsString({ message: "Property link must be provided" })
  @IsUrl({}, { message: "Property link must be a valid URL" })
  propertyLink: string;

  @IsString({ message: "Property address must be provided" })
  propertyAddress: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  constructor(body: any) {
    this.propertyLink = body?.propertyLink;
    this.propertyAddress = body?.propertyAddress;
    this.description = body?.description;
  }
}
