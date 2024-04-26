import { ColumnType } from "kysely";
import { PrimaryKey } from "./fields";

export interface BaseTable {
  id: PrimaryKey;
  created_at: ColumnType<Date, string | undefined, never>;
  modified_at: ColumnType<Date, string | undefined, never>;
  active: ColumnType<boolean, boolean, boolean>;
}

// Create a new type that takes a T type and any fields that have ColumnType in them have their type extracted
// Make it iterate through the types and return a single type with all the extracted types
export type TableRecord<T> = {
  [K in keyof T]: T[K] extends ColumnType<infer U, any, any> ? U : never;
};
