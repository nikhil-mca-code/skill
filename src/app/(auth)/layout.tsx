import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketingCard } from '@/components/site/marketing-card';
import { siteConfig } from '@/config/site';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.12),_transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-white/60 px-8 py-8 lg:flex lg:flex-col">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white shadow-lg">
                SB
              </span>
              <div>
                <div className="text-sm font-semibold text-neutral-950">{siteConfig.name}</div>
                <div className="text-xs text-neutral-500">Premium booking marketplace</div>
              </div>
            </Link>
            <Badge variant="outline" className="rounded-full px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Portfolio ready
            </Badge>
          </div>

          <div className="mt-auto max-w-xl pb-8">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              Verified experts. Frictionless booking.
            </Badge>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-balance text-neutral-950">
              {siteConfig.tagline}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-600">
              Built to look like a modern SaaS launch: calm gradients, crisp hierarchy, and a product story that feels credible in interviews and portfolio reviews.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, label: 'Trust-first onboarding', copy: 'A polished first-touch experience for clients and professionals.' },
                { icon: Star, label: 'Premium feel', copy: 'Soft shadows, spacious layouts, and refined interaction states.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <MarketingCard key={item.label}>
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neutral-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-950">{item.label}</div>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">{item.copy}</p>
                      </div>
                    </div>
                  </MarketingCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-lg">{children}</div>
        </section>
      </div>
    </div>
  );
}
