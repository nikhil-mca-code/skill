'use client';

import { useQuery } from '@tanstack/react-query';
import type { CategoryListItem } from '@/types/phase2';

async function fetchCategories(search = '') {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  const response = await fetch(`/api/categories${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  return (await response.json()) as { data: CategoryListItem[] };
}

export function useCategories(search = '') {
  return useQuery({
    queryKey: ['categories', search],
    queryFn: () => fetchCategories(search),
    staleTime: 60_000,
  });
}
