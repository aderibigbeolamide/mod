import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyArchiveColumn1695662020695 implements MigrationInterface {
    name = 'PropertyArchiveColumn1695662020695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "is_archived" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "is_archived"`);
    }

}
