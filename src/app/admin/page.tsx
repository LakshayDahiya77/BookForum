import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import Form from "next/form";
import { prisma } from "@/lib/prisma";
import { addBookAction } from "@/app/admin/books/actions";
import { addCategory } from "@/app/admin/categories/actions";
import { Button } from "@/components/buttons/simpleButton";
import { CategorySelector } from "@/components/CategorySelector";
import { CategoryRow } from "@/components/CategoryRow";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/uploadConfig";
import { BookOpen, Bookmark, Edit2 } from "lucide-react";

function tabHref(tab: string) {
  return `/admin?tab=${tab}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const resolvedSearchParams = await searchParams;
  const rawTab = typeof resolvedSearchParams.tab === "string" ? resolvedSearchParams.tab : "books";
  const tab = rawTab === "categories" || rawTab === "authors" ? rawTab : "books";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary mb-8 font-serif">Admin Dashboard</h1>

      <div className="flex border-b border-border mb-8 overflow-x-auto gap-2">
        <Link
          href={tabHref("books")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
            tab === "books"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Books
        </Link>
        <Link
          href={tabHref("categories")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
            tab === "categories"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Categories
        </Link>
        <Link
          href={tabHref("authors")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
            tab === "authors"
              ? "border-accent text-accent bg-accent/5"
              : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface"
          }`}
        >
          <Edit2 className="w-4 h-4" />
          Authors
        </Link>
      </div>

      {tab === "books" && (
        <div className="flex flex-col items-center justify-start min-h-screen px-4">
          <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-text-primary mb-8 border-b border-border pb-4">
              Add New Book
            </h2>

            <Form action={addBookAction} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Title</label>
                <input
                  type="text"
                  placeholder="The name of the book"
                  name="title"
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  placeholder="A brief overview of the book's content..."
                  name="description"
                  rows={4}
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Author(s){" "}
                  <span className="font-normal text-text-muted italic">(comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. George Orwell, Isaac Asimov"
                  name="authors"
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Cover Image{" "}
                  <span className="font-normal text-text-muted">
                    (Max {formatFileSize(UPLOAD_LIMITS.BOOK_COVER.maxSize)})
                  </span>
                </label>
                <input
                  type="file"
                  name="cover-file"
                  accept="image/*"
                  className="bg-background border border-border p-2 w-full rounded-md text-text-muted text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Publish Year
                </label>
                <input
                  type="number"
                  name="publish-year"
                  placeholder="e.g. 1984"
                  min="-5000"
                  max={new Date().getFullYear()}
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-text-primary mb-3">
                  Shelves / Categories
                </label>
                <CategorySelector categories={categories} fieldName="category-ids" />
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 py-2 font-bold uppercase tracking-widest text-xs"
                >
                  Add Book to Library
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="flex flex-col items-center justify-start gap-8">
          <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
              Add New Category
            </h2>

            <Form action={addCategory} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Science Fiction"
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Brief genre overview..."
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Icon{" "}
                  <span className="font-normal text-text-muted">
                    (Max {formatFileSize(UPLOAD_LIMITS.CATEGORY_ICON.maxSize)})
                  </span>
                </label>
                <input
                  type="file"
                  name="iconFile"
                  accept="image/*"
                  className="bg-background border border-border p-2 w-full rounded-md text-text-muted text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:uppercase file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer transition-all"
                  required
                />
              </div>

              <div className="flex justify-end mt-2 pt-4 border-t border-border">
                <Button
                  type="submit"
                  variant="primary"
                  className="font-bold uppercase tracking-widest text-xs"
                >
                  Add Category
                </Button>
              </div>
            </Form>
          </div>

          <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
              All Categories
            </h2>
            {categories.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {categories.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-center py-4 italic">No categories created yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === "authors" && (
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Authors</h2>
          <p className="text-text-muted">
            No author management form is implemented yet in the existing dedicated authors page.
          </p>
        </div>
      )}
    </main>
  );
}
