import { CreateTableBuilder, Kysely, sql } from "kysely";

function createDefaultTable(tableBuilder: CreateTableBuilder<string, any>) {
  return tableBuilder
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("modified_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    );
}

export async function up(db: Kysely<any>): Promise<void> {
  await createDefaultTable(db.schema.createTable("item"))
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("description", "text")
    .execute();

  await createDefaultTable(db.schema.createTable("item_combination"))
    .addColumn("first_item_id", "integer", (col) =>
      col.references("item.id").onDelete("cascade").notNull()
    )
    .addColumn("second_item_id", "integer", (col) =>
      col.references("item.id").onDelete("cascade").notNull()
    )
    .addColumn("result_item_id", "integer", (col) =>
      col.references("item.id").onDelete("cascade").notNull()
    )
    .execute();

  await db.schema
    .createIndex("item_combination_first_item_id_index")
    .on("item_combination")
    .column("first_item_id")
    .execute();
  await db.schema
    .createIndex("item_combination_second_item_id_index")
    .on("item_combination")
    .column("second_item_id")
    .execute();
  await db.schema
    .createIndex("item_combination_result_item_id_index")
    .on("item_combination")
    .column("result_item_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("item_combination").execute();

  await db.schema.dropTable("item").execute();
}
