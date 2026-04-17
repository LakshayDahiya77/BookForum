// src/app/books/page.tsx
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";

export default async function BooksGridPage() {
  await requireUser();
  const books = await prisma.book.findMany({
    include: {
      authors: true,
      categories: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Books</h1>
        <p className="text-gray-600 mb-8">Discover and explore our entire collection</p>

        {/* Use your shared component! */}
        <BookGrid books={books} />
      </div>
    </div>
  );
}
