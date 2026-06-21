import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { createServiceAction, deleteServiceAction, updateServiceAction } from '@/lib/actions/service.actions';

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
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">Service Module</h1>
        <p className="mt-2 text-neutral-600">Create your professional profile before adding services.</p>
      </div>
    );
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-neutral-950">Service Module</h1>
        <p className="mt-2 text-sm text-neutral-600">Add and maintain the services tied to your professional profile.</p>

        <form action={createServiceAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="returnTo" value="/professional/services" />
          <input type="hidden" name="professionalId" value={profile.id} />
          <input name="title" placeholder="Service title" className="rounded-lg border border-neutral-200 px-3 py-2" required />
          <input name="price" placeholder="Price" type="number" step="0.01" min="0" className="rounded-lg border border-neutral-200 px-3 py-2" required />
          <input
            name="durationMinutes"
            placeholder="Duration minutes"
            type="number"
            min="1"
            className="rounded-lg border border-neutral-200 px-3 py-2"
          />
          <select name="categoryId" className="rounded-lg border border-neutral-200 px-3 py-2" required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="images"
            placeholder="Image URLs, comma separated"
            className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-2">
            <input name="isActive" type="checkbox" defaultChecked />
            Active service
          </label>
          <Button type="submit" className="md:col-span-2 justify-self-start">
            Create service
          </Button>
        </form>
      </section>

      <section className="grid gap-4">
        {profile.services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <form action={updateServiceAction.bind(null, service.id)} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="returnTo" value="/professional/services" />
              <input type="hidden" name="professionalId" value={profile.id} />
              <input name="title" defaultValue={service.title} className="rounded-lg border border-neutral-200 px-3 py-2" required />
              <input
                name="price"
                defaultValue={service.price}
                type="number"
                step="0.01"
                min="0"
                className="rounded-lg border border-neutral-200 px-3 py-2"
                required
              />
              <input
                name="durationMinutes"
                defaultValue={service.durationMinutes ?? ''}
                type="number"
                min="1"
                className="rounded-lg border border-neutral-200 px-3 py-2"
              />
              <select name="categoryId" defaultValue={service.categoryId} className="rounded-lg border border-neutral-200 px-3 py-2" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                name="images"
                defaultValue={service.images.join(', ')}
                placeholder="Image URLs, comma separated"
                className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
              />
              <textarea
                name="description"
                defaultValue={service.description ?? ''}
                rows={3}
                className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
              />
              <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-2">
                <input name="isActive" type="checkbox" defaultChecked={service.isActive} />
                Active service
              </label>
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button type="submit">Save</Button>
              </div>
            </form>
            <form action={deleteServiceAction.bind(null, service.id, '/professional/services')} className="mt-3">
              <Button type="submit" variant="outline">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}
