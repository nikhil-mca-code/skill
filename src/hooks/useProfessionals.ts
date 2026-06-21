'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ProfessionalDirectoryItem, ProfessionalFilters } from '@/types/phase2';

async function fetchProfessionals(filters: ProfessionalFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.city) params.set('city', filters.city);
  if (typeof filters.isAvailable === 'boolean') params.set('isAvailable', String(filters.isAvailable));
  if (typeof filters.minRate === 'number') params.set('minRate', String(filters.minRate));
  if (typeof filters.maxRate === 'number') params.set('maxRate', String(filters.maxRate));

  const response = await fetch(`/api/professionals${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to load professionals');
  }
  return (await response.json()) as { data: ProfessionalDirectoryItem[] };
}

export function useProfessionals(filters: ProfessionalFilters = {}) {
  return useQuery({
    queryKey: ['professionals', filters],
    queryFn: () => fetchProfessionals(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
