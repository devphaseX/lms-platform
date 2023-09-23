import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { auth } from '@clerk/nextjs';
import { courses, insertCourse } from '@/db/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { DrizzleError } from 'drizzle-orm';

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
    if (e instanceof ZodError) {
      return new NextResponse(fromZodError(e).message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    if (e instanceof DrizzleError) {
      return new NextResponse('Something went wrong while creating course', {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return new NextResponse('Internal Error', {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
