import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { Chapters } from './chapter';

export const CourseProgress = pgTable(
  'course_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    chapterId: uuid('chapter_id')
      .references(() => Chapters.id, { onDelete: 'cascade' })
      .notNull(),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true,
    }).defaultNow(),
  },
  ({ chapterId, userId }) => ({
    uniq: unique('chapter_course_progress').on(userId, chapterId),
  })
);

export const CourseProgressRelations = relations(CourseProgress, ({ one }) => ({
  chapter: one(Chapters, {
    fields: [CourseProgress.chapterId],
    references: [Chapters.id],
  }),
}));
