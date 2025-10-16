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

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: "phone_number", nullable: false })
  phoneNumber: string;

  @Column({ name: "preferred_call_time", nullable: true })
  preferredCallTime: string;

  @Column({ name: "preferred_call_day", nullable: true })
  preferredCallDay: string;

  @Column({ name: "is_email_overridden", type: "boolean", default: false })
  isEmailOverridden: boolean;

  @Column({ name: "is_phone_overridden", type: "boolean", default: false })
  isPhoneOverridden: boolean;

  @Column({ name: "override_reason", nullable: true })
  overrideReason: string;

  @Column({ name: "processed_at", type: "timestamp with time zone", nullable: true })
  processedAt: Date;

  @Column({ name: "processed_in_batch", nullable: true })
  processedInBatch: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}