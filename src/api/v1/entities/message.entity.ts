import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Messages } from "../interfaces/messages.interface.js";
import { MessageStatuses } from "../enums/message.statuses.enum.js";

@Entity({ name: "messages" })
export class MessagesEntity implements Messages {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  senderId: string;

  @Column({ nullable: true })
  recipientid: string;

  @Column({ nullable: true })
  message: string;

  @Column({
    type: "enum",
    enum: MessageStatuses,
    default: MessageStatuses.SENT,
    nullable: true,
  })
  status: MessageStatuses;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
