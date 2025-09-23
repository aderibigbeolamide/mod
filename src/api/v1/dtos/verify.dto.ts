import { IsIn, IsString, Length, IsOptional, Matches } from "class-validator";

export class VerifyIdentityDto {
  @IsIn(["bvn", "nin"])
  verificationType: "bvn" | "nin";

  @Length(11)
  @IsString()
  id: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "dateOfBirth must be in YYYY-MM-DD format",
  })
  dateOfBirth: string;

  @IsOptional()
  isSubjectConsent?: boolean = true;

  constructor(
    verificationType: "bvn" | "nin",
    id: string,
    dateOfBirth: string,
    isSubjectConsent = true
  ) {
    this.verificationType = verificationType;
    this.id = id;
    this.dateOfBirth = dateOfBirth;
    this.isSubjectConsent = isSubjectConsent;
  }
}
