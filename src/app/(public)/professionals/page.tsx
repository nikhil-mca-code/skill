'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Directory</p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-950">Find trusted professionals</h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Search by name, city, category, or price to discover the right specialist for the job.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search professionals"
          className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
        />
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="City"
          className="rounded-lg border border-neutral-200 px-3 py-2"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(event) => setOnlyAvailable(event.target.checked)}
          />
          Available only
        </label>
        <input
          value={minRate}
          onChange={(event) => setMinRate(event.target.value)}
          placeholder="Min rate"
          type="number"
          min="0"
          className="rounded-lg border border-neutral-200 px-3 py-2"
        />
        <input
          value={maxRate}
          onChange={(event) => setMaxRate(event.target.value)}
          placeholder="Max rate"
          type="number"
          min="0"
          className="rounded-lg border border-neutral-200 px-3 py-2"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {professionalsQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-neutral-500 md:col-span-3">
            Loading professionals...
          </div>
        ) : professionals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-neutral-500 md:col-span-3">
            No professionals match your filters.
          </div>
        ) : (
          professionals.map((professional) => (
            <article key={professional.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">
                    {professional.user.name || 'Professional'}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {professional.city ?? 'Remote'} {professional.state ? `, ${professional.state}` : ''}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    professional.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {professional.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                {professional.headline || professional.description || 'Profile details coming soon.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {professional.categories.map((category) => (
                  <span key={category.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                    {category.name}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-950">{professional.serviceCount}</span> services
                </div>
                <Link
                  href={`/professionals/${professional.user.id}`}
                  className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
                >
                  View profile
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
