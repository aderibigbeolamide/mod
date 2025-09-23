import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentPropertyId1736566228858 implements MigrationInterface {
    name = 'PaymentPropertyId1736566228858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the 'property_id' column exists before adding it
        const columnExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'property_id'
        `);
        
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "payments" ADD "property_id" uuid`);
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

        // Check if the foreign key constraint 'FK_c22819af2bbca819444f4f7aa76' exists before adding it
        const fkConstraintPropertyExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_c22819af2bbca819444f4f7aa76'
        `);

        if (fkConstraintPropertyExists.length === 0) {
            await queryRunner.query(`
                ALTER TABLE "payments" ADD CONSTRAINT "FK_c22819af2bbca819444f4f7aa76" 
                FOREIGN KEY ("property_id") 
                REFERENCES "property"("id") 
                ON DELETE NO ACTION 
                ON UPDATE NO ACTION
            `);
        }

        // Check if the foreign key constraint 'FK_85c5a451fd95da85400e6a182fa' exists before adding it back
        const fkConstraintUnitExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
        `);

        if (fkConstraintUnitExists.length === 0) {
            await queryRunner.query(`
                ALTER TABLE "payments" ADD CONSTRAINT "FK_85c5a451fd95da85400e6a182fa" 
                FOREIGN KEY ("unit_id") 
                REFERENCES "unit"("id") 
                ON DELETE NO ACTION 
                ON UPDATE NO ACTION
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if the foreign key constraint 'FK_85c5a451fd95da85400e6a182fa' exists before dropping it
        const fkConstraintUnitExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_85c5a451fd95da85400e6a182fa'
        `);

        if (fkConstraintUnitExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_85c5a451fd95da85400e6a182fa"`);
        }

        // Check if the foreign key constraint 'FK_c22819af2bbca819444f4f7aa76' exists before dropping it
        const fkConstraintPropertyExists = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'payments' AND constraint_name = 'FK_c22819af2bbca819444f4f7aa76'
        `);

        if (fkConstraintPropertyExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_c22819af2bbca819444f4f7aa76"`);
        }

        // Check if the 'unit_id' column is nullable before altering it
        const unitColumnNullable = await queryRunner.query(`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'payments' AND column_name = 'unit_id'
        `);

        if (unitColumnNullable[0].is_nullable === 'YES') {
            await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "unit_id" SET NOT NULL`);
        }

        // Check if the 'property_id' column exists before dropping it
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

