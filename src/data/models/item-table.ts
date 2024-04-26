
  // This interface describes the `person` table to Kysely. Table
  // interfaces should only be used in the `Database` type above
  // and never as a result type of a query!. See the `Person`,

import { ColumnType, Generated } from "kysely"
import { BaseTable } from "../base-table"

  // `NewPerson` and `PersonUpdate` types below.
  export interface ItemTable extends BaseTable {
    name: string;
    description: string;
  }