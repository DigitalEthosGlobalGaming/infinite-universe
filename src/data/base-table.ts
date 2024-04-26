import { ColumnType } from "kysely"
import { PrimaryKey } from "./fields";

  export interface BaseTable {
    id: PrimaryKey;
    created_at: ColumnType<Date, string | undefined, never>
    modified_at: ColumnType<Date, string | undefined, never>
    active: ColumnType<boolean>  
  }