import { BaseInterface } from "../interfaces/base.interface.js";
import { Demo } from "../interfaces/demo.interface.js";
import {
  Column,
  CreateDateColumn, 
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity implements BaseInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "json" })
  meta: {};

  @Column({ type: "timestamp with time zone" })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp with time zone" })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: "uuid" })
  createdBy: string;
}
