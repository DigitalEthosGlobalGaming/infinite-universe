import { GeneratedAlways } from "kysely";

export type VerificationTokenTable = {
  identifier: string;
  token: string;
  expires: Date;
};
