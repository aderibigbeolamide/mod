import { IsBoolean, IsString } from "class-validator";

export default class UploadMediaDto {
  @IsString()
  public refId: string;

  @IsString()
  public refCategory: string;

  @IsString()
  public mediaType: string;

  @IsString()
  public mediaCategory: string;

  @IsBoolean()
  public isPublic: boolean;

  public createdBy?: string;

  public files?: any[];

  constructor(obj?: any) {
    if (obj) {
      ["refId", "refCategory", "mediaType", "mediaCategory", "isPublic"].forEach((prop) => {
        this[prop] = obj[prop];
      });
    }
  }
}
