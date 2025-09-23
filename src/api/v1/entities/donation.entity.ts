import { Demo } from "../interfaces/demo.interface.js";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Donation } from "../interfaces/donation.interface.js";

@Entity({ name: "donation" })
export class DonationEntity implements Donation {
  static findOrCreate(arg0: { where: { paymentReference: any; }; defaults: { amount: any; email: any; name: any; paymentReference: any; }; }): [any] | PromiseLike<[any]> {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ type: "timestamp with time zone" })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp with time zone" })
  @UpdateDateColumn()
  updatedAt: Date;
}