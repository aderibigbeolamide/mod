import { MigrationInterface, QueryRunner } from "typeorm";

export class GetPaymentUser1736534018557 implements MigrationInterface {
    name = 'GetPaymentUser1736534018557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the 'property_id' column exists before adding it
        const columnExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'property_id'
        `);
        
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "payments" ADD "property_id" uuid NOT NULL`);
        }

        // Check if the foreign key constraint 'FK_85c5a451fd95da85400e6a182fa' exists before dropping it
        const fkConstraintExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
        `);

        if (fkConstraintExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"`);
        }

        // Check if the 'unit_id' column is nullable before altering it
        const unitColumnNullable = await queryRunner.query(`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'unit_id'
        `);

        if (unitColumnNullable[0].is_nullable === 'NO') {
            await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" DROP NOT NULL`);
        }

        // Add the foreign key constraint 'FK_85c5a451fd95da85400e6a182fa' only if it doesn't exist
        const fkConstraintUnitExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
        `);

        if (fkConstraintUnitExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }

        // Add the foreign key constraint 'FK_c22819af2bbca819444f4f7aa76' for 'property_id'
        const fkConstraintPropertyExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_c22819af2bbca819444f4f7aa76'
        `);

        if (fkConstraintPropertyExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_c22819af2bbca819444f4f7aa76" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the foreign key constraint 'FK_c22819af2bbca819444f4f7aa76' if it exists
        const fkConstraintPropertyExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_c22819af2bbca819444f4f7aa76'
        `);

        if (fkConstraintPropertyExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c22819af2bbca819444f4f7aa76"`);
        }

        // Remove the foreign key constraint 'FK_85c5a451fd95da85400e6a182fa' if it exists
        const fkConstraintUnitExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
        `);

        if (fkConstraintUnitExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"`);
        }

        // Revert the 'unit_id' column to NOT NULL if it was previously NOT NULL
        const unitColumnNullable = await queryRunner.query(`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'unit_id'
        `);

        if (unitColumnNullable[0].is_nullable === 'YES') {
            await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" SET NOT NULL`);
        }

        // Drop the 'property_id' column if it exists
        const columnExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'property_id'
        `);

        if (columnExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "property_id"`);
        }
    }
}
