import { Expression, SqlBool } from "kysely";
import { BaseTable, TableRecord } from "../base-table";
import { getDatabase } from "../database";
import { ForeignKey } from "../fields";
import { ItemTableRecord } from "./item-table";

// `NewPerson` and `PersonUpdate` types below.
export interface ItemCombinationTable extends BaseTable {
  first_item_id: ForeignKey;
  second_item_id: ForeignKey;
  result_item_id: ForeignKey;
}

export type ItemCombinationTableRecord = TableRecord<ItemCombinationTable>;

export async function getExistingItemCombination(
  item1Id: number,
  item2Id: number
) {
  const db = await getDatabase();
  const dbResult = db
    .selectFrom("item_combination")
    .selectAll()
    .where((eb) => {
      const ors: Expression<SqlBool>[] = [];
      ors.push(
        eb("first_item_id", "=", item1Id).and("second_item_id", "=", item2Id)
      );
      ors.push(
        eb("first_item_id", "=", item2Id).and("second_item_id", "=", item1Id)
      );
      return eb.or(ors);
    });
  const item = (await dbResult.executeTakeFirst()) ?? (null as any);
  return item;
}

export async function createItemCombination(item: {
  first_item_id: number;
  second_item_id: number;
  result_item_id: number;
}): Promise<ItemCombinationTableRecord> {
  const existingCombination = await getExistingItemCombination(
    item.first_item_id,
    item.second_item_id
  );
  if (existingCombination != null) {
    if (existingCombination.result_item_id === item.result_item_id) {
      return existingCombination;
    }
    throw new Error("Combination for first and second item already exists");
  }

  const db = await getDatabase();
  const insertResults = await db
    .insertInto("item_combination")
    .returningAll()
    .values([
      {
        first_item_id: item.first_item_id,
        second_item_id: item.second_item_id,
        result_item_id: item.result_item_id,
        active: true,
      },
    ])
    .execute();

  return insertResults[0] as any;
}

type Combination = {
  id: string;
  item1: ItemTableRecord;
  item2: ItemTableRecord;
  result: ItemTableRecord;
  combination: ItemCombinationTableRecord;
};

export async function getAllCombinations() {
  const db = await getDatabase();
  const itemsMap = new Map<number, ItemTableRecord>();
  const items = (await db
    .selectFrom("item")
    .selectAll()
    .execute()) as ItemTableRecord[];

  for (const item of items) {
    itemsMap.set(item.id, item);
  }

  const combinations: Record<string, Combination> = {};

  const itemCombinations = (await db
    .selectFrom("item_combination")
    .selectAll()
    .execute()) as ItemCombinationTableRecord[];

  for (const itemCombination of itemCombinations) {
    let item1Id = itemCombination.first_item_id;
    let item2Id = itemCombination.second_item_id;
    if (item1Id < item2Id) {
      const temp = item1Id;
      item1Id = item2Id;
      item2Id = temp;
    }
    const item1 = itemsMap.get(item1Id);
    const item2 = itemsMap.get(item2Id);
    const result = itemsMap.get(itemCombination.result_item_id);
    if (item1 == null || item2 == null || result == null) {
      continue;
    }
    const key = `${item1Id}-${item2Id}`;
    if (combinations[key] == null) {
      combinations[key] = {
        id: key,
        item1: item1,
        item2: item2,
        result: result,
        combination: itemCombination,
      };
    }
  }
  return Object.values(combinations);
}
