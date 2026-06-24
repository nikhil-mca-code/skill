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
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Admin workspace
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">Category Module</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Shape the directory taxonomy with a clean, polished admin experience.
            </p>
          </div>
          <div className="rounded-3xl bg-neutral-950 px-4 py-3 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Category count</div>
            <div className="mt-1 text-2xl font-semibold">{categories.length}</div>
          </div>
        </div>

        <form action={createCategoryAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="returnTo" value="/admin/categories" />
          <Input name="name" placeholder="Category name" required />
          <Input name="slug" placeholder="Slug (optional)" />
          <Input name="icon" placeholder="Icon (optional)" />
          <select name="parentId" className="h-11 rounded-2xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950">
            <option value="">No parent</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Textarea name="description" placeholder="Description" rows={3} className="md:col-span-2" />
          <Button type="submit" className="md:col-span-2 justify-self-start">
            Create category
          </Button>
        </form>
      </section>

      <section className="grid gap-4">
        {categories.length === 0 ? (
          <Card className="border-dashed border-neutral-300 bg-white/75 shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-neutral-950 text-white">+</div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-950">No categories yet</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Add the first category to start organizing the marketplace taxonomy.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                <div>
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  <CardDescription className="mt-2">{category.description || 'No description available yet.'}</CardDescription>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                  {category._count.services} services
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0">
                <form action={updateCategoryAction.bind(null, category.id)} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="returnTo" value="/admin/categories" />
                  <Input name="name" defaultValue={category.name} required />
                  <Input name="slug" defaultValue={category.slug} />
                  <Input name="icon" defaultValue={category.icon ?? ''} />
                  <select
                    name="parentId"
                    defaultValue={category.parentId ?? ''}
                    className="h-11 rounded-2xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950"
                  >
                    <option value="">No parent</option>
                    {categories
                      .filter((parent) => parent.id !== category.id)
                      .map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.name}
                        </option>
                      ))}
                  </select>
                  <Textarea name="description" defaultValue={category.description ?? ''} rows={3} className="md:col-span-2" />
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                    <Button type="submit">Save</Button>
                  </div>
                </form>

                <form action={deleteCategoryAction.bind(null, category.id, '/admin/categories')}>
                  <Button type="submit" variant="outline">
                    Delete category
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
