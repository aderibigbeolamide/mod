import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLeaseAgreementUrlRequestRent1761803477253 implements MigrationInterface {
    name = 'AddLeaseAgreementUrlRequestRent1761803477253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "lease_agreement_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "lease_agreement_url"`);
    }

}
