import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyMediaCorrection1705686752980 implements MigrationInterface {
    name = 'PropertyMediaCorrection1705686752980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" RENAME COLUMN "media_urls" TO "image_urls"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" RENAME COLUMN "image_urls" TO "media_urls"`);
    }

}
