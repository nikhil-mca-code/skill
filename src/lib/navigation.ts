export const DASHBOARD_ROUTE = '/dashboard';

export function getDashboardPath(role?: string | null) {
  switch (role) {
    case 'ADMIN':
      return '/admin/categories';
    case 'PROFESSIONAL':
      return '/professional/bookings';
    case 'CUSTOMER':
    default:
      return '/customer/bookings';
  }
}
