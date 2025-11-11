import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentEntity1762444659399 implements MigrationInterface {
    name = 'UpdatePaymentEntity1762444659399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "landlord_signed_at"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "landlord_signed_by_ip"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "tenant_signed_by_ip"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "payment_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "payment_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'INITIALIZED', 'CANCELLED', 'EXPIRED')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum" USING "status"::"text"::"public"."payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'INITIALIZED'`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum_old" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'INITIALIZED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum_old" USING "status"::"text"::"public"."payments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'INITIALIZED'`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_status_enum_old" RENAME TO "payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "payment_expires_at"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "payment_expires_at"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "tenant_signed_by_ip" character varying`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "landlord_signed_by_ip" character varying`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "landlord_signed_at" TIMESTAMP`);
    }

}
