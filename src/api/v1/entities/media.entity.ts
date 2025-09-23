import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Media } from "../interfaces/media.interface.js";
import { MediaCategories } from "../enums/media-categories.enum.js";
import { MediaRefCategories } from "../enums/media-ref-categories.enum.js";
import { MediaTypes } from "../enums/media-types.enum.js";

@Entity({ name: "media" })
export class MediaEntity implements Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  publicUrl: string;

  @Column({ nullable: true })
  refId: string;

  @Column({ type: "enum", enum: MediaRefCategories, nullable: true })
  refCategory: MediaRefCategories;

  @Column({ type: "enum", enum: MediaTypes, nullable: true })
  mediaType: MediaTypes;

  @Column({ type: "enum", enum: MediaCategories, nullable: true })
  mediaCategory: MediaCategories;

  @Column({ nullable: true })
  isPublic: boolean;

  @Column({ type: "double precision", nullable: true })
  size: number;

  @Column({ nullable: true })
  sizeMetric: string;

  @Column({ nullable: true })
  mediaExt: string;

  @Column({ nullable: true })
  mediaFileName: string;

  @Column({ nullable: true })
  uploadedBy: string;

  @Column({ nullable: true })
  isTemp: boolean;

  @Column()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
