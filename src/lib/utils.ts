import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RouteIsActiveProps {
  currentRoute: string;
  activeRoute: string;
}

const pathMatch = /^(?:https?:\/{2})?(?:www\.)?.*?\.[a-z]\w+\/(?<pathname>.*)/i;
const absolutePath = /^https?/;
const trailingLeadingPathMatch = /^\/|\/$/;
export function routeIsActive({
  activeRoute,
  currentRoute,
}: RouteIsActiveProps) {
  if (!(absolutePath.test(activeRoute) && absolutePath.test(currentRoute))) {
    const activePathname = <{ pathname?: string } | null>(
      pathMatch.exec(activeRoute)?.groups
    );

    const currentPathname = <{ pathname?: string } | null>(
      pathMatch.exec(currentRoute)?.groups
    );

    if (activePathname?.pathname) activeRoute = activePathname.pathname;
    if (currentPathname?.pathname) currentRoute = currentPathname.pathname;
  }

  activeRoute = activeRoute.replace(trailingLeadingPathMatch, '');
  currentRoute = currentRoute.replace(trailingLeadingPathMatch, '');
  return (
    activeRoute === currentRoute ||
    (activeRoute && currentRoute && activeRoute.startsWith(currentRoute))
  );
}
