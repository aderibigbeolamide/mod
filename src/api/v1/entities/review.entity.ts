import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Review } from "../interfaces/review.interface.js";
import { ReviewTypes } from "../enums/review.types.enum.js";

@Entity({ name: "review" })
export class ReviewEntity implements Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({
    type: "enum",
    enum: ReviewTypes,
    nullable: true,
  })
  type: ReviewTypes;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: "int2", nullable: true })
  rating: number;

  @Column({ nullable: true })
  landlordId: string;

  @Column({ nullable: true })
  question: string;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
