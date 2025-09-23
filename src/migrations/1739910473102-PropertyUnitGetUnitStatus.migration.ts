import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyUnitGetUnitStatus1739910473102 implements MigrationInterface {
    name = 'PropertyUnitGetUnitStatus1739910473102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_to_rent"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_tour"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "already_applied"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "paid"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN IF EXISTS "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD IF NOT EXISTS  "lessor_user_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "paid" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "already_applied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "requested_tour" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "requested_to_rent" boolean NOT NULL DEFAULT false`);
    }

}
