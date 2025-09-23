import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntityChnages1753693409301 implements MigrationInterface {
    name = 'PaymentEntityChnages1753693409301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "payment_reference"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD IF NOT EXISTS "reference" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "reference"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD IF NOT EXISTS "payment_reference" character varying NOT NULL`);
    }

}
