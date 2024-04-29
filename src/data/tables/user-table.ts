import { GeneratedAlways } from "kysely";
import { TableRecord } from "../base-table";

export type UserTable = {
  id: GeneratedAlways<string>;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  roles?: string;
};

export type UserTableRecord = TableRecord<UserTable>;
