import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddUserIdToOtpEntity1728260044138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adding the `user_id` column
        await queryRunner.addColumn('otp', new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: false // set to true if you want to allow null values
        }));

        // Adding a foreign key constraint to the `user_id` column, assuming you have a Users table
        await queryRunner.createForeignKey('otp', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',  // Adjust the table name if necessary
            onDelete: 'CASCADE' // Define what happens when the related user is deleted
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Dropping the foreign key first
        const foreignKey = await queryRunner.getTable('otp').then(table =>
            table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1)
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('otp', foreignKey);
        }

        // Dropping the `user_id` column
        await queryRunner.dropColumn('otp', 'user_id');
    }

}
