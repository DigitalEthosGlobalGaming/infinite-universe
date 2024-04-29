import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely";
import path from "path";
import { getDatabase } from "../src/data/database";

export async function migrateDatabase() {
  const migrationsFilder = path.resolve(
    __dirname,
    "../",
    "./src/data/migrations"
  );
  const db = await getDatabase();
  const migratorConfig = {
    db: db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // Path to the folder that contains all your migrations.
      migrationFolder: migrationsFilder,
    }),
  };

  const migrator = new Migrator(migratorConfig);
  const migrated = await migrator.migrateToLatest();

  console.log(migrated);
}

migrateDatabase();
