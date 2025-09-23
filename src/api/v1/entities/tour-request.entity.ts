import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { ITourRequest } from "../interfaces/tour-request.interface.js";
import { PropertyUnitEntity } from "./property.entity.js";
import { UserDetailsEntity } from "./user-details.entity.js";

@Entity({ name: "tour_request" })
export class TourRequestEntity extends BaseEntity implements ITourRequest {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column({ type: "date", nullable: true }) meetDate: Date;

  @Column({ nullable: true, default: false }) email: string;

  @Column({ nullable: true, default: false }) phone: string;

  @Column({ nullable: true, default: false }) preferVirtualTour: boolean;

  @Column({ type: "uuid", nullable: true })
  propertyId: string;

  @Column({ type: "uuid", nullable: true })
  unitId: string;

  @ManyToOne(() => PropertyUnitEntity, (item) => item.rentRequests) property?: PropertyUnitEntity[];

  @ManyToOne(() => PropertyUnitEntity, (unit) => unit.tourRequest, { nullable: true })
  unit: PropertyUnitEntity[];

  @ManyToOne(() => UserDetailsEntity, (userDetails) => userDetails.rentRequests) userDetails?: UserDetailsEntity[];

}
