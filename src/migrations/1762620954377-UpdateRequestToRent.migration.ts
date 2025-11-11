import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestToRent1762620954377 implements MigrationInterface {
    name = 'UpdateRequestToRent1762620954377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "landlord_signed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "landlord_signed_by_ip" character varying`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "tenant_signed_by_ip" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "tenant_signed_by_ip"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "landlord_signed_by_ip"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "landlord_signed_at"`);
    }

}
