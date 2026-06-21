import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardCopy } from '@/config/site';
import { cn } from '@/lib/utils';
import { UserRole } from '@prisma/client';
import { Home, CalendarDays, LayoutGrid, Sparkles, Store } from 'lucide-react';

type DashboardShellProps = {
  role: UserRole;
  children: React.ReactNode;
};

const navigation = {
  ADMIN: [
    { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  ],
  PROFESSIONAL: [
    { href: '/professional/services', label: 'Services', icon: Store },
    { href: '/professional/bookings', label: 'Bookings', icon: CalendarDays },
  ],
  CUSTOMER: [
    { href: '/customer/bookings', label: 'My bookings', icon: CalendarDays },
  ],
};

export function DashboardShell({ role, children }: DashboardShellProps) {
  const items = navigation[role as keyof typeof navigation] ?? [];
  const copy =
    role === UserRole.ADMIN ? dashboardCopy.admin : role === UserRole.PROFESSIONAL ? dashboardCopy.professional : dashboardCopy.customer;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] text-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-80 border-r border-white/60 bg-white/70 px-6 py-8 backdrop-blur-xl lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white shadow-lg">
              SB
            </span>
            <div>
              <div className="text-sm font-semibold text-neutral-950">SkillBridge</div>
              <div className="text-xs text-neutral-500">Dashboard workspace</div>
            </div>
          </Link>

          <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <Badge variant="secondary" className="mb-4 inline-flex rounded-full">Phase 2</Badge>
            <h2 className="text-lg font-semibold text-neutral-950">{copy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{copy.description}</p>
          </div>

          <nav className="mt-8 grid gap-2">
            <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-white hover:text-neutral-950">
              <Home className="h-4 w-4" /> Home
            </Link>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-white hover:text-neutral-950"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-neutral-200 bg-neutral-950 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Premium mode
            </div>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Built to feel like a modern SaaS, not a classroom prototype.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  {role.toLowerCase()}
                </div>
                <h1 className="mt-1 text-xl font-semibold text-neutral-950">{copy.title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                  <Link href="/">Preview site</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">Open marketplace</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className={cn('mx-auto max-w-7xl', role === UserRole.CUSTOMER ? 'pb-12' : '')}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
