import { usePathname, useRouter } from 'next/navigation';

export const useAccessMode = () => {
  const pathname = usePathname();
  const router = useRouter();

  const teacherPageActive = pathname?.toLowerCase().startsWith('/teacher');
  const playerPageActive = pathname?.toLowerCase().startsWith('/chapter');

  return { teacherPageActive, playerPageActive };
};
