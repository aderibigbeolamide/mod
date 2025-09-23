import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitIdToRequestToRent1708104818044 implements MigrationInterface {
    name = 'AddUnitIdToRequestToRent1708104818044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "unit_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "unit_id"`);
    }

}
