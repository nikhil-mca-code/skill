import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}