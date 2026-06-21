import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from '@/lib/actions/category.actions';

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/sign-in');
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { services: true } } },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-neutral-950">Category Module</h1>
        <p className="mt-2 text-sm text-neutral-600">Manage service categories for the directory and booking flows.</p>

        <form action={createCategoryAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="returnTo" value="/admin/categories" />
          <input name="name" placeholder="Category name" className="rounded-lg border border-neutral-200 px-3 py-2" required />
          <input name="slug" placeholder="Slug (optional)" className="rounded-lg border border-neutral-200 px-3 py-2" />
          <input name="icon" placeholder="Icon (optional)" className="rounded-lg border border-neutral-200 px-3 py-2" />
          <select name="parentId" className="rounded-lg border border-neutral-200 px-3 py-2">
            <option value="">No parent</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
          />
          <Button type="submit" className="md:col-span-2 justify-self-start">
            Create category
          </Button>
        </form>
      </section>

      <section className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <form action={updateCategoryAction.bind(null, category.id)} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="returnTo" value="/admin/categories" />
              <input name="name" defaultValue={category.name} className="rounded-lg border border-neutral-200 px-3 py-2" required />
              <input name="slug" defaultValue={category.slug} className="rounded-lg border border-neutral-200 px-3 py-2" />
              <input name="icon" defaultValue={category.icon ?? ''} className="rounded-lg border border-neutral-200 px-3 py-2" />
              <select name="parentId" defaultValue={category.parentId ?? ''} className="rounded-lg border border-neutral-200 px-3 py-2">
                <option value="">No parent</option>
                {categories
                  .filter((parent) => parent.id !== category.id)
                  .map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
              </select>
              <textarea
                name="description"
                defaultValue={category.description ?? ''}
                rows={3}
                className="rounded-lg border border-neutral-200 px-3 py-2 md:col-span-2"
              />
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button type="submit">Save</Button>
                <span className="text-sm text-neutral-500">{category._count.services} services</span>
              </div>
            </form>
            <form action={deleteCategoryAction.bind(null, category.id, '/admin/categories')} className="mt-3">
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
