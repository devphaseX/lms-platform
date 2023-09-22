import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  uuid,
  varchar,
  decimal,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { attachments } from './attachment';
import { category } from './category';
import { createInsertSchema } from 'drizzle-zod';

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('userId', { length: 64 }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  price: decimal('price', { scale: 2 }),
  coursePublished: boolean('course_published').default(false),
  categoryId: uuid('category_id').references(() => category.id),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
});

export type Course = typeof courses.$inferSelect;

export const insertCourse = createInsertSchema(courses).pick({
  title: true,
  imageUrl: true,
  price: true,
  description: true,
});

export const courseRelations = relations(courses, ({ many, one }) => ({
  attachments: many(attachments),
  category: one(category),
}));
