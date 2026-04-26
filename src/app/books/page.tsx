// src/app/books/page.tsx
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";
import SearchBar from "@/components/SearchBar";

export default async function BooksGridPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireUser();

  const resolvedSearchParams = await searchParams;
  const qRaw = resolvedSearchParams.q;
  const q = typeof qRaw === "string" ? qRaw.trim() : "";

  const books = await prisma.book.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { authors: { some: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : undefined,
    include: {
      authors: true,
      categories: true,
    },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-2">All Books</h1>
        <p className="text-text-muted mb-6">Discover and explore our entire collection</p>

        <div className="mb-6">
          <SearchBar defaultValue={q} preserveParams />
        </div>

        {q ? (
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Results for &apos;{q}&apos;
          </h2>
        ) : null}

        {books.length > 0 ? (
          <BookGrid books={books} />
        ) : q ? (
          <p className="text-text-muted bg-surface border border-border rounded-md px-4 py-3">
            No books found for &apos;{q}&apos;
          </p>
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </div>
  );
}
