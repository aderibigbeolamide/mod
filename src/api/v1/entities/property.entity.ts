import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  PropertyAvailability,
  PropertyCautionFee,
  PropertyFAQItem,
  PropertyLeasePolicy,
  PropertyTourAvailability,
  PropertyUtility,
  Property,
} from "../interfaces/property.interface.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { TransactionTypes } from "../enums/transaction.types.enums.js";
import { BaseEntity } from "./base.entity.js";
import { EPropertyType } from "../enums/property.enums.js";
import { PropertyUnit, PropertyUnitAnalytics } from "../interfaces/unit.interface.js";
import { Coordinates } from "../interfaces/base.interface.js";
import { PropertyMedia } from "../interfaces/property-media.interface.js";
import { LessorInfoEntity } from "./lessor-info.entity.js";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { PaymentEntity } from "./payment.entity.js";
import { RequestToRentEntity } from "./request-to-rent.entity.js";
import { TourRequestEntity } from "./tour-request.entity.js";
import { UserEntity } from "./user.entity.js";


@Entity("property")
export class PropertyEntity extends BaseEntity implements Property {
  static createQueryBuilder(arg0: string) {
    throw new Error("Method not implemented.");
  }
  @Column({ nullable: true })
  address: string;
  @Column({ type: "text", nullable: true })
  lga: string;
  @Column({ type: "text", nullable: true })
  floorNumber: string;
  @Column({ type: "text", nullable: true })
  area: string;

  @Column({ nullable: true, select: false })
  addressID?: string;

  @Column({ nullable: true, type: "json" })
  advertisedUnit: PropertyUnitAnalytics;

  @Column({ type: "varchar", array: true, nullable: true })
  amenities: string[];

  @Column({ nullable: true, type: "json" })
  availability: PropertyAvailability;

  @Column({ nullable: true, type: "json" })
  cautionFee: PropertyCautionFee;

  @Column({ type: "point", nullable: true })
  coordinates: Coordinates | string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, type: "json" })
  faq: PropertyFAQItem[];

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, type: "boolean" })
  closeToNoise: boolean;

  @Column({ nullable: true })
  isAddressVerified: boolean;

  // @Column({ nullable: true }) rentFrequency?: string;

  @Column({ nullable: true, type: "boolean", default: false })
  isArchived: boolean;

  @Column({ default: false, type: "boolean" })
  isComplete: boolean;

  @Column({ default: false, type: "boolean" })
  isDisabled: boolean;

  @Column({ nullable: true, default: true })
  isVerified: boolean;

  @Column({ nullable: true, type: "boolean" })
  landlordResides: boolean;

  @Column({
    type: "enum",
    enum: LeaseTerms,
    nullable: true,
  })
  leaseTerm: LeaseTerms;

  @Column({ type: "uuid", nullable: true })
  lessorDocumentId: string;

  @Column({ type: "uuid", nullable: true })
  lessorInfoId: string;

  // @Column({ type: 'uuid', nullable: true })
  // lessorId: string;

  @Column({
    type: "json",
    nullable: true,
  })
  leasePolicy: PropertyLeasePolicy;

  @Column({ type: "uuid", nullable: true })
  lessorUserId: string;

  // @Column({ nullable: true })
  // propertyMediaId: string;

  // @Column({ nullable: true })
  // propertyTourAvailabilityId: string;

  @Column({ type: "boolean", nullable: true })
  religiousBuilding: boolean;

  @Column({ type: "int2", nullable: true })
  sponsorshipLevel: number;

  @Column({ nullable: true })
  state: string;

  @OneToMany(() => PropertyUnitEntity, (item) => item.property)
  units: PropertyUnitEntity[];

  @OneToMany(() => RequestToRentEntity, (request) => request.property)
  rentRequests: RequestToRentEntity[];


  @Column({
    type: "enum",
    enum: AvailabilityStatuses,
    default: AvailabilityStatuses.AVAILABLE,
    nullable: true,
  })
  status: AvailabilityStatuses;

  @Column({ type: "character varying", array: true, nullable: true })
  tags: string[];

  @Column({ nullable: true, type: "json" })
  tourAvailability: PropertyTourAvailability;

  @Column({ nullable: true, type: "text" })
  tourLink: string;

  @Column({
    type: "enum",
    enum: TransactionTypes,
    nullable: true,
  })
  transactionType: TransactionTypes;

  @Column({ nullable: true, type: "enum", enum: EPropertyType })
  type: EPropertyType;


  // @ManyToOne(() => LessorInfoEntity, (lessor) => lessor.properties, { nullable: false, onDelete: "SET NULL" })
  // lessor: LessorInfoEntity;
  @ManyToOne(() => LessorInfoEntity, (lessor) => lessor.id, { nullable: true })
  lessor: LessorInfoEntity;

  @Column({
    type: "json",
    nullable: true,
  })
  utilities: PropertyUtility;

  @OneToOne("property_media", "property")
  @JoinColumn()
  propertyMedia?: PropertyMedia;
}


