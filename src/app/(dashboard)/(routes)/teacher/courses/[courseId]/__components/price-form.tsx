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
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';

const priceForm = insertCourse.pick({ price: true }).required();
type PriceForm = TypeOf<typeof priceForm>;

interface PriceFormProps {
  initialData: Pick<Course, 'price'>;
  courseId: Course['id'];
}

export const PriceForm: React.FC<PriceFormProps> = ({
  courseId,
  initialData,
}) => {
  const form = useForm<PriceForm>({
    resolver: zodResolver(priceForm),
    defaultValues: { price: initialData.price ?? '' },
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

  const toggleEdit = () => setActivelyEditing((editStatus) => !editStatus);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course price
        <Button onClick={toggleEdit} variant="ghost">
          {activelyEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!activelyEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.price && 'text-slate-500 italic'
          )}
        >
          {initialData.price
            ? formatPrice(initialData.price)
            : null || 'No description'}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step="0.01"
                      placeholder="Set a price for your course"
                      {...field}
                      value={field.value || undefined}
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
