import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaTableAndSmallMods1692821005023 implements MigrationInterface {
    name = 'MediaTableAndSmallMods1692821005023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."media_ref_category_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TYPE "public"."media_media_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."media_media_category_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "media" ("media_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "public_url" character varying, "ref_id" character varying, "ref_category" "public"."media_ref_category_enum", "media_type" "public"."media_media_type_enum", "media_category" "public"."media_media_category_enum", "is_public" boolean, "size" double precision, "size_metric" character varying, "media_ext" character varying, "media_file_name" character varying, "user_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f955e01e6d5c845037a3082cab8" PRIMARY KEY ("media_id"))`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "PK_258d028d322ea3b856bf9f12f25"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "media_ids" character varying array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "otp_ref" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "PK_0dc7a5ac23164ab84f708d2c9f1" PRIMARY KEY ("otp_ref")`);
        await queryRunner.query(`CREATE TYPE "public"."otp_otp_ref_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "otp_ref_type" "public"."otp_otp_ref_type_enum"`);
        await queryRunner.query(`ALTER TABLE "property_media" ALTER COLUMN "media_urls" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "property_media" ALTER COLUMN "video_urls" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" ALTER COLUMN "video_urls" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "property_media" ALTER COLUMN "media_urls" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "otp_ref_type"`);
        await queryRunner.query(`DROP TYPE "public"."otp_otp_ref_type_enum"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "PK_0dc7a5ac23164ab84f708d2c9f1"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "otp_ref"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "media_ids"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "PK_258d028d322ea3b856bf9f12f25" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TYPE "public"."media_media_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."media_media_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."media_ref_category_enum"`);
    }

}
