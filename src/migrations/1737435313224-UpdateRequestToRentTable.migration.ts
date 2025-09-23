import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestToRentTable1737435313224 implements MigrationInterface {
    name = 'UpdateRequestToRentTable1737435313224';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add columns if they don't exist
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD IF NOT EXISTS "is_approve" boolean`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD IF NOT EXISTS "user_details_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD IF NOT EXISTS "unit_id" uuid`);

        // Step 1: Add the column without NOT NULL
        await queryRunner.query(`ALTER TABLE "property" ADD IF NOT EXISTS "lessor_id" uuid`);

        // Step 2: Update the column with default values or populate it
        await queryRunner.query(`UPDATE "property" SET "lessor_id" = (SELECT id FROM "lessor_info" LIMIT 1)`);

        // Step 3: Alter the column to enforce NOT NULL constraint
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "lessor_id" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "unit" ADD IF NOT EXISTS "requested_to_rent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD IF NOT EXISTS "requested_tour" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD IF NOT EXISTS "already_applied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD IF NOT EXISTS "application_approved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD IF NOT EXISTS "paid" boolean NOT NULL DEFAULT false`);

        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_c22819af2bbca819444f4f7aa76"`);

        // Only add column if it doesn't exist
        await queryRunner.query(`ALTER TABLE "payments" ADD IF NOT EXISTS "property_id" uuid`);

        // Handle the case where the column is already there
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "property_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "unit_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "unit_id" uuid`);

        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" DROP NOT NULL`);

        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_698b726a6fdce0472c1876854bc" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_1b28d36f03d08b5177eab13820c" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_e54d9e3e71a9cc50914f2f61fe5"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_e54d9e3e71a9cc50914f2f61fe5" FOREIGN KEY ("user_details_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_01765cc014cd25794782d5d7e8f"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD CONSTRAINT "FK_01765cc014cd25794782d5d7e8f" FOREIGN KEY ("property_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_22083f904c2ed5dda60d86e9591"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD CONSTRAINT "FK_22083f904c2ed5dda60d86e9591" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT IF EXISTS "FK_7df2c866ce798590b5f27315dcd"`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_7df2c866ce798590b5f27315dcd" FOREIGN KEY ("lessor_id") REFERENCES "lessor_info"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_c22819af2bbca819444f4f7aa76"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c22819af2bbca819444f4f7aa76" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse the operations performed in `up`
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c22819af2bbca819444f4f7aa76"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_7df2c866ce798590b5f27315dcd"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT "FK_22083f904c2ed5dda60d86e9591"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT "FK_01765cc014cd25794782d5d7e8f"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT "FK_e54d9e3e71a9cc50914f2f61fe5"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT "FK_1b28d36f03d08b5177eab13820c"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT "FK_698b726a6fdce0472c1876854bc"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "unit_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "unit_id" character varying`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD "property_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "paid"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "application_approved"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "already_applied"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "requested_tour"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "requested_to_rent"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "lessor_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN "unit_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "user_details_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN "is_approve"`);
    }
}
