import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountDetails1733871797950 implements MigrationInterface {
    name = 'AccountDetails1733871797950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "account_number" character varying NOT NULL, "account_name" character varying NOT NULL, "payee_id" uuid, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
