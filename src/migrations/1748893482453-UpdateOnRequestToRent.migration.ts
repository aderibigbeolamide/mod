import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOnRequestToRent1748893482453 implements MigrationInterface {
    name = 'UpdateOnRequestToRent1748893482453';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Set default value for "is_approve"
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ALTER COLUMN "is_approve"
            SET DEFAULT false
        `);

        // Drop and re-add "user_id" column
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            DROP COLUMN "user_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ADD COLUMN "user_id" uuid
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ADD CONSTRAINT "FK_a752c1e03efdfafcbe75722c93d"
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            DROP CONSTRAINT IF EXISTS "FK_a752c1e03efdfafcbe75722c93d"
        `);

        // Drop and restore column as text
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            DROP COLUMN "user_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ADD COLUMN "user_id" character varying
        `);

        // Remove default value from "is_approve"
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ALTER COLUMN "is_approve"
            DROP DEFAULT
        `);
    }
}
