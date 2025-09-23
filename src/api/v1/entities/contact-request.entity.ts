import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { ContactRequest } from "../interfaces/contact-request.interface.js";

@Entity({ name: "contact_request" })
export class ContactRequestEntity extends BaseEntity implements ContactRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ nullable: true })
  message: string;
}
