import { getDatabase } from "@/data/database";
import { SqliteAdapter } from "kysely";

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value));
}

export const format = {
  from<T>(object?: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (isDate(value)) newObject[key] = new Date(value);
      else newObject[key] = value;
    }
    return newObject as T;
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value;
    return newObject as T;
  },
};

import type { Adapter } from "@auth/core/adapters";

export function KyselyAdapter(): Adapter {
  const db = getDatabase();
  const { adapter } = db.getExecutor();
  const { supportsReturning } = adapter;
  const isSqlite = adapter instanceof SqliteAdapter;
  /** If the database is SQLite, turn dates into an ISO string  */
  const to = isSqlite ? format.to : <T>(x: T) => x as T;
  /** If the database is SQLite, turn ISO strings into dates */
  const from = isSqlite ? format.from : <T>(x: T) => x as T;
  return {
    async createUser(data) {
      const user = { ...data, id: crypto.randomUUID() };
      await db.insertInto("user").values(to(user)).executeTakeFirstOrThrow();
      return user;
    },
    async getUser(id) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByEmail(email) {
      const result = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom("user")
        .innerJoin("account", "user.id", "account.userId")
        .selectAll("user")
        .where("account.providerAccountId", "=", providerAccountId)
        .where("account.provider", "=", provider)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async updateUser({ id, ...user }) {
      const userData = to(user);
      const query = db.updateTable("user").set(userData).where("id", "=", id);
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() =>
              db
                .selectFrom("user")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirstOrThrow()
            );
      return from(await result);
    },
    async deleteUser(userId) {
      await db
        .deleteFrom("user")
        .where("user.id", "=", userId)
        .executeTakeFirst();
    },
    async linkAccount(account) {
      await db
        .insertInto("account")
        .values(to(account))
        .executeTakeFirstOrThrow();
      return account;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom("account")
        .where("account.providerAccountId", "=", providerAccountId)
        .where("account.provider", "=", provider)
        .executeTakeFirstOrThrow();
    },
    async createSession(session) {
      await db.insertInto("session").values(to(session)).execute();
      return session;
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom("session")
        .innerJoin("user", "user.id", "session.userId")
        .selectAll("user")
        .select(["session.expires", "session.userId"])
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirst();
      if (!result) return null;
      const { userId, expires, ...user } = result;
      const session = { sessionToken, userId, expires };
      return { user: from(user), session: from(session) };
    },
    async updateSession(session) {
      const sessionData = to(session);
      const query = db
        .updateTable("session")
        .set(sessionData)
        .where("session.sessionToken", "=", session.sessionToken);
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("session")
              .selectAll()
              .where("session.sessionToken", "=", sessionData.sessionToken)
              .executeTakeFirstOrThrow();
          });
      return from(result);
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("session")
        .where("session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow();
    },
    async createVerificationToken(data) {
      await db.insertInto("verification_token").values(to(data)).execute();
      return data;
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("verification_token")
        .where("verification_token.token", "=", token)
        .where("verification_token.identifier", "=", identifier);

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom("verification_token")
            .selectAll()
            .where("token", "=", token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst();
              return res;
            });
      if (!result) return null;
      return from(result);
    },
  };
}
