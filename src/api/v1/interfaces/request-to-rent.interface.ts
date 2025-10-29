export interface IRequestToRent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  identificationMode: string;
  email: string;
  phoneNumber: string;
  summary: string;
  numPeopleLiving: number;
  numCoTenantsAbove18: number;
  coTenants: ITenantInfo[];
  hasPets: boolean;
  petType: string;
  numPets: number;
  moveInDate: Date;
  currentAddress: string;
  switchReason: string;
  propertyManagerName: string;
  propertyManagerContact: string;
  pastAddress: string;
  pastMoveInDate: Date;
  pastMoveOutDate: Date;
  reasonForLeaving: string;
  pastPropertyManagerContact: string;
  currentSalaryEstimate: string;
  workplace: string;
  startDateAtCompany: Date;
  companyRefereeName: string;
  refereeEmail: string;
  refereePhoneNumber: string;
  evictedBefore: boolean;
  evictionReason: string;
  convictedBefore: boolean;
  convictionDetails: string;
  emergencyContactName: string;
  relationshipWithContact: string;
  emergencyContactEmail: string;
  emergencyContactPhoneNumber: string;
  isComplete: boolean;
  leaseAgreementUrl?: string;
  userId?: string;
  propertyId?: string;
  unitId?: string;
}

export interface ICreateRequestToRent {
  firstName: string;
  middleName: string;
  lastName: string;
  identificationMode: string;
  email: string;
  phoneNumber: string;
  summary: string;
}

export interface IHouseholdInfo {
  numPeopleLiving: number;
  numCoTenantsAbove18: number;
  coTenants: ITenantInfo[];
  hasPets: boolean;
  petType: string;
  numPets: number;
  moveInDate: Date;
}

export interface IResidenceInfo {
  currentAddress: string;
  switchReason: string;
  propertyManagerName: string;
  propertyManagerContact: string;
  pastAddress: string;
  pastMoveInDate: Date;
  pastMoveOutDate: Date;
  reasonForLeaving: string;
  pastPropertyManagerContact: string;
}

export interface IIncomeInfo {
  currentSalaryEstimate: string;
  workplace: string;
  startDateAtCompany: Date;
  companyRefereeName: string;
  refereeEmail: string;
  refereePhoneNumber: string;
}

export interface IAdditionalInfo {
  evictedBefore: boolean;
  evictionReason: string;
  convictedBefore: boolean;
  convictionDetails: string;
  emergencyContactName: string;
  relationshipWithContact: string;
  emergencyContactEmail: string;
  emergencyContactPhoneNumber: string;
}

export interface IIsComplete {
  isComplete: boolean;
}

export interface ITenantInfo {
  coTenantFirstName: string;
  coTenantLastName: string;
  coTenantEmail: string;
  coTenantIdentificationMode: string;
}
