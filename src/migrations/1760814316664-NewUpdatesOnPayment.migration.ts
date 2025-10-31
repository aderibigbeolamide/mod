import { MigrationInterface, QueryRunner } from "typeorm";

export class SafeNumericAmountMigration1760814316664 implements MigrationInterface {
    name = 'SafeNumericAmountMigration1760814316664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1️⃣ Add temporary numeric column
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD COLUMN "amount_temp" numeric(12,2)
        `);

        // 2️⃣ Copy existing data (use 0 for any nulls)
        await queryRunner.query(`
            UPDATE "payments"
            SET "amount_temp" = COALESCE("amount", 0)
        `);

        // 3️⃣ Drop old column
        await queryRunner.query(`
            ALTER TABLE "payments"
            DROP COLUMN "amount"
        `);

        // 4️⃣ Rename temp column to amount
        await queryRunner.query(`
            ALTER TABLE "payments"
            RENAME COLUMN "amount_temp" TO "amount"
        `);

        // 5️⃣ Make sure column is NOT NULL
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "amount" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse the process safely
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD COLUMN "amount_old" integer
        `);

        await queryRunner.query(`
            UPDATE "payments"
            SET "amount_old" = FLOOR("amount")
        `);

        await queryRunner.query(`
            ALTER TABLE "payments"
            DROP COLUMN "amount"
        `);

        await queryRunner.query(`
            ALTER TABLE "payments"
            RENAME COLUMN "amount_old" TO "amount"
        `);

        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "amount" SET NOT NULL
        `);
    }
}
