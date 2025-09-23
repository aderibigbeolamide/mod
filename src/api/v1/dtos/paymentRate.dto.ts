import { IsNotEmpty, IsDecimal, IsString, IsOptional } from 'class-validator';

export class PaymentRateDto {
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @IsNotEmpty()
    rate: number;

    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @IsNotEmpty()
    agentRate: number;

    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @IsNotEmpty()
    platformRate: number;

    @IsString()
    @IsNotEmpty()
    range: string;
}
