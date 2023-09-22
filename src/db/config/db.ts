import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { parsedEnv } from '@/config/env';
import * as schema from '@/db/schema';
const client = postgres(parsedEnv.DATABASE_URL, { max: 1, ssl: 'require' });

declare global {
  var db: ReturnType<typeof drizzle<{}>>;
}

const db = globalThis.db ?? (globalThis.db = drizzle(client, { schema }));

export { db };
