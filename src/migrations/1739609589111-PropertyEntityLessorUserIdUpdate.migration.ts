import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyEntityLessorUserIdUpdate1739609589111 implements MigrationInterface {
    name = 'PropertyEntityLessorUserIdUpdate1739609589111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN IF EXISTS "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD IF NOT EXISTS "lessor_user_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_user_id"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_user_id" character varying`);
    }

}
