import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { IRequestToRent, ITenantInfo } from "../interfaces/request-to-rent.interface.js";
import { PropertyEntity, PropertyMediaEntity, PropertyUnitEntity } from './property.entity.js';
import { UserDetailsEntity } from "./user-details.entity.js";
import { UserEntity } from "./user.entity.js";


@Entity({ name: "request_to_rent" })
export class RequestToRentEntity extends BaseEntity implements IRequestToRent {
  @PrimaryGeneratedColumn("uuid") id: string;

  // Personal Info
  @Column({ nullable: true }) firstName: string;

  @Column({ nullable: true }) middleName: string;

  @Column({ nullable: true }) lastName: string;

  @Column({ nullable: true }) identificationMode: string;

  @Column({ nullable: true }) email: string; // remove unique constraint

  @Column({ nullable: true }) phoneNumber: string;

  @Column({ type: "text", nullable: true }) summary: string;

  // Household Info
  @Column({ type: "integer", nullable: true }) numPeopleLiving: number;

  @Column({ type: "integer", nullable: true }) numCoTenantsAbove18: number;

  // @Column({ nullable: true }) coTenantFirstName: string;

  // @Column({ nullable: true }) coTenantLastName: string;

  // @Column({ nullable: true }) coTenantEmail: string;

  // @Column({ nullable: true }) coTenantIdentificationMode: string;

  @Column({ type: "jsonb", nullable: true }) coTenants: ITenantInfo[];

  @Column({ type: "boolean", nullable: true }) hasPets: boolean;

  @Column({ nullable: true }) petType: string;

  @Column({ type: "integer", nullable: true }) numPets: number;

  @Column({ type: "date", nullable: true }) moveInDate: Date;

  // Residence Info
  @Column({ type: "text", nullable: true }) currentAddress: string;

  @Column({ type: "text", nullable: true }) switchReason: string;

  @Column({ nullable: true }) propertyManagerName: string;

  @Column({ nullable: true }) propertyManagerContact: string;

  @Column({ type: "text", nullable: true }) pastAddress: string;

  @Column({ type: "date", nullable: true }) pastMoveInDate: Date;

  @Column({ type: "date", nullable: true }) pastMoveOutDate: Date;

  @Column({ type: "text", nullable: true }) reasonForLeaving: string;

  @Column({ nullable: true }) pastPropertyManagerContact: string;

  // Income Info
  @Column({ type: "text", nullable: true }) currentSalaryEstimate: string;

  @Column({ nullable: true }) workplace: string;

  @Column({ type: "date", nullable: true }) startDateAtCompany: Date;

  @Column({ nullable: true }) companyRefereeName: string;

  @Column({ nullable: true }) refereeEmail: string;

  @Column({ nullable: true }) refereePhoneNumber: string;

  // Additional RequestToRentEntity
  @Column({ type: "boolean", nullable: true }) evictedBefore: boolean;

  @Column({ type: "text", nullable: true }) evictionReason: string;

  @Column({ type: "boolean", nullable: true }) convictedBefore: boolean;

  @Column({ type: "text", nullable: true }) convictionDetails: string;

  @Column({ type: "text", nullable: true }) emergencyContactName: string;

  @Column({ type: "text", nullable: true }) relationshipWithContact: string;

  @Column({ type: "text", nullable: true }) emergencyContactEmail: string;

  @Column({ type: "text", nullable: true }) emergencyContactPhoneNumber: string;

  // Request Status Info
  @Column({ type: "boolean", nullable: true }) isComplete: boolean;

  @Column({ type: "boolean", nullable: true, default: false }) isApprove: boolean;

  @Column({ type: "boolean", default: false }) leaseAgreementSigned: boolean;

  @Column({ type: 'timestamp', nullable: true }) leaseAgreementSignedAt: Date;

  @Column({ type: 'character varying', nullable: true })
  leaseAgreementUrl?: string;


  @Column({ type: "boolean", nullable: true, default: false }) applicationWithdrawn: boolean;

  @Column({ type: "timestamp", nullable: true }) withdrawnAt: Date;

  // Platform User Information
  @Column({ nullable: true }) userId: string;

  @Column({ type: "uuid", nullable: true })
  propertyId: string;

  @Column({ type: "uuid", nullable: true })
  unitId: string;

  @ManyToOne(() => PropertyEntity, (item) => item.rentRequests) property?: PropertyEntity;


  @ManyToOne(() => PropertyUnitEntity, (item) => item.rentRequests) unit?: PropertyEntity[];

  //   @ManyToOne(() => PropertyEntity, (item) => item.rentRequests)
  // @JoinColumn({ name: "property_id" }) // Ensures the foreign key is properly mapped
  // property?: PropertyEntity;

  // @ManyToOne(() => PropertyUnitEntity, (item) => item.rentRequests)
  // @JoinColumn({ name: "unit_id" }) // Ensures the foreign key is properly mapped
  // unit?: PropertyUnitEntity;

  // @ManyToOne(() => UserDetailsEntity, (userDetails) => userDetails.rentRequests)
  // @JoinColumn({ name: "user_id" }) // Ensures the foreign key is properly mapped
  // userDetails?: UserDetailsEntity;

  @ManyToOne(() => UserEntity, (user) => user.rentRequests) user?: UserEntity[];

  @ManyToOne(() => UserDetailsEntity, (userDetails) => userDetails.rentRequests) userDetails?: UserDetailsEntity[];
  // @ManyToOne(() => PropertyMediaEntity) media?: PropertyMediaEntity;

}
