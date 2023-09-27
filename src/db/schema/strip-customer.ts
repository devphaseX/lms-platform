import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Courses } from '.';

export const StripCustomer = pgTable('strip_customer', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
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

export const StripCustomerRelations = relations(StripCustomer, ({ one }) => ({
  course: one(Courses, {
    fields: [StripCustomer.courseId],
    references: [Courses.id],
  }),
}));
