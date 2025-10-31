import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSignatureTrackingFields1762000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'request_to_rent',
            new TableColumn({
                name: 'landlord_signed_at',
                type: 'timestamp',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'request_to_rent',
            new TableColumn({
                name: 'landlord_signed_by_ip',
                type: 'character varying',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'request_to_rent',
            new TableColumn({
                name: 'tenant_signed_by_ip',
                type: 'character varying',
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('request_to_rent', 'tenant_signed_by_ip');
        await queryRunner.dropColumn('request_to_rent', 'landlord_signed_by_ip');
        await queryRunner.dropColumn('request_to_rent', 'landlord_signed_at');
    }
}
