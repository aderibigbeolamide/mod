import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../interfaces/user-role.interface.js";
import { UserRoles } from "../enums/user.roles.enum.js";
import { UserInfo } from "../interfaces/user-info.interface.js";

@Entity({ name: 'user_role' })
export class UserRoleEntity implements UserRole {

    @PrimaryColumn({ type: 'enum', enum: UserRoles })
    role: UserRoles;

    @Column({ nullable: true })
    label: string;

    @Column({ nullable: true })
    config: string;

    @Column({ type: 'json', nullable: true })
    info: UserInfo;

    @Column()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @Column()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}