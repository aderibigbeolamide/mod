import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntitiesUpdates1729986586125 implements MigrationInterface {
    name = 'PaymentEntitiesUpdates1729986586125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paymentRates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" numeric(5,2) NOT NULL, "agentrate" numeric(5,2) NOT NULL, "range" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_988dcc0dfd2907c44b3b0fb0d82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('TRASFER', 'REFUND', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "status" "public"."transactions_status_enum" DEFAULT 'TRASFER', "reference" character varying NOT NULL, "invoice_url" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "request_to_rent_id" uuid NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "status" "public"."payments_status_enum" DEFAULT 'CONFIRMED', "reference" character varying NOT NULL, "payment_method" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "payer_id" uuid NOT NULL, "payee_id" uuid NOT NULL, "transaction_id" uuid NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD "paymentRateId" uuid`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "UQ_77ac3dadb9f855a4e76fd1c12d6" UNIQUE ("paymentRateId")`);
        await queryRunner.query(`ALTER TABLE "property_fee" ADD CONSTRAINT "FK_77ac3dadb9f855a4e76fd1c12d6" FOREIGN KEY ("paymentRateId") REFERENCES "paymentRates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_580868f80b87cbbe8b1161eeed1" FOREIGN KEY ("request_to_rent_id") REFERENCES "request_to_rent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_02f8e8d4094492641ad95010ca1" FOREIGN KEY ("payer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3" FOREIGN KEY ("payee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_3c324ca49dabde7ffc0ef64675d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_3c324ca49dabde7ffc0ef64675d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_10578ef284a65afc54fb7c5aea3"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_02f8e8d4094492641ad95010ca1"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_580868f80b87cbbe8b1161eeed1"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "FK_77ac3dadb9f855a4e76fd1c12d6"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP CONSTRAINT "UQ_77ac3dadb9f855a4e76fd1c12d6"`);
        await queryRunner.query(`ALTER TABLE "property_fee" DROP COLUMN "paymentRateId"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TABLE "paymentRates"`);
    }

}
