import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingNewPaymentTable1754563698609 implements MigrationInterface {
    name = 'AddingNewPaymentTable1754563698609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_media" DROP CONSTRAINT "FK_8f44a07b8e344393e360b2dd808"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_3c324ca49dabde7ffc0ef64675d"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "FK_77ac3dadb9f855a4e76fd1c12d6"`);
        await queryRunner.query(`CREATE TABLE "donation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "amount" integer, "payment_reference" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location_lga" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP CONSTRAINT "UQ_8f44a07b8e344393e360b2dd808"`);
        await queryRunner.query(`ALTER TABLE "property_media" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "invoice_url"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "UQ_77ac3dadb9f855a4e76fd1c12d6"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP COLUMN "paymentRateId"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "agentrate"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "payee_role" "public"."payments_payee_role_enum" NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "access_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "bank_id" character varying`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "tenant_rate" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "property_agent_rate" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "platform_rate" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "propertyFee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD CONSTRAINT "UQ_a00731c2b2d97902d5355b0433b" UNIQUE ("propertyFee_id")`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'INITIALIZED')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum" USING "status"::"text"::"public"."payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'INITIALIZED'`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_status_enum" RENAME TO "transactions_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('TRASFER', 'REFUND', 'PENDING', 'CONFIRMED', 'COMPLETED', 'INITIALIZED', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "public"."transactions_status_enum" USING "status"::"text"::"public"."transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'TRASFER'`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "UQ_464da95dc8a05470b2b158d4df6" UNIQUE ("payment_id")`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407"`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "payee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "UQ_578f581a41d0bc60ac6e7ed6f71" UNIQUE ("property_id")`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_464da95dc8a05470b2b158d4df6" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "FK_578f581a41d0bc60ac6e7ed6f71" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD CONSTRAINT "FK_a00731c2b2d97902d5355b0433b" FOREIGN KEY ("propertyFee_id") REFERENCES "property_fee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP CONSTRAINT "FK_a00731c2b2d97902d5355b0433b"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "FK_578f581a41d0bc60ac6e7ed6f71"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "UQ_578f581a41d0bc60ac6e7ed6f71"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD "property_id" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "payee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_0407b57b1cedc9c3a0a1ed61407" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "UQ_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum_old" AS ENUM('TRASFER', 'REFUND', 'PENDING')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "public"."transactions_status_enum_old" USING "status"::"text"::"public"."transactions_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'TRASFER'`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_status_enum_old" RENAME TO "transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_464da95dc8a05470b2b158d4df6" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum_old" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum_old" USING "status"::"text"::"public"."payments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED'`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_status_enum_old" RENAME TO "payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP CONSTRAINT "UQ_a00731c2b2d97902d5355b0433b"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "propertyFee_id"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "platform_rate"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "property_agent_rate"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" DROP COLUMN "tenant_rate"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "bank_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "access_code"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "payee_role"`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "agentrate" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paymentRates" ADD "rate" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD "paymentRateId" uuid`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "UQ_77ac3dadb9f855a4e76fd1c12d6" UNIQUE ("paymentRateId")`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "invoice_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "payment_method" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "transaction_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD CONSTRAINT "UQ_8f44a07b8e344393e360b2dd808" UNIQUE ("property_id")`);
        await queryRunner.query(`ALTER TABLE "location_lga" ADD "state" character varying`);
        await queryRunner.query(`DROP TABLE "donation"`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "FK_77ac3dadb9f855a4e76fd1c12d6" FOREIGN KEY ("paymentRateId") REFERENCES "paymentRates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_3c324ca49dabde7ffc0ef64675d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_media" ADD CONSTRAINT "FK_8f44a07b8e344393e360b2dd808" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
