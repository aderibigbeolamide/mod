import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyMediaRelationship1705693337723 implements MigrationInterface {
    name = 'PropertyMediaRelationship1705693337723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" ADD "meta" json`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "property_media_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "property_media_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "UQ_61769005fc1e66c57ea29f11fa0" UNIQUE ("property_media_id")`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_61769005fc1e66c57ea29f11fa0" FOREIGN KEY ("property_media_id") REFERENCES "property_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_61769005fc1e66c57ea29f11fa0"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "UQ_61769005fc1e66c57ea29f11fa0"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "property_media_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "property_media_id" character varying`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "meta"`);
    }

}
