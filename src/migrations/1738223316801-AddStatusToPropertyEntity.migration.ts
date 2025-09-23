import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToPropertyEntity1738223316801 implements MigrationInterface {
    name = 'AddStatusToPropertyEntity1738223316801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "unit_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "user_details_id" uuid`);

        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_to_rent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_tour" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "already_applied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "application_approved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "paid" boolean NOT NULL DEFAULT false`);

        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "is_approve" boolean`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "user_details_id" uuid`);

        await queryRunner.query(`ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "property_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "unit_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "user_details_id"`);

        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_to_rent"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_tour"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "already_applied"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "application_approved"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "paid"`);

        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "is_approve"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "user_details_id"`);

        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "property_id"`);
    }
}
