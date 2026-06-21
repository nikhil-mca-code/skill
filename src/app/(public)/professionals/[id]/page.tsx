import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, CalendarClock, Globe, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createBookingAction } from '@/lib/actions/booking.actions';
import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const dynamic = 'force-dynamic';

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
      reviews: {
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!professional) {
    notFound();
  }

  const serviceOptions = professional.services;
  const portfolioImages = serviceOptions.flatMap((service) => service.images).slice(0, 6);
  const skills = Array.from(new Set(serviceOptions.map((service) => service.category.name)));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <Badge variant="outline" className="inline-flex rounded-full px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Professional profile
              </Badge>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-neutral-950 md:text-5xl">
                {professional.user.name || 'Professional'}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
                {professional.headline || professional.description || 'No bio has been added yet.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {professional.city ?? 'Remote'}
                </Badge>
                {professional.hourlyRate ? (
                  <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                    ${professional.hourlyRate.toFixed(2)}/hr
                  </Badge>
                ) : null}
                <Badge variant={professional.isAvailable ? 'success' : 'secondary'} className="rounded-full px-3 py-1.5">
                  {professional.isAvailable ? 'Available now' : 'Unavailable'}
                </Badge>
                {professional.isVerified ? (
                  <Badge variant="success" className="rounded-full px-3 py-1.5">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : null}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Card className="border-white/70 bg-white/80 shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-2xl font-semibold text-neutral-950">{serviceOptions.length}</div>
                    <div className="mt-1 text-sm text-neutral-500">Active services</div>
                  </CardContent>
                </Card>
                <Card className="border-white/70 bg-white/80 shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-2xl font-semibold text-neutral-950">{skills.length}</div>
                    <div className="mt-1 text-sm text-neutral-500">Skill categories</div>
                  </CardContent>
                </Card>
                <Card className="border-white/70 bg-white/80 shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-2xl font-semibold text-neutral-950">{professional.reviews.length}</div>
                    <div className="mt-1 text-sm text-neutral-500">Recent reviews</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="overflow-hidden border-white/70 bg-neutral-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
              <CardHeader className="border-b border-white/10 p-6">
                <CardTitle className="text-2xl text-white">Book a service</CardTitle>
                <CardDescription className="text-white/70">
                  Schedule work directly from this profile in a clean, high-conversion booking card.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <form action={createBookingAction} className="space-y-4">
                  <input type="hidden" name="returnTo" value={`/professionals/${professional.user.id}`} />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/80">Service</label>
                    <select name="serviceId" className="w-full rounded-2xl border border-white/10 bg-white px-3 py-3 text-neutral-950" required>
                      {serviceOptions.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title} - ${service.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/80">When</label>
                    <input
                      name="scheduledDate"
                      type="datetime-local"
                      className="w-full rounded-2xl border border-white/10 bg-white px-3 py-3 text-neutral-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/80">Address</label>
                    <input name="address" className="w-full rounded-2xl border border-white/10 bg-white px-3 py-3 text-neutral-950" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-white/80">Notes</label>
                    <textarea name="notes" rows={4} className="w-full rounded-2xl border border-white/10 bg-white px-3 py-3 text-neutral-950" />
                  </div>
                  <Button type="submit" className="w-full bg-white text-neutral-950 hover:bg-white/90">
                    Create booking
                  </Button>
                </form>
                <p className="text-xs leading-5 text-white/60">You will need to sign in before confirming a booking.</p>
                <Button asChild variant="outline" className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Portfolio</CardTitle>
                <CardDescription>Selected work samples drawn from active services.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-6 pt-0 sm:grid-cols-2">
                {portfolioImages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 sm:col-span-2">
                    Portfolio imagery will appear here once services include images.
                  </div>
                ) : (
                  portfolioImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={image}
                        alt={`${professional.user.name || 'Professional'} portfolio ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Services</CardTitle>
                <CardDescription>Premium service cards with transparent pricing and clear positioning.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 pt-0">
                {serviceOptions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-neutral-300 p-6 text-neutral-500">
                    No active services found.
                  </div>
                ) : (
                  serviceOptions.map((service) => (
                    <article key={service.id} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                            {service.category.name}
                          </Badge>
                          <h3 className="mt-3 text-xl font-semibold text-neutral-950">{service.title}</h3>
                        </div>
                        <span className="rounded-2xl bg-neutral-950 px-3 py-2 text-sm font-semibold text-white">
                          ${service.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {service.description || 'No description available yet.'}
                      </p>
                    </article>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-8">
            <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Skills</CardTitle>
                <CardDescription>Derived from the categories attached to active services.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 p-6 pt-0">
                {skills.length === 0 ? (
                  <p className="text-sm text-neutral-500">No skills listed yet.</p>
                ) : (
                  skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Reviews</CardTitle>
                <CardDescription>Social proof that makes the booking decision feel safer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0">
                {professional.reviews.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">
                    Reviews will appear here once bookings are completed and rated.
                  </div>
                ) : (
                  professional.reviews.map((review) => (
                    <div key={review.id} className="rounded-3xl border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-neutral-950">{review.reviewer.name || 'Customer'}</div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: review.rating }).map((_, index) => (
                            <Star key={index} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {review.comment || 'Trusted service experience with polished execution.'}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-950 bg-neutral-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Booking CTA
                </div>
                <p className="mt-3 text-lg leading-8 text-white/80">
                  Book trusted professionals with confidence and keep the experience consistent from browse to checkout.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
