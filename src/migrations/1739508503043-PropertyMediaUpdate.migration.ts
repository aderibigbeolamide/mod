import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyMediaUpdate1739508503043 implements MigrationInterface {
    name = 'PropertyMediaUpdate1739508503043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT IF EXISTS "FK_7df2c866ce798590b5f27315dcd"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN IF EXISTS "lessor_id"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD CONSTRAINT "UQ_8f44a07b8e344393e360b2dd808" UNIQUE ("property_id")`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ALTER COLUMN "is_approve" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ALTER COLUMN "is_approve" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD CONSTRAINT "FK_8f44a07b8e344393e360b2dd808" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" DROP CONSTRAINT "FK_8f44a07b8e344393e360b2dd808"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ALTER COLUMN "is_approve" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ALTER COLUMN "is_approve" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP CONSTRAINT "UQ_8f44a07b8e344393e360b2dd808"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_7df2c866ce798590b5f27315dcd" FOREIGN KEY ("lessor_id") REFERENCES "lessor_info"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
