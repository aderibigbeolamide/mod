import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ServiceFeeConfig } from "../interfaces/service-fee-config.interface.js";
import { TransactionTypes } from "../enums/transaction.types.enums.js";

@Entity({ name: "service_fee_config" })
export class ServiceFeeConfigEntity implements ServiceFeeConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: TransactionTypes, nullable: true })
  transactionType: TransactionTypes;

  @Column({ type: "int", nullable: true })
  minPrice: number;

  @Column({ type: "int", nullable: true })
  maxPrice: number;

  @Column({ type: "int", nullable: true })
  percentage: number;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
