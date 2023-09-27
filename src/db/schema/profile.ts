import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const Profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
});
