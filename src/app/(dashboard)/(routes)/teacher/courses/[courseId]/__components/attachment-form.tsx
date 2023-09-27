'use client';

import { Attachment, Course } from '@/db/schema';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/file-upload';
import { TypeOf, object, string } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface AttachmentFormProps {
  initialData: Course & { attachments: Array<Attachment> };
  courseId: Course['id'];
}

const formSchema = object({
  url: string().url({ message: 'Attachment not valid' }),
});

type AttachmentPayload = TypeOf<typeof formSchema>;

export const AttachmentForm: React.FC<AttachmentFormProps> = ({
  courseId,
  initialData,
}) => {
  const router = useRouter();
  const form = useForm<AttachmentPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const [deleteAttachment, setDeleteAttachment] = useState<Pick<
    Attachment,
    'id' | 'name'
  > | null>(null);

  const [activelyEditing, setActivelyEditing] = useState(false);
  const onSubmit = async (formData: AttachmentPayload) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, formData);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      form.reset();
    }
  };

  const onDeleteAttachment = async (
    info: NonNullable<typeof deleteAttachment>
  ) => {
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${info.id}`);
      toast.success(`Attachment: ${info.name} remove successfully`);
      router.refresh();
    } catch (e) {
      toast.error(
        'Something went wrong while removing attachment ' + info.name
      );
    } finally {
      setDeleteAttachment(null);
    }
  };

  useEffect(() => {
    const formData = form.getValues();
    if (!formData.url) return;
    onSubmit(formData);
  }, [form.watch()]);

  useEffect(() => {
    if (deleteAttachment) {
      onDeleteAttachment(deleteAttachment);
    }
  }, [deleteAttachment]);

  const toggleEdit = () => setActivelyEditing((editStatus) => !editStatus);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {activelyEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!activelyEditing ? (
        !initialData.attachments.length ? (
          <p className="text-sm mt-2 text-slate-500 italic">
            No attachments yet
          </p>
        ) : (
          <div className="space-y-2">
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
              >
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>
                {deleteAttachment?.id === attachment.id ? (
                  <div className="ml-auto">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button
                    className="ml-auto hover:opacity-75 transition"
                    onClick={() =>
                      setDeleteAttachment({
                        id: attachment.id,
                        name: attachment.name,
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url !== undefined) {
                form.setValue('url', url);
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};
export { formSchema as attachmentInsertForm };
export type { AttachmentPayload };
