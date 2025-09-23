import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Otp } from "../interfaces/otp.interface.js";
import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";

@Entity({ name: "otp" })
export class OtpEntity implements Otp {
    @PrimaryColumn()
    otpRef: string;

    @Column({ nullable: true })
    otp: string;

    @Column({ type: 'enum', enum: OtpRefTypes, nullable: true })
    otpRefType: OtpRefTypes;

    @Column({ type: 'timestamp with time zone', nullable: true })
    expirationDate: Date;

    @Column({ nullable: true })
    isUsed: boolean;

    @Column()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @Column()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
    
}