import { redirect } from 'next/navigation';
import { CourseIdParams, courseIdValidator } from './__params';
import { auth } from '@clerk/nextjs';
import { Course, courses } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import { TitleForm } from './__components/title-form';

interface CourseIdPageProps {
  params: CourseIdParams;
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  if (!courseIdValidator.safeParse(params).success) {
    return redirect('/teacher/courses/');
  }

  const { userId } = auth();
  if (!userId) return redirect('/');

  const [course] = await db
    .select()
    .from(courses)
    .where(
      sql`${courses.userId} = ${userId} AND ${courses.id} = ${params.courseId}`
    );

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
        <div className="flex items-center gap-x-2">
          <IconBadge icon={LayoutDashboard} />
          <h2 className="text-xl">Customize your course</h2>
        </div>
        <TitleForm initialData={course} courseId={course.id} />
      </div>
    </div>
  );
};

export default CourseIdPage;
