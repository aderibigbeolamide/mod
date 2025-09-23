import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawRentalApplication1754706917654 implements MigrationInterface {
    name = 'WithdrawRentalApplication1754706917654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "application_withdrawn" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "withdrawn_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "withdrawn_at"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "application_withdrawn"`);
    }

}
