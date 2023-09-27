'use client';

import { Course } from '@/db/schema';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

type ImageUploadForm = Pick<Course, 'imageUrl'>;

interface DescriptionFormProps {
  initialData: Pick<Course, 'imageUrl'>;
  courseId: Course['id'];
}

export const ImageUploadForm: React.FC<DescriptionFormProps> = ({
  courseId,
  initialData,
}) => {
  const router = useRouter();

  const [activelyEditing, setActivelyEditing] = useState(false);
  const onSubmit = async (formData: ImageUploadForm) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, formData);
      toast.success('Course description updated');
      toggleEdit();
      router.refresh();
    } catch (e) {
      toast.error('Something went wrong');
    }
  };

  const toggleEdit = () => setActivelyEditing((editStatus) => !editStatus);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {activelyEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData.imageUrl ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit image
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add image
                </>
              )}
            </>
          )}
        </Button>
      </div>
      {!activelyEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              src={initialData.imageUrl}
              alt="image"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="imageUploader"
            onChange={(url) => {
              if (url !== undefined) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
