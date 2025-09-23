import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingNewPaymentTable1753713172811 implements MigrationInterface {
    name = 'AddingNewPaymentTable1753713172811';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create payments table if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'payments' AND table_schema = 'public'
                ) THEN
                    CREATE TABLE "payments" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "payee_role" "public"."payments_payee_role_enum" NOT NULL DEFAULT 'admin',
                        "property_id" uuid,
                        "unit_id" uuid,
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
                    );
                END IF;
            END
            $$;
        `);

        // Add all foreign keys conditionally
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_02f8e8d4094492641ad95010ca1'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_02f8e8d4094492641ad95010ca1"
                    FOREIGN KEY ("payer_id") REFERENCES "user"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_10578ef284a65afc54fb7c5aea3'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3"
                    FOREIGN KEY ("payee_id") REFERENCES "user"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_c22819af2bbca819444f4f7aa76'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_c22819af2bbca819444f4f7aa76"
                    FOREIGN KEY ("property_id") REFERENCES "property"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
                ) THEN
                    ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"
                    FOREIGN KEY ("unit_id") REFERENCES "unit"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'FK_464da95dc8a05470b2b158d4df6'
                ) THEN
                    ALTER TABLE "transactions" ADD CONSTRAINT "FK_464da95dc8a05470b2b158d4df6"
                    FOREIGN KEY ("payment_id") REFERENCES "payments"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop constraints if they exist
        const constraints = [
            "FK_464da95dc8a05470b2b158d4df6",
            "FK_85c5a451fd95da85400e6a182fa",
            "FK_c22819af2bbca819444f4f7aa76",
            "FK_10578ef284a65afc54fb7c5aea3",
            "FK_02f8e8d4094492641ad95010ca1"
        ];

        for (const constraint of constraints) {
            await queryRunner.query(`
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.table_constraints 
                        WHERE constraint_name = '${constraint}'
                    ) THEN
                        ALTER TABLE "${constraint.startsWith('FK_464') ? 'transactions' : 'payments'}"
                        DROP CONSTRAINT "${constraint}";
                    END IF;
                END
                $$;
            `);
        }

        // Drop payments table if exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'payments' AND table_schema = 'public'
                ) THEN
                    DROP TABLE "payments";
                END IF;
            END
            $$;
        `);
    }
}
