import Form from "next/form";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { addAuthor, deleteAuthor, updateAuthor } from "./actions";
import { Button } from "@/components/buttons/simpleButton";
import { Edit2, Trash2 } from "lucide-react";

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

        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-6">All Authors</h2>

          {authors.length === 0 ? (
            <p className="text-text-muted">No authors created yet.</p>
          ) : (
            <ul className="space-y-4">
              {authors.map((author) => (
                <li key={author.id} className="border border-border rounded-lg p-4 bg-background">
                  <Form action={updateAuthor} className="flex flex-col gap-3">
                    <input type="hidden" name="id" value={author.id} />

                    <div className="flex items-center gap-3">
                      {author.photoUrl ? (
                        <img
                          src={author.photoUrl}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted text-xs">
                          N/A
                        </div>
                      )}

                      <input
                        type="text"
                        name="name"
                        defaultValue={author.name}
                        required
                        className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>

                    <textarea
                      name="bio"
                      rows={2}
                      defaultValue={author.bio || ""}
                      className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                      placeholder="Short biography"
                    />

                    <input
                      type="file"
                      name="photoFile"
                      accept="image/*"
                      className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-muted file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-accent file:text-background hover:file:bg-accent-hover"
                    />

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="inline-flex items-center gap-1.5 hover:scale-110 transition-transform duration-150"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Update</span>
                      </Button>
                    </div>
                  </Form>

                  <Form action={deleteAuthor} className="mt-2">
                    <input type="hidden" name="id" value={author.id} />
                    <Button
                      type="submit"
                      variant="danger"
                      size="sm"
                      className="inline-flex items-center gap-1.5 hover:scale-110 transition-transform duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </Form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
