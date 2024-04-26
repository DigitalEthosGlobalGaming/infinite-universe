import { createKysely } from "@vercel/postgres-kysely";
import { ItemCombinationTable } from "./tables/item-combination-table";
import { ItemTable } from "./tables/item-table";

export interface Database {
  item: ItemTable;
  item_combination: ItemCombinationTable;
}

const db = createKysely<Database>();

export function getDatabase() {
  return db;
}
