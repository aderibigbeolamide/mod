import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserDetails } from "../interfaces/user-details.interface.js";
import { UserInfo } from "../interfaces/user-info.interface.js";
import { RequestToRentEntity } from "./request-to-rent.entity.js";
import { TourRequestEntity } from "./tour-request.entity.js";
import { UserEntity } from "./user.entity.js";

@Entity({ name: "user_details" })
export class UserDetailsEntity implements UserDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  isVerified: boolean;

  @Column({ type: "timestamp with time zone", nullable: true })
  verificationDate: Date;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: "json", nullable: true })
  userInfo: UserInfo;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  // @OneToMany(() => RequestToRentEntity, (requestToRent) => requestToRent.userDetails, {
  //   cascade: true,
  // })
  // requestsToRent: RequestToRentEntity[];
  @OneToMany(() => RequestToRentEntity, (rentRequests) => rentRequests.userDetails)
  rentRequests: RequestToRentEntity[];

  @OneToMany(() => TourRequestEntity, (tourRequests) => tourRequests.userDetails)
  tourRequests: TourRequestEntity[];

  // @ManyToOne(() => UserEntity, { nullable: false })
  // @JoinColumn({ name: "user_id" })
  // user: UserEntity;


}
