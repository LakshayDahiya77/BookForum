import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();

  const { id } = await params;

  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      books: {
        include: {
          authors: true,
          categories: true,
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <section className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex items-start gap-5">
          {author.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center text-text-muted text-sm">
              No Photo
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">{author.name}</h1>
            {author.bio ? (
              <p className="text-text-muted mt-2 leading-relaxed">{author.bio}</p>
            ) : (
              <p className="text-text-muted mt-2">No biography available yet.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-5">Books by {author.name}</h2>

        {author.books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {author.books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted bg-surface border border-border rounded-md px-4 py-3">
            This author has no books listed yet.
          </p>
        )}
      </section>
    </main>
  );
}
