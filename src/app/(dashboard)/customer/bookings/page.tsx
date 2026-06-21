import { getServerSession } from 'next-auth';
import { UserRole, BookingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { updateBookingStatusAction } from '@/lib/actions/booking.actions';

export default async function CustomerBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.CUSTOMER) {
    redirect('/sign-in');
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    orderBy: { scheduledDate: 'desc' },
    include: {
      professional: { select: { id: true, name: true, image: true } },
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
        <h1 className="text-3xl font-semibold text-neutral-950">My Bookings</h1>
        <p className="mt-2 text-sm text-neutral-600">Track your scheduled services and cancel pending requests if needed.</p>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-950">{booking.service?.title ?? 'Custom booking'}</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {booking.professional.name || 'Professional'} · {new Date(booking.scheduledDate).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {booking.status.replaceAll('_', ' ')}
              </span>
            </div>

            {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.ACCEPTED) && (
              <form action={updateBookingStatusAction.bind(null, booking.id)} className="mt-4 flex flex-wrap items-center gap-3">
                <input type="hidden" name="returnTo" value="/customer/bookings" />
                <input type="hidden" name="status" value={BookingStatus.CANCELLED_BY_CUSTOMER} />
                <Button type="submit" variant="outline">
                  Cancel booking
                </Button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
