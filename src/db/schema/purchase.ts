import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Courses } from '.';

export const Purchase = pgTable('purchase', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
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

export const PurchaseRelations = relations(Purchase, ({ one }) => ({
  course: one(Courses, {
    fields: [Purchase.courseId],
    references: [Courses.id],
  }),
}));
