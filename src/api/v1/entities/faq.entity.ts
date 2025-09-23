import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Faq } from "../interfaces/faq.interface.js";
import { FaqTypes } from "../enums/faq.types.enum.js";

@Entity({ name: "faq" })
export class FaqEntity implements Faq {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: FaqTypes,
    default: FaqTypes.QUESTION,
    nullable: true,
  })
  type: FaqTypes;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  answer: string;

  @Column({ type: "character varying", array: true, nullable: true })
  listResponse: string[];

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  faqQuestionId: string;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
