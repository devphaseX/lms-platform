import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { auth } from '@clerk/nextjs';
import { courses, insertCourse } from '@/db/schema';

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const { title } = insertCourse.parse(await req.json());

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const [course] = await db
      .insert(courses)
      .values({ userId, title })
      .returning();
    return NextResponse.json(course);
  } catch (e) {
    console.log('[COURSES]', e);
    return new NextResponse('Internal Error', {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
