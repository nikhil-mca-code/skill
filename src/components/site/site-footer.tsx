import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="text-lg font-semibold text-neutral-950">{siteConfig.name}</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">
            {siteConfig.description}
          </p>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="font-semibold text-neutral-950">Explore</div>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-neutral-600 transition hover:text-neutral-950">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="grid gap-3 text-sm">
          <div className="font-semibold text-neutral-950">Built for</div>
          <p className="text-neutral-600">LinkedIn portfolios, MCA final projects, and startup-style demos.</p>
        </div>
      </div>
    </footer>
  );
}
