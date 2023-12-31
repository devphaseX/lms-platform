import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Courses } from '.';
import { relations } from 'drizzle-orm';

export const Attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 64 }).notNull(),
  url: text('url').notNull(),
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

export const AttachmentRelations = relations(Attachments, ({ one }) => ({
  course: one(Courses, {
    fields: [Attachments.courseId],
    references: [Courses.id],
  }),
}));

export type Attachment = typeof Attachments.$inferSelect;
