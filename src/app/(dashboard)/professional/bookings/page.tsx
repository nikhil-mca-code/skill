import { getServerSession } from 'next-auth';
import { UserRole, BookingStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { updateBookingStatusAction } from '@/lib/actions/booking.actions';
import { getBookingStatusMeta } from '@/lib/booking-status';
import { formatCurrencyInr } from '@/lib/currency';

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
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Booking system
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">Incoming bookings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Track requests, manage service flow, and keep the professional experience feeling premium.
            </p>
          </div>
          <div className="rounded-3xl bg-neutral-950 px-4 py-3 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Total requests</div>
            <div className="mt-1 text-2xl font-semibold">{bookings.length}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <Card className="border-dashed border-neutral-300 bg-white/75 shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
              <h2 className="text-xl font-semibold text-neutral-950">No bookings yet</h2>
              <p className="max-w-md text-sm text-neutral-500">
                New customer requests will appear here once your services start getting booked.
              </p>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => {
            const statusMeta = getBookingStatusMeta(booking.status);

            return (
              <Card key={booking.id} className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                  <div>
                    <CardTitle className="text-2xl">{booking.service?.title ?? 'Custom booking'}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap gap-2">
                      <span>{booking.customer.name || 'Customer'}</span>
                      <span className="text-neutral-400">•</span>
                      <span>{new Date(booking.scheduledDate).toLocaleString()}</span>
                      {booking.service?.price != null ? (
                        <>
                          <span className="text-neutral-400">•</span>
                          <span>{formatCurrencyInr(booking.service.price)}</span>
                        </>
                      ) : null}
                    </CardDescription>
                  </div>
                  <Badge className={`rounded-full px-3 py-1.5 ${statusMeta.className}`}>{statusMeta.label}</Badge>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <form action={updateBookingStatusAction.bind(null, booking.id)} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input type="hidden" name="returnTo" value="/professional/bookings" />
                    <Select name="status" defaultValue={booking.status} className="sm:max-w-[240px]">
                      <option value={BookingStatus.ACCEPTED}>Accepted</option>
                      <option value={BookingStatus.IN_PROGRESS}>In progress</option>
                      <option value={BookingStatus.COMPLETED}>Completed</option>
                      <option value={BookingStatus.REJECTED}>Rejected</option>
                      <option value={BookingStatus.CANCELLED_BY_PROFESSIONAL}>Cancelled</option>
                    </Select>
                    <Button type="submit" className="sm:self-stretch">
                      Update status
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