@Entity({ name: "unit" })
export class PropertyUnitEntity extends BaseEntity implements PropertyUnit {
  static createQueryBuilder(arg0: string) {
    throw new Error("Method not implemented.");
  }
  @Column({ nullable: true, type: "numeric" }) agencyFeePercentage: number;

  @Column({ nullable: true, type: "numeric" }) fixedAgencyFee: number;

  @Column({ nullable: true, default: false }) hasAgencyFee: boolean;

  @Column({ nullable: true }) label: string;

  @Column({ nullable: true, type: "numeric" }) noOfBathrooms: number;

  @Column({ nullable: true, type: "numeric" }) noOfBathroomsEnsuite: number;

  @Column({ nullable: true, type: "numeric" }) noOfBedrooms: number;

  @Column({ nullable: true, enum: PaymentTypes }) paymentSchedule: PaymentTypes;

  @Column({ nullable: true, type: "numeric" }) price: number;

  @ManyToOne(() => PropertyEntity, (item) => item.units) property?: PropertyEntity;

  @Column({ nullable: true, type: "numeric" }) squareFeet: number;

  @Column({ type: "boolean", default: false }) applicationApproved: boolean;

  @Column({ type: "boolean", default: false }) isUnitOccupied: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ nullable: true })
  lockedBy: string; // payerId

  @Column({ type: 'timestamptz', nullable: true })
  lockExpiresAt: Date;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  paidUntil: Date | null;

  @Column({
    type: "enum",
    enum: AvailabilityStatuses,
    nullable: true,
    default: AvailabilityStatuses.AVAILABLE,
  })
  status: AvailabilityStatuses;

  @Column({ type: "timestamp with time zone", nullable: true }) dateAvailable: string;

  // @OneToMany(() => PaymentEntity, (payment) => payment.unit, { cascade: true, lazy: true })
  // payments: PaymentEntity[];

  @OneToMany(() => RequestToRentEntity, (request) => request.unit)
  rentRequests: RequestToRentEntity[];

  @OneToMany(() => TourRequestEntity, (tourRequest) => tourRequest.unit, { cascade: true, lazy: true })
  tourRequest: TourRequestEntity[];
}

@Entity({ name: "property_media" })
export class PropertyMediaEntity extends BaseEntity implements PropertyMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "character varying",
    array: true,
    nullable: true,
    default: [],
  })
  imageUrls: string[];

  @Column({
    type: "character varying",
    nullable: true,
  })
  leaseDocumentUrl: string;

    @Column({
    nullable: true,
    default: false,
  })
  useLetBudTemplate: boolean;


  @Column({
    type: "character varying",
    array: true,
    nullable: true,
    default: [],
  })
  videoUrls: string[];

  @Column({ type: 'timestamptz', nullable: true })
  paymentExpiresAt: Date;


  @Column({
    type: "character varying",
    array: true,
    nullable: true,
    default: [],
  })
  mediaIds: string[];

  @Column({ nullable: true })
  leaseDocumentName: string;

  // @OneToOne(() => PropertyEntity, (item) => item.propertyMedia)
  // property?: PropertyEntity;

  @OneToOne(() => PropertyEntity, (property) => property.propertyMedia)
  property: PropertyEntity;
}
