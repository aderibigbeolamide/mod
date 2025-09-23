import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Payment } from "../interfaces/payment.interface.js";
import { UserEntity } from "./user.entity.js";
import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { PaymentTransactionEntity } from "./paymentTransaction.entity.js";
import { PayeeRole } from "../enums/payeeRole.enum.js";
import { PropertyEntity, PropertyUnitEntity } from "./property.entity.js";

@Entity({ name: "payments" })
export class PaymentEntity implements Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (payer) => payer.id, { nullable: false })
  payer: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  payee: UserEntity;

  @Column({ type: "enum", enum: PayeeRole, default: PayeeRole.ADMIN })
  payeeRole: PayeeRole;

  @ManyToOne(() => PropertyEntity, (property) => property.id, { nullable: true })
  property: PropertyEntity;

  @ManyToOne(() => PropertyUnitEntity, (unit) => unit.id, { nullable: true })
  unit: PropertyUnitEntity;

  @Column({ type: "uuid", nullable: true })
  propertyId: string;

  @Column({ type: "uuid", nullable: true })
  unitId: string;

  @Column({ nullable: false })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentStatuses,
    default: PaymentStatuses.INITIALIZED,
  })
  status: PaymentStatuses;

  @Column({ nullable: false })
  reference: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  accessCode: string;

  authorizationUrl: string;

  // @Column({ nullable: false })
  // callbackUrl: string;

  channel: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

}

