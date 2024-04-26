import { ItemCombinationTable } from "./models/item-combination-table";
import { ItemTable } from "./models/item-table"

export interface Database {
    item: ItemTable;
    item_combination: ItemCombinationTable;
  }
  