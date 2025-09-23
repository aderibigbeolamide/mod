import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestToRentAndLocation1700319684513 implements MigrationInterface {
    name = 'RequestToRentAndLocation1700319684513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "name" character varying, CONSTRAINT "PK_d49d1f3394185be892cff2cd913" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location_lga" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "name" character varying, "state" character varying, CONSTRAINT "PK_ed3789040ebb558bb48108f0241" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "request_to_rent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "first_name" character varying, "middle_name" character varying, "last_name" character varying, "identification_mode" character varying, "email" character varying, "phone_number" character varying, "summary" text, "num_people_living" integer, "num_co_tenants_above18" integer, "co_tenants" jsonb, "has_pets" boolean, "pet_type" character varying, "num_pets" integer, "move_in_date" date, "current_address" text, "switch_reason" text, "property_manager_name" character varying, "property_manager_contact" character varying, "past_address" text, "past_move_in_date" date, "past_move_out_date" date, "reason_for_leaving" text, "past_property_manager_contact" character varying, "current_salary_estimate" integer, "workplace" character varying, "start_date_at_company" date, "company_referee_name" character varying, "referee_email" character varying, "referee_phone_number" character varying, "evicted_before" boolean, "eviction_reason" text, "convicted_before" boolean, "conviction_details" text, "emergency_contact_name" text, "relationship_with_contact" text, "emergency_contact_email" text, "emergency_contact_phone_number" text, "is_complete" boolean, "user_id" character varying, "property_id" character varying, CONSTRAINT "UQ_9c33951d6fe9e5df039dc368827" UNIQUE ("email"), CONSTRAINT "UQ_850c54de5ba0aeb90c4e862bf0a" UNIQUE ("referee_email"), CONSTRAINT "PK_fbd79e8a5cc18667ef7aaa78ccf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "report_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" character varying NOT NULL, "user_id" character varying NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_a0fa83a2b8ff99bf954878bf1b9" PRIMARY KEY ("id", "report_id"))`);
        await queryRunner.query(`CREATE TABLE "tour_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "meet_date" date, "email" character varying DEFAULT false, "phone" character varying DEFAULT false, "prefer_virtual_tour" boolean DEFAULT false, CONSTRAINT "PK_a46c26b890515f0046f46717edf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lga" text`);
        await queryRunner.query(`ALTER TABLE "property" ADD "floor_number" text`);
        await queryRunner.query(`ALTER TABLE "property" ADD "area" text`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_document_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property" ADD "religious_building" boolean`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_info_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_info_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."property_type_enum" RENAME TO "property_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum" AS ENUM('HOUSE', 'CONDO', 'TOWNHOUSE', 'FLAT', 'BUNGALOW', 'SELFCON', 'SERVICES', 'SHARED', 'DUPLEX', 'STUDIO')`);
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "type" TYPE "public"."property_type_enum" USING "type"::"text"::"public"."property_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum_old" AS ENUM('HOUSE', 'CONDO', 'TOWNHOUSE')`);
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "type" TYPE "public"."property_type_enum_old" USING "type"::"text"::"public"."property_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."property_type_enum_old" RENAME TO "property_type_enum"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_info_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_info_id" character varying`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "religious_building"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_document_id"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "area"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "floor_number"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lga"`);
        await queryRunner.query(`DROP TABLE "tour_request"`);
        await queryRunner.query(`DROP TABLE "report_property"`);
        await queryRunner.query(`DROP TABLE "request_to_rent"`);
        await queryRunner.query(`DROP TABLE "location_lga"`);
        await queryRunner.query(`DROP TABLE "location_state"`);
    }

}
