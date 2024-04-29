import { createKysely } from "@vercel/postgres-kysely";
import { ItemCombinationTable } from "./tables/item-combination-table";
import { ItemTable } from "./tables/item-table";
import { UserTable } from "./tables/user-table";
import { SessionTable } from "./tables/session-table";
import { AccountTable } from "./tables/account-table";
import { VerificationTokenTable } from "./tables/verification-token-table";

export interface Database {
  item: ItemTable;
  item_combination: ItemCombinationTable;
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification_token: VerificationTokenTable;
}

const db = createKysely<Database>();

export function getDatabase() {
  return db;
}
