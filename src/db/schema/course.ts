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
import { Attachments } from './attachment';
import { Category } from './category';
import { createInsertSchema } from 'drizzle-zod';
import { number, pipeline } from 'zod';
import { Chapters } from './chapter';
import { Purchase } from './purchase';

export const Courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('userId', { length: 64 }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  price: decimal('price', { scale: 2 }),
  coursePublished: boolean('course_published').default(false),
  categoryId: uuid('category_id').references(() => Category.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
});

export type Course = typeof Courses.$inferSelect;

export const insertCourse = createInsertSchema(Courses, {
  title: (schema) =>
    schema.title.nonempty({
      message: 'Title is required',
    }),

  imageUrl: (schema) =>
    schema.imageUrl.url({ message: 'Url not a valid address' }),

  description: (schema) =>
    schema.description.nonempty({ message: 'Description cannot be empty' }),
  price: (schema) =>
    pipeline(
      schema.price.nonempty(),
      number({ coerce: true })
        .positive({ message: 'Negative priced value not supported' })
        .transform((value) => value.toFixed(2))
    ),

  categoryId: (schema) =>
    schema.categoryId.uuid({ message: 'Invalid category type' }),
}).pick({
  title: true,
  imageUrl: true,
  price: true,
  description: true,
  categoryId: true,
});

export const courseRelations = relations(Courses, ({ many, one }) => ({
  attachments: many(Attachments),
  category: one(Category, {
    fields: [Courses.categoryId],
    references: [Category.id],
  }),
  chapters: many(Chapters),
  purchased: many(Purchase),
}));
