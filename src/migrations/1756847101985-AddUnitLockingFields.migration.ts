import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitLockingFields1756847101985 implements MigrationInterface {
  name = 'AddUnitLockingFields1756847101985'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add locking fields to unit table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'unit' AND column_name = 'is_locked'
        ) THEN
          ALTER TABLE "unit" ADD COLUMN "is_locked" boolean NOT NULL DEFAULT false;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'unit' AND column_name = 'locked_by'
        ) THEN
          ALTER TABLE "unit" ADD COLUMN "locked_by" character varying;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'unit' AND column_name = 'lock_expires_at'
        ) THEN
          ALTER TABLE "unit" ADD COLUMN "lock_expires_at" TIMESTAMP WITH TIME ZONE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'unit' AND column_name = 'is_paid'
        ) THEN
          ALTER TABLE "unit" ADD COLUMN "is_paid" boolean NOT NULL DEFAULT false;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'unit' AND column_name = 'paid_until'
        ) THEN
          ALTER TABLE "unit" ADD COLUMN "paid_until" TIMESTAMP WITH TIME ZONE;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "paid_until"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "is_paid"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "lock_expires_at"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "locked_by"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN IF EXISTS "is_locked"`);
  }
}