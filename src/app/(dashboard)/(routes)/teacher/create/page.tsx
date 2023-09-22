'use client';
import { TypeOf, object, string } from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Course } from '@/db/schema';

const courseFormSchema = object({
  title: string().nonempty({ message: 'Title is required' }),
});

type CourseFormData = TypeOf<typeof courseFormSchema>;
const CreateCoursePage = () => {
  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
    },
  });

  const router = useRouter();
  const { isLoading: submittingForm, isValid } = courseForm.formState;

  const onSubmit = courseForm.handleSubmit(async (formData) => {
    try {
      const response = await axios.post<Course>('/api/courses', formData);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success('Course created');
    } catch (e) {
      toast.error('Something went wrong');
    }
  });
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don't worry, you can change
          this later
        </p>
        <Form {...courseForm}>
          <form onSubmit={onSubmit} className="space-y-8 mt-8">
            <FormField
              control={courseForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={submittingForm}
                      placeholder="e.g 'Advance web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost" disabled={submittingForm}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || submittingForm}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
