import { courses, insertCourse } from '@/db/schema';
import { createParamValidator } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { DrizzleError, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { TypeOf, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const paramValidator = createParamValidator({
  paramName: 'courseId',
  isUUID: true,
});

type CourseIdParams = TypeOf<typeof paramValidator>;

export async function PATCH(
  req: Request,
  { params }: { params: CourseIdParams }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!paramValidator.safeParse(params).success) {
      return new NextResponse("Provided course id isn't valid uuid", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const { courseId } = params;

    const data = insertCourse.deepPartial().parse(await req.json());
    const updatedCourse = await db
      .update(courses)
      .set({ ...data })
      .where(
        sql`${courses.id} = ${courseId} AND ${courses.userId} = ${userId}`
      );

    return NextResponse.json(updatedCourse);
  } catch (e) {
    if (e instanceof DrizzleError) {
      return new NextResponse('Encounter an error while updating course', {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    if (e instanceof ZodError) {
      return new NextResponse(fromZodError(e).message, {
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    return new NextResponse('Internal Error', {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
