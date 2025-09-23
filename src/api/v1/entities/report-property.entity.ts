import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { ReportProperty } from "../interfaces/report-property.interface.js";

@Entity({ name: "report_property" })
export class ReportPropertyEntity extends BaseEntity implements ReportProperty {
  @PrimaryGeneratedColumn("uuid") reportId: string;

  @Column({ nullable: false }) propertyId: string;

  @Column({ nullable: false }) userId: string;

  @Column({ nullable: false }) reason: string;
}
