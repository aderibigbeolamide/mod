import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyMediaTable1756811741469 implements MigrationInterface {
    name = 'PropertyMediaTable1756811741469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" ADD "lease_document_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "lease_document_url"`);
    }

}
