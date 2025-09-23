import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestToRentReferenceEmail1754565394851 implements MigrationInterface {
    name = 'RequestToRentReferenceEmail1754565394851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" DROP CONSTRAINT "UQ_850c54de5ba0aeb90c4e862bf0a"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_to_rent" ADD CONSTRAINT "UQ_850c54de5ba0aeb90c4e862bf0a" UNIQUE ("referee_email")`);
    }

}
