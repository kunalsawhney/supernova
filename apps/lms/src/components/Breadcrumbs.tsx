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
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            href="/dashboard" 
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Home
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <span className="mx-2 text-text-secondary">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-text-primary font-medium">{item.label}</span>
            ) : (
              <Link 
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 