import { MigrationInterface, QueryRunner } from "typeorm";

export class WishListAndContactRequest1695862729844 implements MigrationInterface {
    name = 'WishListAndContactRequest1695862729844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "fullname" character varying, "email" character varying, "phone_number" character varying, "topic" character varying, "message" character varying, CONSTRAINT "PK_d74ea9b4efcf950e4f98d14b173" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "waitlist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "meta" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "email" character varying NOT NULL, CONSTRAINT "PK_eef8388d650efa57e5eb3b30621" PRIMARY KEY ("id", "email"))`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "property_tour_availability_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "property_tour_availability_id" character varying`);
        await queryRunner.query(`DROP TABLE "waitlist"`);
        await queryRunner.query(`DROP TABLE "contact_request"`);
    }

}
