import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyUnitEntity1738693715301 implements MigrationInterface {
    name = 'UpdatePropertyUnitEntity1738693715301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "unit_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "user_details_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD COLUMN IF NOT EXISTS "user_details_id" uuid`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_to_rent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "requested_tour" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "already_applied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "application_approved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "paid" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "unit" ADD COLUMN IF NOT EXISTS "is_unit_occupued" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "is_approve" boolean`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "user_details_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "user_details_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "property_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "unit_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD COLUMN IF NOT EXISTS "unit_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" DROP NOT NULL`);

        // Foreign Key Constraints
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_01765cc014cd25794782d5d7e8f"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD CONSTRAINT "FK_01765cc014cd25794782d5d7e8f" FOREIGN KEY ("property_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_22083f904c2ed5dda60d86e9591"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD CONSTRAINT "FK_22083f904c2ed5dda60d86e9591" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_ab97063e4462b50ae79c66ba2af"`);
        await queryRunner.query(`ALTER TABLE "tour_request" ADD CONSTRAINT "FK_ab97063e4462b50ae79c66ba2af" FOREIGN KEY ("user_details_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_698b726a6fdce0472c1876854bc"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_698b726a6fdce0472c1876854bc" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_1b28d36f03d08b5177eab13820c"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_1b28d36f03d08b5177eab13820c" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_e54d9e3e71a9cc50914f2f61fe5"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "FK_e54d9e3e71a9cc50914f2f61fe5" FOREIGN KEY ("user_details_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_c22819af2bbca819444f4f7aa76"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c22819af2bbca819444f4f7aa76" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_85c5a451fd95da85400e6a182fa"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_c22819af2bbca819444f4f7aa76"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_e54d9e3e71a9cc50914f2f61fe5"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_1b28d36f03d08b5177eab13820c"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT IF EXISTS "FK_698b726a6fdce0472c1876854bc"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_ab97063e4462b50ae79c66ba2af"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_22083f904c2ed5dda60d86e9591"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP CONSTRAINT IF EXISTS "FK_01765cc014cd25794782d5d7e8f"`);

        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "unit_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "property_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "property_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "user_details_id"`);
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP COLUMN IF EXISTS "is_approve"`);

        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "is_unit_occupued"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "paid"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "application_approved"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "already_applied"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_tour"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "requested_to_rent"`);

        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "user_details_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "unit_id"`);
        await queryRunner.query(`ALTER TABLE "tour_request" DROP COLUMN IF EXISTS "property_id"`);
    }
}
