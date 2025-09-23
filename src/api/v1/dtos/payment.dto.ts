import { IsNotEmpty, IsEnum, IsNumber, IsString, IsOptional, ValidateNested, IsArray, IsUrl } from 'class-validator';
import { PaymentStatuses } from '../enums/payment.statuses.enum.js';
import { Payment, verifyPayment } from '../interfaces/payment.interface.js';
import Utility from '../../../utils/utility.js';
import { PaymentTransactionDto } from './paymentTransaction.dto.js';
import { UserEntity } from '../entities/user.entity.js';
import { PayeeRole } from '../enums/payeeRole.enum.js';
import { PropertyEntity, PropertyUnitEntity } from '../entities/property.entity.js';
import { PropertyUnit } from '../interfaces/unit.interface.js';

export class PaymentDto implements Partial<Payment> {
    @IsOptional()
    payer: UserEntity;  // User making the payment

    @IsOptional()
    payee?: UserEntity;  // Property owner or designated recipient

    @IsOptional()
    property?: PropertyEntity;  // Property

    @IsOptional()
    unit?: PropertyUnitEntity;  // Property unit

    @IsString()
    @IsOptional()
    propertyId?: string;

    @IsString()
    @IsOptional()
    unitId?: string;

    @IsEnum(PayeeRole)
    @IsOptional()
    payeeRole?: PayeeRole = PayeeRole.ADMIN;  // Default role for payee

    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    transaction?: PaymentTransactionDto[];

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsEnum(PaymentStatuses)
    @IsOptional()
    status?: PaymentStatuses = PaymentStatuses.INITIALIZED;

    @IsString()
    @IsOptional()
    reference?: string;

    @IsUrl()
    @IsOptional()
    callbackUrl: string;

    @IsString()
    @IsOptional()
    accessCode: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    channel?: string;

    @IsUrl()
    @IsOptional()
    authorizationUrl: string;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;

    constructor(obj?: Partial<Payment>) {
        Utility.pickFieldsFromObject<PaymentDto>(obj, this, {
            amount: 0,
            email: null,
            status: PaymentStatuses.INITIALIZED,
            channel: null,
            reference: null,
            callbackUrl: null,
            payer: new UserEntity(),
            property: new PropertyEntity(),
            unit: new PropertyUnitEntity(),
            payeeRole: PayeeRole.ADMIN,
            authorizationUrl: null,
            accessCode: '',
            propertyId: '',
            unitId: '',
        });
    }
}

export class verifyPaymentDto {
    @IsString()
    @IsOptional()
    reference: string;

    @IsString()
    @IsOptional()
    paymentReference: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    propertyId?: string;

    @IsString()
    @IsOptional()
    unitId?: string;

    @IsString()
    @IsOptional()
    name?: string;  // This will store the concatenated name (firstname + lastname)

    @IsString()
    @IsOptional()
    payerId?: string;  // This will store the payer's ID

    constructor(obj?: Partial<verifyPaymentDto>) {
        if (obj) {
            this.reference = obj.reference || '';
            this.paymentReference = obj.paymentReference || '';
            this.amount = obj.amount || 0;
            this.email = obj.email || '';
            this.name = obj.name || '';
            this.payerId = obj.payerId || '';
            this.propertyId = obj.propertyId || '';
            this.unitId = obj.unitId || '';
        }
    }
}
