import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSignInType1692780270624 implements MigrationInterface {
    name = 'AddSignInType1692780270624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "sign_in_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sign_in_type"`);
    }

}
