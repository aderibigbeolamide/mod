import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity.js";

@Entity('accounts')
export class AccountDetailsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (payee) => payee.id, { nullable: false })
    payee: UserEntity;

    @Column()
    accountNumber: string;

    @Column()
    accountName: string;

    @Column({ nullable: true }) // Make bankCode nullable
    bankCode: string;

    @Column({ nullable: true }) // Make bankName nullable
    bankName: string;

    @Column({ nullable: true }) // Make bankCode nullable
    bankId: string;
}
