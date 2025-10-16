import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { UserEntity } from "./user.entity.js";
import { ListedElseWhere } from "../interfaces/listedElseWhere.interface.js";

@Entity({ name: "listed_elsewhere" })
export class ListedElseWhereEntity extends BaseEntity implements ListedElseWhere {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // The user who submitted the form
    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: UserEntity;


    @Column({ name: "property_link", type: "text", nullable: false })
    propertyLink: string;

    @Column({ name: "property_address", type: "text", nullable: false })
    propertyAddress: string;

    @Column({ name: "description", type: "text", nullable: true })
    description?: string;
}
