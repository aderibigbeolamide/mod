import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingLeaseAgreement1753180964301 implements MigrationInterface {
    name = 'AddingLeaseAgreement1753180964301';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename column safely if it exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'unit' AND column_name = 'is_unit_occupued'
                ) THEN
                    ALTER TABLE "unit" RENAME COLUMN "is_unit_occupued" TO "is_unit_occupied";
                END IF;
            END
            $$;
        `);

        // Add lease_agreement_signed column if it does not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'request_to_rent' AND column_name = 'lease_agreement_signed'
                ) THEN
                    ALTER TABLE "request_to_rent" ADD COLUMN "lease_agreement_signed" boolean NOT NULL DEFAULT false;
                END IF;
            END
            $$;
        `);

        // Add lease_agreement_signed_at column if it does not exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'request_to_rent' AND column_name = 'lease_agreement_signed_at'
                ) THEN
                    ALTER TABLE "request_to_rent" ADD COLUMN "lease_agreement_signed_at" TIMESTAMP;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop lease_agreement_signed_at if it exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'request_to_rent' AND column_name = 'lease_agreement_signed_at'
                ) THEN
                    ALTER TABLE "request_to_rent" DROP COLUMN "lease_agreement_signed_at";
                END IF;
            END
            $$;
        `);

        // Drop lease_agreement_signed if it exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'request_to_rent' AND column_name = 'lease_agreement_signed'
                ) THEN
                    ALTER TABLE "request_to_rent" DROP COLUMN "lease_agreement_signed";
                END IF;
            END
            $$;
        `);

        // Rename column back if it was previously renamed
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'unit' AND column_name = 'is_unit_occupied'
                ) THEN
                    ALTER TABLE "unit" RENAME COLUMN "is_unit_occupied" TO "is_unit_occupued";
                END IF;
            END
            $$;
        `);
    }
}
