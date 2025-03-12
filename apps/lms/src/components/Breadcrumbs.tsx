import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BreadcrumbItem = {
  label: string;
  href: string;
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      // Format the label to be more readable
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  // Get the section (e.g., 'admin' from /dashboard/admin/schools)
  const pathParts = pathname.split('/').filter(Boolean);
  const currentSection = pathParts[1]; // 'admin', 'student', etc.

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <span className="text-text-secondary">Home</span>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <span className="mx-2 text-text-secondary">/</span>
            {index === breadcrumbs.length - 1 || item.label.toLowerCase() === currentSection ? (
              <span className="text-text-primary font-medium">{item.label}</span>
            ) : (
              <span className="text-text-secondary">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 