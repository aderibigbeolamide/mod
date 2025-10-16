import { IsEmail, IsOptional, IsString, IsBoolean } from "class-validator";
import { RequestCallCreateDto } from "../interfaces/request-call.interface.js";

export class CreateRequestCallDto implements RequestCallCreateDto {
  @IsOptional()
  @IsEmail({}, { message: "Email must be a valid email address" })
  email?: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string" })
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: "Preferred call time must be a string" })
  preferredCallTime?: string;

  @IsOptional()
  @IsString({ message: "Preferred call day must be a string" })
  preferredCallDay?: string;

  @IsOptional()
  @IsBoolean({ message: "useUserData must be a boolean" })
  useUserData?: boolean;

  @IsOptional()
  @IsString({ message: "Override reason must be a string" })
  overrideReason?: string;

  constructor(body: any) {
    this.email = body?.email;
    this.phoneNumber = body?.phoneNumber;
    this.preferredCallTime = body?.preferredCallTime;
    this.useUserData = body?.useUserData;
    this.overrideReason = body?.overrideReason;
  }
}