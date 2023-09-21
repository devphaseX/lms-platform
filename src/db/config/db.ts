import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { parsedEnv } from '@/config/env';

const client = postgres(parsedEnv.DATABASE_URL, { max: 1 });

declare global {
  var db: ReturnType<typeof drizzle<{}>>;
}

const db = globalThis.db ?? (globalThis.db = drizzle(client));

export { db };
