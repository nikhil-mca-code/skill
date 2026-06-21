import { getServerSession } from 'next-auth';
import { UserRole, BookingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { updateBookingStatusAction } from '@/lib/actions/booking.actions';

export default async function ProfessionalBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.PROFESSIONAL) {
    redirect('/sign-in');
  }

  const bookings = await prisma.booking.findMany({
    where: { professionalId: session.user.id },
    orderBy: { scheduledDate: 'desc' },
    include: {
      customer: { select: { id: true, name: true, image: true } },
      service: {
        select: {
          id: true,
          title: true,
          price: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-neutral-950">Booking System</h1>
        <p className="mt-2 text-sm text-neutral-600">Manage incoming booking requests and their current status.</p>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-950">{booking.service?.title ?? 'Custom booking'}</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {booking.customer.name || 'Customer'} · {new Date(booking.scheduledDate).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {booking.status.replaceAll('_', ' ')}
              </span>
            </div>

            <form action={updateBookingStatusAction.bind(null, booking.id)} className="mt-4 flex flex-wrap items-center gap-3">
              <input type="hidden" name="returnTo" value="/professional/bookings" />
              <select name="status" defaultValue={booking.status} className="rounded-lg border border-neutral-200 px-3 py-2">
                <option value={BookingStatus.ACCEPTED}>Accepted</option>
                <option value={BookingStatus.IN_PROGRESS}>In progress</option>
                <option value={BookingStatus.COMPLETED}>Completed</option>
                <option value={BookingStatus.REJECTED}>Rejected</option>
                <option value={BookingStatus.CANCELLED_BY_PROFESSIONAL}>Cancelled</option>
              </select>
              <Button type="submit">Update status</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
