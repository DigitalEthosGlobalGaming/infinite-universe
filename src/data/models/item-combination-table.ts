import { BaseTable } from "../base-table"
import { ForeignKey } from "../fields";

  // `NewPerson` and `PersonUpdate` types below.
  export interface ItemCombinationTable extends BaseTable {
    first_item_id: ForeignKey;
    second_item_id: ForeignKey;
    result_item_id: ForeignKey;
  }