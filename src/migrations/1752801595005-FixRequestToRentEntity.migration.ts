import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRequestToRentEntity1752801595005 implements MigrationInterface {
    name = 'FixRequestToRentEntity1752801595005';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Safely drop the constraint if it exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'UQ_9c33951d6fe9e5df039dc368827'
                      AND table_name = 'request_to_rent'
                ) THEN
                    ALTER TABLE "request_to_rent" DROP CONSTRAINT "UQ_9c33951d6fe9e5df039dc368827";
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-add the unique constraint on "email"
        await queryRunner.query(`
            ALTER TABLE "request_to_rent"
            ADD CONSTRAINT "UQ_9c33951d6fe9e5df039dc368827" UNIQUE ("email")
        `);
    }
}
