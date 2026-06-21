import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createBookingAction } from '@/lib/actions/booking.actions';
import { prisma } from '@/lib/prisma';

export default async function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = await prisma.professionalProfile.findUnique({
    where: { userId: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      services: {
        where: { isActive: true },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!professional) {
    notFound();
  }

  const serviceOptions = professional.services;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Professional Profile</p>
        <h1 className="mt-3 text-4xl font-semibold text-neutral-950">{professional.user.name || 'Professional'}</h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          {professional.headline || professional.description || 'No bio has been added yet.'}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-700">
          <span className="rounded-full bg-neutral-100 px-3 py-1">{professional.city ?? 'Remote'}</span>
          {professional.hourlyRate ? (
            <span className="rounded-full bg-neutral-100 px-3 py-1">${professional.hourlyRate.toFixed(2)}/hr</span>
          ) : null}
          <span className="rounded-full bg-neutral-100 px-3 py-1">
            {professional.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-950">Services</h2>
          {serviceOptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-neutral-500">
              No active services found.
            </div>
          ) : (
            serviceOptions.map((service) => (
              <article key={service.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-950">{service.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{service.category.name}</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-900">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {service.description || 'No description available.'}
                </p>
              </article>
            ))
          )}
        </section>

        <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-950">Book a service</h2>
          <form action={createBookingAction} className="mt-6 space-y-4">
            <input type="hidden" name="returnTo" value={`/professionals/${professional.user.id}`} />
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Service</label>
              <select name="serviceId" className="w-full rounded-lg border border-neutral-200 px-3 py-2" required>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} - ${service.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">When</label>
              <input
                name="scheduledDate"
                type="datetime-local"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Address</label>
              <input name="address" className="w-full rounded-lg border border-neutral-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Notes</label>
              <textarea name="notes" rows={4} className="w-full rounded-lg border border-neutral-200 px-3 py-2" />
            </div>
            <Button type="submit" className="w-full">
              Create booking
            </Button>
          </form>
          <p className="mt-4 text-xs leading-5 text-neutral-500">
            You will need to sign in before confirming a booking.
          </p>
          <div className="mt-3">
            <Link href="/sign-in" className="text-sm font-medium text-neutral-950 underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
