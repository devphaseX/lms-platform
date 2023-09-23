import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { parsedEnv } from '@/config/env';
import * as schema from '@/db/schema';
const client = neon(parsedEnv.DATABASE_URL);
neonConfig.fetchConnectionCache = true;

declare global {
  var db: ReturnType<typeof drizzle<{}>>;
}

const db = globalThis.db ?? (globalThis.db = drizzle(client, { schema }));

export { db };
