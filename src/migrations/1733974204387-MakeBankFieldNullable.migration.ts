import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeBankFieldNullable1733974204387 implements MigrationInterface {
    name = 'MakeBankFieldNullable1733974204387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "bank_code" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "bank_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "bank_code"`);
    }

}
