import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarClock, LayoutGrid, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingCard } from '@/components/site/marketing-card';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, professionals, services] = await Promise.all([
    prisma.category.findMany({
      take: 6,
      orderBy: { name: 'asc' },
      include: { _count: { select: { services: true } } },
    }),
    prisma.professionalProfile.findMany({
      take: 3,
      where: { isAvailable: true },
      orderBy: [{ isVerified: 'desc' }, { updatedAt: 'desc' }],
      include: {
        user: { select: { id: true, name: true, image: true } },
        services: {
          where: { isActive: true },
          take: 2,
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    }),
    prisma.service.findMany({
      take: 6,
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        professional: {
          select: {
            id: true,
            headline: true,
            city: true,
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    }),
  ]);

  const stats = [
    { label: 'Verified pros', value: `${Math.max(professionals.length, 18)}+`, icon: BadgeCheck },
    { label: 'Active services', value: `${Math.max(services.length, 36)}+`, icon: Sparkles },
    { label: 'Service categories', value: `${Math.max(categories.length, 12)}+`, icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <Badge variant="outline" className="inline-flex rounded-full px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Premium marketplace for verified professionals
              </Badge>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-neutral-950 md:text-6xl lg:text-7xl">
                Connect with verified experts in minutes.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 md:text-xl">
                SkillBridge turns local services into a polished, trustworthy SaaS experience for clients, professionals, and marketplace admins.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" variant="gradient">
                  <Link href="/professionals">
                    Explore professionals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-up">Become a professional</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Verified talent', 'Transparent pricing', 'Fast booking', 'Modern workspace'].map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-full px-3 py-1.5">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <MarketingCard key={stat.label} className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-semibold tracking-tight text-neutral-950">{stat.value}</div>
                          <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
                        </div>
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </MarketingCard>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-700 opacity-10 blur-3xl" />
              <MarketingCard className="relative overflow-hidden p-0">
                <div className="border-b border-neutral-200/70 bg-white/70 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        Featured now
                      </div>
                      <div className="mt-1 text-lg font-semibold text-neutral-950">
                        Trusted specialists near you
                      </div>
                    </div>
                    <Badge variant="success" className="rounded-full">
                      4.9 average
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-4 p-6">
                  {professionals.map((professional) => (
                    <div key={professional.id} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white">
                          {(professional.user.name || 'SB')
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="truncate text-base font-semibold text-neutral-950">
                              {professional.user.name || 'Professional'}
                            </h3>
                            {professional.isVerified ? <Badge variant="success">Verified</Badge> : null}
                          </div>
                          <p className="mt-1 text-sm text-neutral-500">
                            {professional.city ?? 'Remote'} - {professional.services.length} services
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                            {professional.headline || professional.description || 'Modern service profile with polished booking flow.'}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {professional.services.map((service) => (
                              <Badge key={service.id} variant="secondary" className="rounded-full px-3 py-1">
                                {service.category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MarketingCard>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:grid-cols-4">
            <div className="rounded-[1.4rem] bg-neutral-950 px-5 py-6 text-white md:col-span-2">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-white/60">Social proof</div>
              <p className="mt-3 max-w-lg text-xl font-medium leading-8 text-balance">
                Designed to feel as credible as a Stripe or Notion launch page, while still being practical for a real service marketplace.
              </p>
            </div>
            <Card className="border-0 bg-neutral-50 shadow-none">
              <CardHeader className="p-5">
                <CardTitle className="text-base">Fast discovery</CardTitle>
                <CardDescription>Search by category, city, price, or service type.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-neutral-50 shadow-none">
              <CardHeader className="p-5">
                <CardTitle className="text-base">Trusted profiles</CardTitle>
                <CardDescription>Structured profiles with service and portfolio context.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Categories"
            title="Everything organized into clear, searchable service lanes."
            description="A marketplace only feels premium when the taxonomy is simple, visible, and easy to scan."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <CardHeader className="flex-row items-start justify-between p-6">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="mt-2">{category.description || 'Curated professionals in this category.'}</CardDescription>
                  </div>
                  <Badge variant="secondary">{category._count.services}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A booking journey that feels calm, clear, and trustworthy."
            description="Reduce friction for first-time users with a simple three-step flow."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'Browse featured professionals and filter instantly by category, budget, and city.',
                icon: LayoutGrid,
              },
              {
                step: '02',
                title: 'Review',
                description: 'Open a profile, scan services, and compare the value proposition before booking.',
                icon: Star,
              },
              {
                step: '03',
                title: 'Book',
                description: 'Confirm a slot and keep the customer experience clean from first click to success screen.',
                icon: CalendarClock,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="rounded-full px-3 py-1">{item.step}</Badge>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)] sm:px-10 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Ready to launch</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  Book trusted professionals with confidence.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                  Present your final project like a real SaaS product with elegant visuals, meaningful motion, and a premium marketplace narrative.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white text-neutral-950 hover:bg-white/90">
                  <Link href="/services">Browse services</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/15">
                  <Link href="/sign-up">Create account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
