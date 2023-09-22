import { parsedEnv } from './src/config/env';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: parsedEnv.DATABASE_URL,
    ssl: true,
  },
} satisfies Config;
