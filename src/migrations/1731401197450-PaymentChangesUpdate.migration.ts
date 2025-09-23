import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentChangesUpdate1731401197450 implements MigrationInterface {
    name = 'PaymentChangesUpdate1731401197450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure the enum type does not already exist
        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payments_payee_role_enum') THEN
                    CREATE TYPE "public"."payments_payee_role_enum" AS ENUM('admin', 'lessor', 'rental', 'lessor_rental');
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payments_status_enum') THEN
                    CREATE TYPE "public"."payments_status_enum" AS ENUM('INITIALIZED', 'PENDING', 'COMPLETED', 'FAILED');
                END IF;
            END $$;
        `);

        // Create the payments table
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "payments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "payee_role" "public"."payments_payee_role_enum" NOT NULL DEFAULT 'admin',
            "amount" integer NOT NULL,
            "status" "public"."payments_status_enum" NOT NULL DEFAULT 'INITIALIZED',
            "reference" character varying NOT NULL,
            "email" character varying NOT NULL,
            "access_code" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "payer_id" uuid NOT NULL,
            "payee_id" uuid,
            CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
        )`);

        // Add the payment_id column to the transactions table if it doesn't exist
        await queryRunner.query(`
            ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "payment_id" uuid;
        `);

        // Add constraints only if they don't already exist
        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_02f8e8d4094492641ad95010ca1'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_02f8e8d4094492641ad95010ca1" FOREIGN KEY ("payer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_10578ef284a65afc54fb7c5aea3'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_464da95dc8a05470b2b158d4df6'
                ) THEN
                    ALTER TABLE "transactions" ADD CONSTRAINT "FK_464da95dc8a05470b2b158d4df6" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "FK_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_10578ef284a65afc54fb7c5aea3"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_02f8e8d4094492641ad95010ca1"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payments_payee_role_enum"`);
    }
}
