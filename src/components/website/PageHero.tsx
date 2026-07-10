import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  currentPage: string;
  children?: ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumb = [{ label: 'Home', href: '/' }],
  currentPage,
  children,
}: PageHeroProps) {
  return (
    <div
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: "url('/contact_hero.png')",
        backgroundColor: '#0183CB',
      }}
    >
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center justify-center gap-1.5 text-sm text-white/80">
          <Home className="h-3.5 w-3.5" />
          {breadcrumb.map((item) => (
            <span key={item.href} className="flex items-center gap-1.5">
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          ))}
          <span className="font-medium text-white">{currentPage}</span>
        </nav>

        <h1 className="text-4xl font-bold text-white md:text-5xl">{title}</h1>

        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
