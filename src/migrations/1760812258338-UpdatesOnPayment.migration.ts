import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesOnPayment1760812258338 implements MigrationInterface {
    name = 'UpdatesOnPayment1760812258338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "lessor_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_7df2c866ce798590b5f27315dcd" FOREIGN KEY ("lessor_id") REFERENCES "lessor_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_7df2c866ce798590b5f27315dcd"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_id"`);
    }

}
