import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessorIdToPropertyEntity1737818627248 implements MigrationInterface {
    name = 'AddLessorIdToPropertyEntity1737818627248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if "request_to_rent" table exists
        if (await queryRunner.hasTable('request_to_rent')) {
            await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "is_approve" boolean`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "user_details_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "user_details_id" uuid`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "property_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "unit_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "unit_id" uuid`);
        }

        // Check if "tour_request" table exists
        if (await queryRunner.hasTable('tour_request')) {
            await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "property_id"`);
            await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
            await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "unit_id"`);
            await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "unit_id" uuid`);
        }

        // Check if "property" table exists
        if (await queryRunner.hasTable('property')) {
            await queryRunner.query(`ALTER TABLE "property" ADD COLUMN IF NOT EXISTS "lessor_id" uuid`);
        }

        // Check if "unit" table exists
        if (await queryRunner.hasTable('unit')) {
            await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_to_rent" boolean NOT NULL DEFAULT false`);
            await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_tour" boolean NOT NULL DEFAULT false`);
            await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "already_applied" boolean NOT NULL DEFAULT false`);
            await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "application_approved" boolean NOT NULL DEFAULT false`);
            await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "paid" boolean NOT NULL DEFAULT false`);
        }

        // Check if "payments" table exists
        if (await queryRunner.hasTable('payments')) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "property_id"`);
            await queryRunner.query(`ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
        }

        // Foreign Key Constraints
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_698b726a6fdce0472c1876854bc"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_698b726a6fdce0472c1876854bc" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_1b28d36f03d08b5177eab13820c"`);
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
        // Reverse the migration steps if needed
        if (await queryRunner.hasTable('payments')) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "property_id"`);
        }

        if (await queryRunner.hasTable('property')) {
            await queryRunner.query(`ALTER TABLE "property" DROP COLUMN IF EXISTS "lessor_id"`);
        }

        if (await queryRunner.hasTable('unit')) {
            await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_to_rent"`);
            await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_tour"`);
            await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "already_applied"`);
            await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "application_approved"`);
            await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "paid"`);
        }

        if (await queryRunner.hasTable('tour_request')) {
            await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "unit_id"`);
            await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "property_id"`);
        }

        if (await queryRunner.hasTable('request_to_rent')) {
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "unit_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "property_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "user_details_id"`);
            await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "is_approve"`);
        }
    }
}
