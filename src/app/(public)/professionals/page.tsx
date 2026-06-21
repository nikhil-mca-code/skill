'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { BadgeCheck, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { SectionHeading } from '@/components/site/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useProfessionals } from '@/hooks/useProfessionals';

export default function ProfessionalsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const deferredSearch = useDeferredValue(search);
  const deferredCity = useDeferredValue(city);
  const deferredMinRate = useDeferredValue(minRate);
  const deferredMaxRate = useDeferredValue(maxRate);

  const categoriesQuery = useCategories();
  const professionalsQuery = useProfessionals({
    search: deferredSearch || undefined,
    city: deferredCity || undefined,
    categoryId: categoryId || undefined,
    isAvailable: onlyAvailable,
    minRate: deferredMinRate ? Number(deferredMinRate) : undefined,
    maxRate: deferredMaxRate ? Number(deferredMaxRate) : undefined,
  });

  const categories = categoriesQuery.data?.data ?? [];
  const professionals = professionalsQuery.data?.data ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Directory"
          title="Find trusted professionals with a premium browsing experience."
          description="Search by name, city, category, or budget to discover the right expert for the job."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="h-fit border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </CardTitle>
              <CardDescription>Refine by talent, location, category, and hourly range.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Search</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search professionals"
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">City</label>
                <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Any location" />
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

              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-950">Available only</p>
                  <p className="text-xs text-neutral-500">Show currently bookable profiles.</p>
                </div>
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(event) => setOnlyAvailable(event.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Min rate</label>
                  <Input value={minRate} onChange={(event) => setMinRate(event.target.value)} placeholder="0" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Max rate</label>
                  <Input value={maxRate} onChange={(event) => setMaxRate(event.target.value)} placeholder="999" type="number" min="0" />
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-950 p-4 text-white">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium discovery
                </div>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Connect with verified experts in a cleaner, more trustworthy marketplace flow.
                </p>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                {professionals.length} professionals found
              </Badge>
              <p className="text-sm text-neutral-500">A polished directory built for quick decisions.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {professionalsQuery.isLoading ? (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-8 text-neutral-500">Loading professionals...</CardContent>
                </Card>
              ) : professionals.length === 0 ? (
                <Card className="md:col-span-2 xl:col-span-3">
                  <CardContent className="p-8 text-neutral-500">No professionals match your filters.</CardContent>
                </Card>
              ) : (
                professionals.map((professional) => (
                  <Card
                    key={professional.id}
                    className="group overflow-hidden border-white/70 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.1)]"
                  >
                    <CardHeader className="space-y-4 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="truncate text-xl">{professional.user.name || 'Professional'}</CardTitle>
                            {professional.isVerified ? <Badge variant="success">Verified</Badge> : null}
                          </div>
                          <CardDescription className="mt-2 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {professional.city ?? 'Remote'}
                            {professional.state ? `, ${professional.state}` : ''}
                          </CardDescription>
                        </div>
                        <div
                          className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                            professional.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {professional.isAvailable ? 'Available now' : 'Unavailable'}
                        </div>
                      </div>

                      <p className="line-clamp-3 text-sm leading-6 text-neutral-600">
                        {professional.headline || professional.description || 'Modern service profile with a premium booking experience.'}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {professional.categories.slice(0, 3).map((category) => (
                          <Badge key={category.id} variant="secondary" className="rounded-full px-3 py-1">
                            {category.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
                        <div>
                          <div className="text-sm font-semibold text-neutral-950">{professional.serviceCount} services</div>
                          <div className="text-xs text-neutral-500">Verified marketplace presence</div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/professionals/${professional.user.id}`}>View profile</Link>
                        </Button>
                      </div>
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
