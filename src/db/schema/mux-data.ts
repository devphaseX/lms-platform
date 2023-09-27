import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Chapters } from './chapter';
import { relations } from 'drizzle-orm';

export const muxData = pgTable('muxData', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id')
    .references(() => Chapters.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  assetId: uuid('asset_id')
    .references(() => Chapters.id, { onDelete: 'cascade' })
    .notNull(),
  playbackId: uuid('playback_id')
    .references(() => Chapters.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
});

export const muxDataRelations = relations(muxData, ({ one }) => ({
  chapter: one(Chapters, {
    fields: [muxData.chapterId],
    references: [Chapters.id],
  }),
}));
