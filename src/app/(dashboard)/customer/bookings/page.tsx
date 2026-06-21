import { getServerSession } from 'next-auth';
import { UserRole, BookingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Customer portal
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">My bookings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Track your scheduled services and manage pending requests from a calmer, more polished interface.
            </p>
          </div>
          <div className="rounded-3xl bg-neutral-950 px-4 py-3 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Total bookings</div>
            <div className="mt-1 text-2xl font-semibold">{bookings.length}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
              <div>
                <CardTitle className="text-2xl">{booking.service?.title ?? 'Custom booking'}</CardTitle>
                <CardDescription className="mt-2">
                  {booking.professional.name || 'Professional'} - {new Date(booking.scheduledDate).toLocaleString()}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                {booking.status.replaceAll('_', ' ')}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.ACCEPTED) && (
                <form action={updateBookingStatusAction.bind(null, booking.id)} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="returnTo" value="/customer/bookings" />
                  <input type="hidden" name="status" value={BookingStatus.CANCELLED_BY_CUSTOMER} />
                  <Button type="submit" variant="outline">
                    Cancel booking
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
