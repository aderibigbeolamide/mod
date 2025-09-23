import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyFee } from "../interfaces/property-fee.interface.js";
import { PaymentTypes } from "../enums/payment.types.enum.js";
import { PaymentRateEntity } from "./paymentRate.entity.js";
import { PropertyEntity } from "./property.entity.js";
import { property } from "lodash-es";

@Entity({ name: "property_fee" })
export class PropertyFeeEntity implements PropertyFee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column({ nullable: true })
  // propertyId: string;

  @OneToOne(() => PropertyEntity, (property: PropertyEntity) => property.id, {cascade: true,})
  @JoinColumn({ name: "property_id" }) // Specifies the column name in the PaymentTransaction table
  property: PropertyEntity;

  @Column({ nullable: true })
  feeDescription: string;

  @Column({
    type: "enum",
    enum: PaymentTypes,
    nullable: true,
  })
  paymentType: PaymentTypes;

  @Column({ type: "int", nullable: true })
  amount: number;

  @Column({ type: "int", nullable: true })
  totalPerMonth: number;

  @Column({ type: "int", nullable: true })
  total: number;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
