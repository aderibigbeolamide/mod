import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Wishlist } from "../interfaces/wishlist.interface.js";

@Entity({ name: "wishlist" })
export class WishlistEntity implements Wishlist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  propertyId: string;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
