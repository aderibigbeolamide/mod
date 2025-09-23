import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { PaymentRates } from "../interfaces/paymentRate.interface.js";
import { PropertyFeeEntity } from "./property-fee.entity.js";
  
  @Entity({ name: "paymentRates" })
  export class PaymentRateEntity implements PaymentRates {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    // The rate percentage applied on the property price, e.g., 10% would be stored as 0.1
    @Column({ type: "decimal", precision: 5, scale: 2 })
    tenantRate: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    propertyAgentRate: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    platformRate: number;
  
    @Column({ nullable: false })
    range: string;

    @OneToOne(() => PropertyFeeEntity, (propertyFee: PropertyFeeEntity) => propertyFee.id, {cascade: true,})
    @JoinColumn({ name: "propertyFee_id" }) // Specifies the column name in the PaymentTransaction table
    property: PropertyFeeEntity;
  
    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt: Date;
  
    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedAt: Date;
  }
  