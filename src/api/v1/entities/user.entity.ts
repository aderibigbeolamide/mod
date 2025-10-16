import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { forwardRef } from "@nestjs/common";
import { User } from "../interfaces/user.interface.js";
import { UserRoles } from "../enums/user.roles.enum.js";
import { RequestToRentEntity } from "./request-to-rent.entity.js";
import { UserDetailsEntity } from "./user-details.entity.js";
import { ListedElseWhereEntity } from "./listedElseWhere.entity.js";

@Entity({ name: "user" })
export class UserEntity implements User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Exclude()
  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  detailsId: string;

  @Column({ type: "enum", enum: UserRoles, nullable: true })
  role: UserRoles;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: true })
  signInType: string;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @OneToMany(() => RequestToRentEntity, (rentRequests) => rentRequests.userDetails)
  rentRequests: RequestToRentEntity[];

  @OneToOne(() => UserDetailsEntity,  { eager: true })
  @JoinColumn()
  userDetails: UserDetailsEntity;


  // @OneToMany(() => ListedElseWhereEntity, (listing) => listing.user)
  // listedElseWhere: ListedElseWhereEntity[];
}
