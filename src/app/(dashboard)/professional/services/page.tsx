import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createServiceAction, deleteServiceAction, updateServiceAction } from '@/lib/actions/service.actions';
import { formatCurrencyInr } from '@/lib/currency';

export default async function ProfessionalServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.PROFESSIONAL) {
    redirect('/sign-in');
  }

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      services: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed border-neutral-300 bg-white/75 shadow-none">
          <CardContent className="flex flex-col items-start gap-3 p-8">
            <h1 className="text-2xl font-semibold text-neutral-950">Service module unavailable</h1>
            <p className="max-w-xl text-sm leading-6 text-neutral-500">Create your professional profile before adding services.</p>
            <Button asChild>
              <Link href="/professional/onboarding">Start onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Professional workspace
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">Service Module</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Manage the services tied to your profile with a more polished product surface.
            </p>
          </div>
          <div className="rounded-3xl bg-neutral-950 px-4 py-3 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Live services</div>
            <div className="mt-1 text-2xl font-semibold">{profile.services.length}</div>
          </div>
        </div>

        <form action={createServiceAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="returnTo" value="/professional/services" />
          <input type="hidden" name="professionalId" value={profile.id} />
          <Input name="title" placeholder="Service title" required />
          <Input name="price" placeholder="Price" type="number" step="0.01" min="0" required />
          <Input name="durationMinutes" placeholder="Duration minutes" type="number" min="1" />
          <select name="categoryId" className="h-11 rounded-2xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950" required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input name="images" placeholder="Image URLs, comma separated" className="md:col-span-2" />
          <Textarea name="description" placeholder="Description" rows={3} className="md:col-span-2" />
          <label className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 md:col-span-2">
            <input name="isActive" type="checkbox" defaultChecked />
            Active service
          </label>
          <Button type="submit" className="md:col-span-2 justify-self-start">
            Create service
          </Button>
        </form>
      </section>

      <section className="grid gap-4">
        {profile.services.length === 0 ? (
          <Card className="border-dashed border-neutral-300 bg-white/75 shadow-none">
            <CardContent className="flex flex-col items-start gap-3 p-8">
              <h2 className="text-xl font-semibold text-neutral-950">No services published yet</h2>
              <p className="max-w-xl text-sm leading-6 text-neutral-500">
                Add a service to start appearing in search and let customers book your work.
              </p>
            </CardContent>
          </Card>
        ) : (
          profile.services.map((service) => (
            <Card key={service.id} className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                <div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {service.category.name} {service.durationMinutes ? `- ${service.durationMinutes} mins` : ''}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-sm font-semibold text-white">
                    {formatCurrencyInr(service.price)}
                  </div>
                  <Badge variant={service.isActive ? 'success' : 'secondary'} className="mt-2 rounded-full px-3 py-1.5">
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0">
                <form action={updateServiceAction.bind(null, service.id)} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="returnTo" value="/professional/services" />
                  <input type="hidden" name="professionalId" value={profile.id} />
                  <Input name="title" defaultValue={service.title} required />
                  <Input name="price" defaultValue={service.price} type="number" step="0.01" min="0" required />
                  <Input name="durationMinutes" defaultValue={service.durationMinutes ?? ''} type="number" min="1" />
                  <select
                    name="categoryId"
                    defaultValue={service.categoryId}
                    className="h-11 rounded-2xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    name="images"
                    defaultValue={service.images.join(', ')}
                    placeholder="Image URLs, comma separated"
                    className="md:col-span-2"
                  />
                  <Textarea name="description" defaultValue={service.description ?? ''} rows={3} className="md:col-span-2" />
                  <label className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 md:col-span-2">
                    <input name="isActive" type="checkbox" defaultChecked={service.isActive} />
                    Active service
                  </label>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                    <Button type="submit">Save</Button>
                  </div>
                </form>

                <form action={deleteServiceAction.bind(null, service.id, '/professional/services')}>
                  <Button type="submit" variant="outline">
                    Delete service
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
