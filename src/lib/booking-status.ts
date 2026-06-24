import { BookingStatus } from '@prisma/client';

export type BookingStatusMeta = {
  label: string;
  className: string;
};

export function getBookingStatusMeta(status: BookingStatus): BookingStatusMeta {
  switch (status) {
    case BookingStatus.PENDING:
      return {
        label: 'Pending',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
      };
    case BookingStatus.ACCEPTED:
      return {
        label: 'Accepted',
        className: 'border-sky-200 bg-sky-50 text-sky-700',
      };
    case BookingStatus.IN_PROGRESS:
      return {
        label: 'In progress',
        className: 'border-violet-200 bg-violet-50 text-violet-700',
      };
    case BookingStatus.COMPLETED:
      return {
        label: 'Completed',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      };
    case BookingStatus.REJECTED:
      return {
        label: 'Rejected',
        className: 'border-rose-200 bg-rose-50 text-rose-700',
      };
    case BookingStatus.CANCELLED_BY_CUSTOMER:
      return {
        label: 'Cancelled by customer',
        className: 'border-neutral-200 bg-neutral-100 text-neutral-700',
      };
    case BookingStatus.CANCELLED_BY_PROFESSIONAL:
      return {
        label: 'Cancelled by professional',
        className: 'border-neutral-200 bg-neutral-100 text-neutral-700',
      };
    default:
      return {
        label: String(status).replaceAll('_', ' '),
        className: 'border-neutral-200 bg-neutral-100 text-neutral-700',
      };
  }
}
