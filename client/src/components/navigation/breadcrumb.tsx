import { Link } from "wouter";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="container mx-auto px-4 py-2">
      <nav className="text-sm text-neutral-400 dark:text-neutral-500">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              {item.href ? (
                <Link 
                  href={item.href}
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-600 dark:text-neutral-300">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
