'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { SectionHeading } from '@/components/site/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrencyInr } from '@/lib/currency';

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const deferredSearch = useDeferredValue(search);
  const deferredCity = useDeferredValue(city);
  const deferredMinPrice = useDeferredValue(minPrice);
  const deferredMaxPrice = useDeferredValue(maxPrice);

  const categoriesQuery = useCategories();
  const servicesQuery = useServices({
    search: deferredSearch || undefined,
    categoryId: categoryId || undefined,
    city: deferredCity || undefined,
    minPrice: deferredMinPrice ? Number(deferredMinPrice) : undefined,
    maxPrice: deferredMaxPrice ? Number(deferredMaxPrice) : undefined,
    isActive: true,
  });

  const categories = categoriesQuery.data?.data ?? [];
  const services = servicesQuery.data?.data ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Marketplace"
          title="Browse premium services with sharper search and cleaner filters."
          description="A polished discovery flow that feels more like a modern SaaS catalog than a basic listing page."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </CardTitle>
              <CardDescription>Refine by service, location, price, and category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Search</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" className="pl-11" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Category</label>
                <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">City</label>
                <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Any location" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Min</label>
                  <Input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="0" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Max</label>
                  <Input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="999" type="number" min="0" />
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-950 p-4 text-white">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart search
                </div>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Connect with verified experts in minutes and keep the browsing flow clean on desktop and mobile.
                </p>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                {services.length} services available
              </Badge>
              <p className="text-sm text-neutral-500">Transparent pricing, modern cards, faster scanning.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {servicesQuery.isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                    <CardHeader className="space-y-4 p-6">
                      <div className="h-5 w-24 animate-pulse rounded-full bg-neutral-200" />
                      <div className="h-7 w-2/3 animate-pulse rounded-2xl bg-neutral-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-full animate-pulse rounded-full bg-neutral-200" />
                        <div className="h-3 w-5/6 animate-pulse rounded-full bg-neutral-200" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4 p-6 pt-0">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200" />
                      <div className="h-10 w-28 animate-pulse rounded-full bg-neutral-200" />
                    </CardContent>
                  </Card>
                ))
              ) : services.length === 0 ? (
                <Card className="md:col-span-2 xl:col-span-3 border-dashed border-neutral-300 bg-white/75 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <h3 className="text-xl font-semibold text-neutral-950">No services match your filters</h3>
                    <p className="max-w-xl text-sm text-neutral-500">
                      Try widening the price range or clearing a filter to see more Indian service options.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                services.map((service) => (
                  <Card key={service.id} className="group overflow-hidden border-white/70 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.1)]">
                    <CardHeader className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="outline" className="rounded-full px-3 py-1.5">
                            {service.category.name}
                          </Badge>
                          <CardTitle className="mt-4 text-xl">{service.title}</CardTitle>
                        </div>
                        <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-sm font-semibold text-white">
                          {formatCurrencyInr(service.price)}
                        </div>
                      </div>
                      <CardDescription className="line-clamp-3">{service.description || 'No description available yet.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4 p-6 pt-0">
                      <div className="text-sm text-neutral-500">
                        {service.durationMinutes ? `${service.durationMinutes} mins` : 'Flexible duration'}
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/professionals/${service.professional.user.id}`}>View professional</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
