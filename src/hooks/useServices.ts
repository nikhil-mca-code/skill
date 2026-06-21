'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ServiceFilters, ServiceListItem } from '@/types/phase2';

async function fetchServices(filters: ServiceFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.professionalId) params.set('professionalId', filters.professionalId);
  if (filters.city) params.set('city', filters.city);
  if (typeof filters.minPrice === 'number') params.set('minPrice', String(filters.minPrice));
  if (typeof filters.maxPrice === 'number') params.set('maxPrice', String(filters.maxPrice));
  if (typeof filters.isActive === 'boolean') params.set('isActive', String(filters.isActive));

  const response = await fetch(`/api/services${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to load services');
  }
  return (await response.json()) as { data: ServiceListItem[] };
}

export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => fetchServices(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
