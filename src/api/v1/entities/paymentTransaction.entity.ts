import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { PaymentTransaction } from "../interfaces/paymentTransaction.interface.js";
import { RequestToRentEntity } from "./request-to-rent.entity.js";
import { PaymentTransactionStatus } from "../enums/paymentTransaction.status.enum.js";
import { PaymentEntity } from "./payment.entity.js";

@Entity({ name: "transactions" })
export class PaymentTransactionEntity implements PaymentTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => RequestToRentEntity, (requestToRent) => requestToRent.id, { nullable: false })
  @JoinColumn({ name: "request_to_rent_id" }) // Specify the foreign key column name
  requestToRent: RequestToRentEntity;

  @Column({ nullable: false })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.TRANSFER,
    nullable: true,
  })
  status: PaymentTransactionStatus;

  @Column({ nullable: false })
  reference: string;

  invoiceURL: string;

  @OneToOne(() => PaymentEntity, (payment: PaymentEntity) => payment.id, {cascade: true,})
  @JoinColumn({ name: "payment_id" }) // Specifies the column name in the PaymentTransaction table
  payment: PaymentEntity;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
