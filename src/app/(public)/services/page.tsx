'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';

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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Services</p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-950">Browse active services</h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Filter by category, location, or price to compare service offerings across the directory.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services"
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
        <input
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Min price"
          type="number"
          min="0"
          className="rounded-lg border border-neutral-200 px-3 py-2"
        />
        <input
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Max price"
          type="number"
          min="0"
          className="rounded-lg border border-neutral-200 px-3 py-2"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {servicesQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-neutral-500 md:col-span-3">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-neutral-500 md:col-span-3">
            No services found.
          </div>
        ) : (
          services.map((service) => (
            <article key={service.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">{service.title}</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {service.category.name} · {service.professional.user.name || 'Professional'}
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-900">
                  ${service.price.toFixed(2)}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                {service.description || 'No description available.'}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  {service.durationMinutes ? `${service.durationMinutes} mins` : 'Flexible duration'}
                </div>
                <Link
                  href={`/professionals/${service.professional.user.id}`}
                  className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
                >
                  Book now
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
