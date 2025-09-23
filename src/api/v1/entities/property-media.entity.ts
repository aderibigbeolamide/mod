// Moved into property entity
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { PropertyMedia } from "../interfaces/property-media.interface.js";
// import { PropertyEntity } from "./property.entity.js";

// @Entity({ name: "property_media" })
// export class PropertyMediaEntity implements PropertyMedia {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column({
//     type: "character varying",
//     array: true,
//     nullable: true,
//     default: [],
//   })
//   imageUrls: string[];

//   @Column({
//     type: "character varying",
//     array: true,
//     nullable: true,
//     default: [],
//   })
//   videoUrls: string[];

//   @Column({
//     type: "character varying",
//     array: true,
//     nullable: true,
//     default: [],
//   })
//   mediaIds: string[];

//   @Column({ nullable: true })
//   leaseDocumentName: string;

//   @Column()
//   @CreateDateColumn({ type: "timestamp with time zone" })
//   createdAt: Date;

//   @Column()
//   @UpdateDateColumn({ type: "timestamp with time zone" })
//   updatedAt: Date;

//   @OneToOne(() => PropertyEntity, (item) => item.propertyMedia)
//   property?: PropertyEntity;
// }
