import Form from "next/form";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { addAuthor } from "./actions";
import { Button } from "@/components/buttons/simpleButton";
import AuthorManager from "@/components/admin/AuthorManager";

export default async function AdminAuthorsPage() {
  await requireAdmin();

  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface border border-border rounded-xl p-6">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Add Author</h1>

          <Form action={addAuthor} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">Bio</label>
              <textarea
                name="bio"
                rows={4}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                placeholder="Short biography"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">Photo</label>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-muted file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-accent file:text-background hover:file:bg-accent-hover"
              />
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="text-xs uppercase font-bold tracking-widest"
              >
                Add Author
              </Button>
            </div>
          </Form>
        </section>

        <section className="flex justify-center lg:justify-start">
          <AuthorManager
            initialAuthors={authors.map((author) => ({
              id: author.id,
              name: author.name,
              bio: author.bio,
              photoUrl: author.photoUrl,
            }))}
          />
        </section>
      </div>
    </main>
  );
}
