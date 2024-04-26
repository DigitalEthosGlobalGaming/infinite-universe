import { BaseTable, TableRecord } from "../base-table";
import { getDatabase } from "../database";

// `NewPerson` and `PersonUpdate` types below.
export type ItemTable = BaseTable & {
  name: string;
  description: string;
};

export type ItemTableRecord = TableRecord<ItemTable>;

export function toValidItemName(name: string) {
  // Make name only letters, numbers, space, and hyphen
  name = name
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replaceAll("  ", " ")
    .trim();
  if (name.length < 1) {
    throw new Error("Name must be at least 1 character long");
  }
  return name;
}

export function toValidDescription() {}
export async function getItemByName(name: string) {
  name = toValidItemName(name);
  const db = await getDatabase();
  const results = await db
    .selectFrom("item")
    .selectAll()
    .where((eb) =>
      eb(eb.fn("lower", ["item.name"]), "=", name.toLowerCase().trim())
    )
    .execute();

  return results[0] as ItemTableRecord;
}

export async function getItemTableRecordById(id: number) {
  const db = await getDatabase();
  const results = await db
    .selectFrom("item")
    .selectAll()
    .where((eb) => eb("item.id", "=", id))
    .execute();

  return results[0] as ItemTableRecord;
}
export async function createItem(item: {
  name: string;
  description?: string;
}): Promise<ItemTableRecord> {
  item.name = toValidItemName(item.name);

  const db = await getDatabase();
  const existingRecord = await getItemByName(item.name);
  if (existingRecord != null) {
    return existingRecord;
  }
  const insertResults = await db
    .insertInto("item")
    .returningAll()
    .values([
      {
        name: item.name,
        description: item?.description ?? "",
        active: true,
      },
    ])
    .execute();

  return insertResults[0] as ItemTableRecord;
}
