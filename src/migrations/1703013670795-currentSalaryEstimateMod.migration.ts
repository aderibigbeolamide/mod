import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrentSalaryEstimateMod1703013670795 implements MigrationInterface {
    name = 'CurrentSalaryEstimateMod1703013670795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "current_salary_estimate"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "current_salary_estimate" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "current_salary_estimate"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "current_salary_estimate" integer`);
    }

}
