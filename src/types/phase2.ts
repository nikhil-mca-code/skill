import type { BookingStatus, UserRole } from '@prisma/client';

export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  serviceCount: number;
}

export interface ProfessionalDirectoryItem {
  id: string;
  headline: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  hourlyRate: number | null;
  yearsExperience: number | null;
  isVerified: boolean;
  isAvailable: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: UserRole;
  };
  services: Array<{
    id: string;
    title: string;
    price: number;
    durationMinutes: number | null;
    images: string[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  serviceCount: number;
}

export interface ServiceListItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  durationMinutes: number | null;
  images: string[];
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  professional: {
    id: string;
    headline: string | null;
    city: string | null;
    state: string | null;
    hourlyRate: number | null;
    isAvailable: boolean;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      role: UserRole;
    };
  };
}

export interface BookingListItem {
  id: string;
  status: BookingStatus;
  scheduledDate: string;
  scheduledEndDate: string | null;
  totalPrice: number;
  address: string | null;
  notes: string | null;
  customer: {
    id: string;
    name: string | null;
    image: string | null;
  };
  professional: {
    id: string;
    name: string | null;
    image: string | null;
  };
  service: {
    id: string;
    title: string;
    price: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
}

export interface ProfessionalFilters {
  search?: string;
  categoryId?: string;
  city?: string;
  isAvailable?: boolean;
  minRate?: number;
  maxRate?: number;
}

export interface ServiceFilters {
  search?: string;
  categoryId?: string;
  professionalId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface BookingFilters {
  search?: string;
  status?: BookingStatus;
  role?: UserRole;
}
