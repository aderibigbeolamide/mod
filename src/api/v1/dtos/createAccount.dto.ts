import { IsString, IsArray, IsNumber, IsOptional } from "class-validator";
import { UserEntity } from "../entities/user.entity.js";

export class CreateAccountDto {
    @IsOptional()
    payee: UserEntity;

    @IsString()
    accountNumber: string;

    @IsString()
    @IsOptional()
    accountName: string;

    @IsString()
    @IsOptional()
    bankName: string;

    @IsString()
    @IsOptional()
    bankId: string;

    @IsString()
    @IsOptional()
    bankCode: string;

    constructor(obj?: Partial<CreateAccountDto>) {
        if (obj) {
            this.accountNumber = obj.accountNumber || '';
            this.accountName = obj.accountName || '';
            this.bankName = obj.bankName || '';
            this.bankCode = obj.bankCode || '';
            this.bankId = obj.bankId || '';
            this.payee = obj.payee || new UserEntity();
        }
    }
}
