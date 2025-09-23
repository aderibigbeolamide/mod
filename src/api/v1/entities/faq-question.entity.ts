import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FaqQuestion } from "../interfaces/faq-question.interface.js";

@Entity({ name: "faq_question" })
export class FaqQuestionEntity implements FaqQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  question: string;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
