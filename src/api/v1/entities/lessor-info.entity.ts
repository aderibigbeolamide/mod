import { Column, Entity, OneToMany } from "typeorm";
import { LessorInfo } from "../interfaces/lessor.info.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import { BaseEntity } from "./base.entity.js";
import { PropertyEntity } from "./property.entity.js";

@Entity({ name: "lessor_info" })
export class LessorInfoEntity extends BaseEntity implements LessorInfo {
  @Column({
    type: "enum",
    enum: LessorCategories,
    nullable: true,
  })
  lessorCategory: LessorCategories;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  agencyName: string;

  // @OneToMany(() => PropertyEntity, (property) => property.lessor)
  // properties: PropertyEntity[];
}
