import { MigrationInterface, QueryRunner } from "typeorm";

export class LocationDatas1744815367225 implements MigrationInterface {
    name = 'LocationDatas1744815367225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tables if they don't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "location_state" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "meta" json,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" uuid,
                "name" character varying,
                CONSTRAINT "PK_d49d1f3394185be892cff2cd913" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "location_lga" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "meta" json,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" uuid,
                "name" character varying,
                CONSTRAINT "PK_ed3789040ebb558bb48108f0241" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "location_wards" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "meta" json,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" uuid,
                "name" character varying,
                "lga_id" uuid,
                CONSTRAINT "PK_5bbee26e70d2eea34ebcdc84fee" PRIMARY KEY ("id")
            );
        `);

        // Add "state_id" column if missing
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='location_lga' AND column_name='state_id'
                ) THEN
                    ALTER TABLE "location_lga" ADD COLUMN "state_id" uuid;
                END IF;
            END
            $$;
        `);

        // Add FK for state_id
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'FK_2ae1526d1e661aaac7180147483'
                ) THEN
                    ALTER TABLE "location_lga"
                    ADD CONSTRAINT "FK_2ae1526d1e661aaac7180147483"
                    FOREIGN KEY ("state_id") REFERENCES "location_state"("id")
                    ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        // Add FK for lga_id
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'FK_3f82ece7183007b54ffb07b8462'
                ) THEN
                    ALTER TABLE "location_wards"
                    ADD CONSTRAINT "FK_3f82ece7183007b54ffb07b8462"
                    FOREIGN KEY ("lga_id") REFERENCES "location_lga"("id")
                    ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_wards" DROP CONSTRAINT IF EXISTS "FK_3f82ece7183007b54ffb07b8462"`);
        await queryRunner.query(`ALTER TABLE "location_lga" DROP CONSTRAINT IF EXISTS "FK_2ae1526d1e661aaac7180147483"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "location_wards"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "location_lga"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "location_state"`);
    }
}
