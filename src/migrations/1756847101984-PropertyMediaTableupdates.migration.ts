import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyMediaTableupdates1756847101984 implements MigrationInterface {
    name = 'PropertyMediaTableupdates1756847101984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" ADD "use_let_bud_template" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "use_let_bud_template"`);
    }

}
