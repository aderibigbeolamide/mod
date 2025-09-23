import { IsUUID, IsNotEmpty, IsDecimal, IsString, IsUrl, IsEnum, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { PaymentTransactionStatus } from "../enums/paymentTransaction.status.enum.js";
import { PaymentDto } from './payment.dto.js';
import Utility from '../../../utils/utility.js';
import { PaymentTransaction } from '../interfaces/paymentTransaction.interface.js';
import { PaymentEntity } from '../entities/payment.entity.js';

export class PaymentTransactionDto implements Partial<PaymentTransaction> {
    @IsNumber()
    @IsOptional()
    amount: number;

    @IsEnum(PaymentTransactionStatus)
    @IsOptional()
    status: PaymentTransactionStatus = PaymentTransactionStatus.INITIALIZED;

    @IsString()
    @IsNotEmpty()
    reference: string;

    @IsUrl()
    @IsOptional()
    invoiceURL: string;

    constructor(obj?: Partial<PaymentTransaction>) {
        Utility.pickFieldsFromObject<PaymentTransactionDto>(obj, this, {
            status: PaymentTransactionStatus.INITIALIZED,
            reference: null,
            invoiceURL: null,
            amount: null,
        });
        // if (!this.amount && this.payment && 'amount' in this.payment) {
        //     this.amount = this.payment.amount;
        // }
    }
}
