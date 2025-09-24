import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { RequestCall } from "../interfaces/request-call.interface.js";
import { UserEntity } from "./user.entity.js";

@Entity({ name: "request_call" })
export class RequestCallEntity extends BaseEntity implements RequestCall {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: true })
  preferredCallTime: string;

  @Column({ type: "boolean", default: false })
  isEmailOverridden: boolean;

  @Column({ type: "boolean", default: false })
  isPhoneOverridden: boolean;

  @Column({ nullable: true })
  overrideReason: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  processedInBatch: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}