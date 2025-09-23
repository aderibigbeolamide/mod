import { Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { WaitList } from "../interfaces/waitlist.interface.js";

@Entity({ name: "waitlist" })
export class WaitListEntity extends BaseEntity implements WaitList {
  @PrimaryColumn({ nullable: false })
  email: string;
}
