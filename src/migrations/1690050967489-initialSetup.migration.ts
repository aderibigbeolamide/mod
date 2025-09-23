import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1690050967489 implements MigrationInterface {
    name = 'InitialSetup1690050967489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "demo" ("demo_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "description" character varying, "duration" character varying, "video_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_736376b4853eb91cf9dd1fc8fd8" PRIMARY KEY ("demo_id"))`);
        await queryRunner.query(`CREATE TABLE "faq_question" ("faq_question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5942fc203710e8988c5aab6f9cf" PRIMARY KEY ("faq_question_id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("user_id" character varying NOT NULL, "otp" character varying, "expiration_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_258d028d322ea3b856bf9f12f25" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "property_tour_availability" ("property_tour_availability_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "days_available" character varying array, "time_slots" character varying array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_943cbdc0bc8b7ea87006999b2bb" PRIMARY KEY ("property_tour_availability_id"))`);
        await queryRunner.query(`CREATE TABLE "property_media" ("property_media_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "media_urls" character varying array, "video_urls" character varying array, "lease_document_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05e4224ee65d8f892171b79e61d" PRIMARY KEY ("property_media_id"))`);
        await queryRunner.query(`CREATE TABLE "user_details" ("details_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "phone_number" character varying, "address" character varying, "is_verified" boolean, "verification_date" TIMESTAMP, "profile_picture_url" character varying, "user_info" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d5313fcfe1d5f809f0d29d26d6b" PRIMARY KEY ("details_id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist" ("wishlist_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "property_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf0b54a57200f8116d7366bf42c" PRIMARY KEY ("wishlist_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."faq_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "faq" ("faq_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."faq_type_enum" DEFAULT '0', "title" character varying, "answer" character varying, "list_response" character varying array, "entity_id" character varying, "faq_question_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_50ee7238d5f3acb0711d8eaa258" PRIMARY KEY ("faq_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lessor_info_lessor_category_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "lessor_info" ("lessor_info_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lessor_category" "public"."lessor_info_lessor_category_enum", "full_name" character varying, "email" character varying, "phone_number" character varying, "agency_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0dcc4cf0bf82018168a1ebdf27c" PRIMARY KEY ("lessor_info_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "messages" ("message_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" character varying, "recipientid" character varying, "message" character varying, "status" "public"."messages_status_enum" DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6187089f850b8deeca0232cfeba" PRIMARY KEY ("message_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."property_fee_payment_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "property_fee" ("property_fee_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" character varying, "fee_description" character varying, "payment_type" "public"."property_fee_payment_type_enum", "amount" integer, "total_per_month" integer, "total" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9cecdcc5a344f83701378e34d2e" PRIMARY KEY ("property_fee_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."review_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "review" ("review_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "type" "public"."review_type_enum", "comment" character varying, "rating" smallint, "landlord_id" character varying, "question" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0106a233019ba9f4ee80aca2958" PRIMARY KEY ("review_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_fee_config_transaction_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "service_fee_config" ("fee_config_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_type" "public"."service_fee_config_transaction_type_enum", "min_price" integer, "max_price" integer, "percentage" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8440ba0449554add5c6659b1a46" PRIMARY KEY ("fee_config_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."unit_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "unit" ("unit_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying, "property_id" character varying, "property_info" json, "status" "public"."unit_status_enum", "date_available" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8893a61126ad0507e5d6a63ecb3" PRIMARY KEY ("unit_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_role_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "user_role" ("role" "public"."user_role_role_enum" NOT NULL, "label" character varying, "config" character varying, "info" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30ddd91a212a9d03669bc1dee74" PRIMARY KEY ("role"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "username" character varying, "password" character varying, "details_id" character varying, "role" "public"."user_role_enum", "is_active" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."property_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."property_transaction_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."property_lease_term_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "property" ("property_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "type" character varying, "city" character varying, "state" character varying, "address" character varying, "coordinates" point, "status" "public"."property_status_enum" DEFAULT '0', "date_available" TIMESTAMP, "transaction_type" "public"."property_transaction_type_enum", "lease_term" "public"."property_lease_term_enum", "amenities" character varying array, "tags" character varying array, "property_info" json, "price" integer, "lessor_user_id" character varying, "lessor_info_id" character varying, "property_policy" json, "property_media_id" character varying, "property_tour_availability_id" character varying, "sponsorship_level" smallint, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5dedb31d883f351fc101febc7c1" PRIMARY KEY ("property_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TYPE "public"."property_lease_term_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_role_enum"`);
        await queryRunner.query(`DROP TABLE "unit"`);
        await queryRunner.query(`DROP TYPE "public"."unit_status_enum"`);
        await queryRunner.query(`DROP TABLE "service_fee_config"`);
        await queryRunner.query(`DROP TYPE "public"."service_fee_config_transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TYPE "public"."review_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_fee"`);
        await queryRunner.query(`DROP TYPE "public"."property_fee_payment_type_enum"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_status_enum"`);
        await queryRunner.query(`DROP TABLE "lessor_info"`);
        await queryRunner.query(`DROP TYPE "public"."lessor_info_lessor_category_enum"`);
        await queryRunner.query(`DROP TABLE "faq"`);
        await queryRunner.query(`DROP TYPE "public"."faq_type_enum"`);
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TABLE "property_media"`);
        await queryRunner.query(`DROP TABLE "property_tour_availability"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "faq_question"`);
        await queryRunner.query(`DROP TABLE "demo"`);
    }

}
