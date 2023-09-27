import { Attachments, Courses } from '@/db/schema';
import { createParamValidator } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { DrizzleError, and, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { TypeOf, ZodError, object, string } from 'zod';
import { fromZodError } from 'zod-validation-error';

const paramValidator = createParamValidator({
  paramName: 'courseId',
  isUUID: true,
}).and(
  createParamValidator({
    paramName: 'attachmentId',
    isUUID: true,
  })
);

type CourseIdParams = TypeOf<typeof paramValidator>;

export async function DELETE(
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

    const { courseId, attachmentId } = params;

    const c1 = alias(Courses, 'c1');
    const [neededCourse] = await db
      .select({
        id: c1.id,
        title: c1.title,
        userId: c1.userId,
        toBeDeleteAttachment: Attachments,
        currentUserOwnedCourse: sql<boolean>`
            CASE
                WHEN ${c1.userId} = ${userId} THEN true::BOOLEAN
                ELSE false::BOOLEAN
            END
        `,
      })
      .from(c1)
      .where(sql`${c1.id} = ${courseId}`)
      .leftJoin(
        Attachments,
        and(
          eq(Attachments.id, attachmentId),
          eq(Attachments.courseId, courseId)
        )
      );

    if (!neededCourse) {
      return new NextResponse('Course not found', {
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (!neededCourse.currentUserOwnedCourse) {
      return new NextResponse('Forbidden', { status: StatusCodes.FORBIDDEN });
    }

    if (!neededCourse.toBeDeleteAttachment) {
      return new NextResponse('Attachment not found', {
        status: StatusCodes.NOT_FOUND,
      });
    }

    await db.delete(Attachments).where(eq(Attachments.id, attachmentId));

    return new NextResponse(
      `Attachment: ${neededCourse.toBeDeleteAttachment.name} removed`
    );
  } catch (e) {
    console.log('[POST ATTACHMENT]', e);
    if (e instanceof DrizzleError) {
      return new NextResponse('Encounter an error while deleting attachment', {
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
