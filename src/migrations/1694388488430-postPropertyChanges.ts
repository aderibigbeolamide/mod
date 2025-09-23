import { MigrationInterface, QueryRunner } from "typeorm";

export class PostPropertyChanges1694388488430 implements MigrationInterface {
    name = 'PostPropertyChanges1694388488430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "property_info"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "property_info"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "date_available"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "meta" json`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "meta" json`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "agency_fee_percentage" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "fixed_agency_fee" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "has_agency_fee" boolean`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bathrooms_ensuite" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "no_of_bedrooms" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "payment_schedule" character varying`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "price" integer`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "square_feet" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "meta" json`);
        await queryRunner.query(`ALTER TABLE "property" ADD "advertised_unit" json`);
        await queryRunner.query(`ALTER TABLE "property" ADD "availability" json`);
        await queryRunner.query(`ALTER TABLE "property" ADD "caution_fee" json`);
        await queryRunner.query(`ALTER TABLE "property" ADD "close_to_noise" boolean`);
        await queryRunner.query(`ALTER TABLE "property" ADD "fixed_caution_fee" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "address_id" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "tour_availability" json`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "is_complete" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "property" ADD "landlord_resides" boolean`);
        await queryRunner.query(`ALTER TABLE "property" ADD "size" numeric`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "property_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum" AS ENUM('HOUSE', 'CONDO', 'TOWNHOUSE')`);
        await queryRunner.query(`ALTER TABLE "property" ADD "type" "public"."property_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "property_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "landlord_resides"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "is_complete"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "tour_availability"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "fixed_caution_fee"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "close_to_noise"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "caution_fee"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "availability"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "advertised_unit"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "meta"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "square_feet"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "payment_schedule"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bedrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms_ensuite"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "no_of_bathrooms"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "has_agency_fee"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "fixed_agency_fee"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "agency_fee_percentage"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "meta"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" DROP COLUMN "meta"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "created_by" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "date_available" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "property" ADD "price" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD "property_info" json`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "property_info" json`);
        await queryRunner.query(`ALTER TABLE "lessor_info" ADD "full_name" character varying`);
    }

}
