import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentTypes } from '../enums/payment.types.enum.js';
import { PropertyFee } from '../interfaces/property-fee.interface.js';
import Utility from '../../../utils/utility.js';

export class PropertyFeeDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    feeDescription?: string;

    @IsOptional()
    @IsEnum(PaymentTypes)
    paymentType?: PaymentTypes;

    @IsOptional()
    @IsInt()
    amount?: number;

    @IsOptional()
    @IsInt()
    totalPerMonth?: number;

    @IsOptional()
    @IsInt()
    total?: number;

    @IsOptional()
    @IsString()
    createdAt?: string;

    @IsOptional()
    @IsString()
    updatedAt?: string;

    constructor(obj?: Partial<PropertyFee>) {
        if (obj) {
            Utility.pickFieldsFromObject<PropertyFeeDto>(obj, this, {
                id: null,
                feeDescription: '',
                paymentType: PaymentTypes.YEARLY,  // Assuming default is CASH
                amount: 0,
                totalPerMonth: 0,
                total: 0,
            });
        }
    }
}
