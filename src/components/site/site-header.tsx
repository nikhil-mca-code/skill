import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white shadow-lg shadow-neutral-950/20">
            SB
          </span>
          <div>
            <div className="text-sm font-semibold text-neutral-950">{siteConfig.name}</div>
            <div className="text-xs text-neutral-500">Premium services marketplace</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-neutral-600 transition hover:text-neutral-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden rounded-full px-3 py-1 md:inline-flex">
            Verified talent
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="gradient">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
