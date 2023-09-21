'use client';
import { BarChart, Compass, Layout, List, LucideIcon } from 'lucide-react';
import { SidebarItem } from './sidebar-item';
import { useAccessMode } from '@/hooks/useAccessMode';
interface Route {
  icon: LucideIcon;
  label: string;
  href: string;
}
const guestRoutes: Array<Route> = [
  { icon: Layout, label: 'Dashboard', href: '/' },
  { icon: Compass, label: 'Browse', href: '/search' },
];

/* 
  const pathname = usePathname();
  const router = useRouter();

  const teacherPageActive = pathname?.toLowerCase().startsWith('/teacher');
  const playerPageActive = pathname?.toLowerCase().startsWith('/chapter');

*/

const teacherRoutes = [
  { icon: List, label: 'Courses', href: '/teacher/courses' },
  { icon: BarChart, label: 'Analytics', href: '/teacher/analytics' },
];

export const SidebarRoutes = () => {
  const { playerPageActive, teacherPageActive } = useAccessMode();

  const routes = teacherPageActive ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
