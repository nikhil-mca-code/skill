'use client';

import { useQuery } from '@tanstack/react-query';
import type { BookingFilters, BookingListItem } from '@/types/phase2';

async function fetchBookings(filters: BookingFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  const response = await fetch(`/api/bookings${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to load bookings');
  }
  return (await response.json()) as { data: BookingListItem[] };
}

export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => fetchBookings(filters),
    staleTime: 15_000,
  });
}
