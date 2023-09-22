import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { parsedEnv } from '@/config/env';
import { migrationFolderPath } from './constant';

const client = postgres(parsedEnv.DATABASE_URL, { max: 1, ssl: true });
const db = drizzle(client);

void (async () => {
  try {
    await migrate(db, {
      migrationsFolder: migrationFolderPath,
    });
    console.log('Migration completed');
    process.exit(0);
  } catch (e) {
    console.log('Migration failed');
    console.log(
      Object(e) === e ? (e as { message: string })?.message : String(e)
    );
    process.exit(1);
  }
})();
