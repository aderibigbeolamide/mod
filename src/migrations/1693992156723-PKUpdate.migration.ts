import { MigrationInterface, QueryRunner } from "typeorm";

export class PKUpdate1693992156723 implements MigrationInterface {
    name = 'PKUpdate1693992156723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demo" RENAME COLUMN "demo_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "demo" RENAME CONSTRAINT "PK_736376b4853eb91cf9dd1fc8fd8" TO "PK_9d8d89f7764de19ec5a40a5f056"`);
        await queryRunner.query(`ALTER TABLE "faq_question" RENAME COLUMN "faq_question_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "faq_question" RENAME CONSTRAINT "PK_5942fc203710e8988c5aab6f9cf" TO "PK_ed61cb1433527f5841ff662abe2"`);
        await queryRunner.query(`ALTER TABLE "property_media" RENAME COLUMN "property_media_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "property_media" RENAME CONSTRAINT "PK_05e4224ee65d8f892171b79e61d" TO "PK_d18a71a690f74cc103387bd67df"`);
        await queryRunner.query(`ALTER TABLE "property_tour_availability" RENAME COLUMN "property_tour_availability_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "property_tour_availability" RENAME CONSTRAINT "PK_943cbdc0bc8b7ea87006999b2bb" TO "PK_b759a44b8e6422e8d7bd7ff35f5"`);
        await queryRunner.query(`ALTER TABLE "user_details" RENAME COLUMN "details_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "user_details" RENAME CONSTRAINT "PK_d5313fcfe1d5f809f0d29d26d6b" TO "PK_fb08394d3f499b9e441cab9ca51"`);
        await queryRunner.query(`ALTER TABLE "wishlist" RENAME COLUMN "wishlist_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "wishlist" RENAME CONSTRAINT "PK_bf0b54a57200f8116d7366bf42c" TO "PK_620bff4a240d66c357b5d820eaa"`);
        await queryRunner.query(`ALTER TABLE "faq" RENAME COLUMN "faq_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "faq" RENAME CONSTRAINT "PK_50ee7238d5f3acb0711d8eaa258" TO "PK_d6f5a52b1a96dd8d0591f9fbc47"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "message_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME CONSTRAINT "PK_6187089f850b8deeca0232cfeba" TO "PK_18325f38ae6de43878487eff986"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" RENAME COLUMN "lessor_info_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" RENAME CONSTRAINT "PK_0dcc4cf0bf82018168a1ebdf27c" TO "PK_7f35a8a50a02f89e8d8931ecb82"`);
        await queryRunner.query(`ALTER TABLE "property_fee" RENAME COLUMN "property_fee_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "property_fee" RENAME CONSTRAINT "PK_9cecdcc5a344f83701378e34d2e" TO "PK_a6ff5052357071a8ddd78c40b48"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "review_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME CONSTRAINT "PK_0106a233019ba9f4ee80aca2958" TO "PK_2e4299a343a81574217255c00ca"`);
        await queryRunner.query(`ALTER TABLE "service_fee_config" RENAME COLUMN "fee_config_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "service_fee_config" RENAME CONSTRAINT "PK_8440ba0449554add5c6659b1a46" TO "PK_a9567b248d677034bb1416a83c3"`);
        await queryRunner.query(`ALTER TABLE "unit" RENAME COLUMN "unit_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "unit" RENAME CONSTRAINT "PK_8893a61126ad0507e5d6a63ecb3" TO "PK_4252c4be609041e559f0c80f58a"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "user_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" TO "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "PK_f955e01e6d5c845037a3082cab8"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "media_id"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "PK_5dedb31d883f351fc101febc7c1"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "media" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "media" ADD "uploaded_by" character varying`);
        await queryRunner.query(`ALTER TABLE "media" ADD "is_temp" boolean`);
        await queryRunner.query(`ALTER TABLE "property" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "property" ADD "created_by" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "PK_d80743e6191258a5003d5843b4f"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "is_temp"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "uploaded_by"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "property" ADD "property_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "PK_5dedb31d883f351fc101febc7c1" PRIMARY KEY ("property_id")`);
        await queryRunner.query(`ALTER TABLE "media" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "media" ADD "media_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "PK_f955e01e6d5c845037a3082cab8" PRIMARY KEY ("media_id")`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "PK_758b8ce7c18b9d347461b30228d"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "unit" RENAME CONSTRAINT "PK_4252c4be609041e559f0c80f58a" TO "PK_8893a61126ad0507e5d6a63ecb3"`);
        await queryRunner.query(`ALTER TABLE "unit" RENAME COLUMN "id" TO "unit_id"`);
        await queryRunner.query(`ALTER TABLE "service_fee_config" RENAME CONSTRAINT "PK_a9567b248d677034bb1416a83c3" TO "PK_8440ba0449554add5c6659b1a46"`);
        await queryRunner.query(`ALTER TABLE "service_fee_config" RENAME COLUMN "id" TO "fee_config_id"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME CONSTRAINT "PK_2e4299a343a81574217255c00ca" TO "PK_0106a233019ba9f4ee80aca2958"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "id" TO "review_id"`);
        await queryRunner.query(`ALTER TABLE "property_fee" RENAME CONSTRAINT "PK_a6ff5052357071a8ddd78c40b48" TO "PK_9cecdcc5a344f83701378e34d2e"`);
        await queryRunner.query(`ALTER TABLE "property_fee" RENAME COLUMN "id" TO "property_fee_id"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" RENAME CONSTRAINT "PK_7f35a8a50a02f89e8d8931ecb82" TO "PK_0dcc4cf0bf82018168a1ebdf27c"`);
        await queryRunner.query(`ALTER TABLE "lessor_info" RENAME COLUMN "id" TO "lessor_info_id"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME CONSTRAINT "PK_18325f38ae6de43878487eff986" TO "PK_6187089f850b8deeca0232cfeba"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "id" TO "message_id"`);
        await queryRunner.query(`ALTER TABLE "faq" RENAME CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" TO "PK_50ee7238d5f3acb0711d8eaa258"`);
        await queryRunner.query(`ALTER TABLE "faq" RENAME COLUMN "id" TO "faq_id"`);
        await queryRunner.query(`ALTER TABLE "wishlist" RENAME CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" TO "PK_bf0b54a57200f8116d7366bf42c"`);
        await queryRunner.query(`ALTER TABLE "wishlist" RENAME COLUMN "id" TO "wishlist_id"`);
        await queryRunner.query(`ALTER TABLE "user_details" RENAME CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" TO "PK_d5313fcfe1d5f809f0d29d26d6b"`);
        await queryRunner.query(`ALTER TABLE "user_details" RENAME COLUMN "id" TO "details_id"`);
        await queryRunner.query(`ALTER TABLE "property_tour_availability" RENAME CONSTRAINT "PK_b759a44b8e6422e8d7bd7ff35f5" TO "PK_943cbdc0bc8b7ea87006999b2bb"`);
        await queryRunner.query(`ALTER TABLE "property_tour_availability" RENAME COLUMN "id" TO "property_tour_availability_id"`);
        await queryRunner.query(`ALTER TABLE "property_media" RENAME CONSTRAINT "PK_d18a71a690f74cc103387bd67df" TO "PK_05e4224ee65d8f892171b79e61d"`);
        await queryRunner.query(`ALTER TABLE "property_media" RENAME COLUMN "id" TO "property_media_id"`);
        await queryRunner.query(`ALTER TABLE "faq_question" RENAME CONSTRAINT "PK_ed61cb1433527f5841ff662abe2" TO "PK_5942fc203710e8988c5aab6f9cf"`);
        await queryRunner.query(`ALTER TABLE "faq_question" RENAME COLUMN "id" TO "faq_question_id"`);
        await queryRunner.query(`ALTER TABLE "demo" RENAME CONSTRAINT "PK_9d8d89f7764de19ec5a40a5f056" TO "PK_736376b4853eb91cf9dd1fc8fd8"`);
        await queryRunner.query(`ALTER TABLE "demo" RENAME COLUMN "id" TO "demo_id"`);
    }

}
