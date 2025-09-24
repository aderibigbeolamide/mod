import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddRequestCallTable1757901234567 implements MigrationInterface {
  name = "AddRequestCallTable1757901234567";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "request_call",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "phone_number",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "preferred_call_time",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "is_email_overridden",
            type: "boolean",
            default: false,
          },
          {
            name: "is_phone_overridden",
            type: "boolean",
            default: false,
          },
          {
            name: "override_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "processed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "processed_in_batch",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "meta",
            type: "json",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "created_by",
            type: "uuid",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("request_call");
  }
}