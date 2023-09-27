import { redirect } from 'next/navigation';
import { CourseIdParams, courseIdValidator } from './__params';
import { auth } from '@clerk/nextjs';
import {
  Attachment,
  Course,
  Attachments,
  Category,
  Courses,
} from '@/db/schema';
import { asc, sql } from 'drizzle-orm';
import { IconBadge } from '@/components/icon-badge';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import { TitleForm } from './__components/title-form';
import { DescriptionForm } from './__components/description-form';
import { ImageUploadForm } from './__components/image-form';
import { CategoryForm } from './__components/category-form';
import { PriceForm } from './__components/price-form';
import { AttachmentForm } from './__components/attachment-form';
import { alias } from 'drizzle-orm/pg-core';

interface CourseIdPageProps {
  params: CourseIdParams;
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  if (!courseIdValidator.safeParse(params).success) {
    return redirect('/teacher/courses/');
  }

  const { userId } = auth();
  if (!userId) return redirect('/');

  const c1 = alias(Courses, 'c1');
  const [course] = await db
    .select({
      id: c1.id,
      title: c1.title,
      userId: c1.userId,
      description: c1.description,
      imageUrl: c1.imageUrl,
      price: c1.price,
      coursePublished: c1.coursePublished,
      categoryId: c1.categoryId,
      createdAt: c1.createdAt,
      updatedAt: c1.updatedAt,
      attachments: sql<Array<Attachment>>`
      COALESCE(
        (SELECT json_agg(${Attachments}) FROM ${Attachments} WHERE ${Attachments.courseId} =  c1.id),
        '[]'::json
      )`,
    })
    .from(c1)
    .where(sql`${c1.userId} = ${userId} AND ${c1.id} = ${params.courseId}`);

  if (!course) return redirect('/');

  const requiredFields = [
    'title',
    'description',
    'imageUrl',
    'price',
    'categoryId',
  ] as const satisfies Array<keyof Course>;

  const completedField = requiredFields.filter((key) => {
    const value = course[key];
    return !(value === null || value.trim() === '');
  });

  const completeRatioMessage = `${completedField.length}/${requiredFields.length}`;

  const categories = await db
    .select({ label: Category.name, value: Category.id })
    .from(Category)
    .orderBy(asc(Category.name));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields ({completeRatioMessage})
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageUploadForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <div>TODO CHAPTER</div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
