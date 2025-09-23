import { MigrationInterface, QueryRunner } from "typeorm";

export class PostPropertyChanges21695289133551 implements MigrationInterface {
    name = 'PostPropertyChanges21695289133551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "agency_fee_percentage"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "agency_fee_percentage" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "fixed_agency_fee"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "fixed_agency_fee" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "has_agency_fee" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms_ensuite"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms_ensuite" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bedrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bedrooms" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "price" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "square_feet"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "square_feet" numeric`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "FK_ffd1df4d8c19a8bd49fcd8af71b" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_ffd1df4d8c19a8bd49fcd8af71b"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "property_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "square_feet"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "square_feet" integer`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "price" integer`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bedrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bedrooms" integer`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms_ensuite"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms_ensuite" integer`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "has_agency_fee" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "fixed_agency_fee"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "fixed_agency_fee" integer`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "agency_fee_percentage"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "agency_fee_percentage" integer`);
    }

}
