import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyAndUserMod1692775104020 implements MigrationInterface {
    name = 'PropertyAndUserMod1692775104020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "is_address_verified" boolean`);
        await queryRunner.query(`ALTER TABLE "property" ADD "is_verified" boolean`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_01eea41349b6c9275aec646eee0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "is_address_verified"`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "phone_number" character varying`);
    }

}
