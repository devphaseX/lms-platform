import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { muxData } from './mux-data';
import { Courses } from '.';

export const Chapters = pgTable('purchase', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 64 }).notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  position: integer('position').notNull(),
  published: boolean('published').default(false).notNull(),
  isFree: boolean('is_free').default(false).notNull(),
  courseId: uuid('course_id')
    .references(() => Courses.id, { onDelete: 'cascade' })
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

export const chapterRelations = relations(Chapters, ({ one }) => ({
  muxData: one(muxData, {
    fields: [Chapters.id],
    references: [muxData.chapterId],
  }),

  course: one(Courses, {
    fields: [Chapters.courseId],
    references: [Courses.id],
  }),
}));
