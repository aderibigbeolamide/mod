import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountDetails1736491734371 implements MigrationInterface {
    name = 'CreateAccountDetails1736491734371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "unit_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "unit_id"`);
    }

}
