import { GeneratedAlways } from "kysely";

export type SessionTable = {
  id: GeneratedAlways<string>;
  userId: string;
  sessionToken: string;
  expires: Date;
};
