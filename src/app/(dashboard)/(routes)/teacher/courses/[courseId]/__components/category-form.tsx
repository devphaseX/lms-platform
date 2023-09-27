'use client';

import { Course, insertCourse } from '@/db/schema';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TypeOf } from 'zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combox-box';

const categoryForm = insertCourse.pick({ categoryId: true }).required();
type CategoryForm = TypeOf<typeof categoryForm>;

interface CategoryFormProps {
  initialData: Pick<Course, 'categoryId'>;
  options: { label: string; value: string }[];
  courseId: Course['id'];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  courseId,
  initialData,
  options,
}) => {
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categoryForm),
    defaultValues: { categoryId: initialData.categoryId ?? '' },
  });
  const router = useRouter();

  const [activelyEditing, setActivelyEditing] = useState(false);
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = form.handleSubmit(async (formData) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, formData);
      toast.success('Course description updated');
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
    }
  });

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  const toggleEdit = () => setActivelyEditing((editStatus) => !editStatus);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {activelyEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!activelyEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.categoryId && 'text-slate-500 italic'
          )}
        >
          {selectedOption?.label || 'No category'}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
