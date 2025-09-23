import { Demo } from "../interfaces/demo.interface.js";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "demo" })
export class DemoEntity implements Demo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: "timestamp with time zone" })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp with time zone" })
  @UpdateDateColumn()
  updatedAt: Date;
}
