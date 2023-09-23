import { createParamValidator } from '@/lib/utils';
import { TypeOf } from 'zod';

const courseIdValidator = createParamValidator({
  paramName: 'courseId',
  isUUID: true,
});

type CourseIdParams = TypeOf<typeof courseIdValidator>;

export { type CourseIdParams, courseIdValidator };
