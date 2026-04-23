import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/buttons/simpleButton";
import { AddReview, ToggleLike } from "./actions";
import ReviewCard, { AISummaryCard } from "@/components/ReviewCard";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const authUser = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: id },
    include: {
      authors: true,
      categories: true,
      votes: {
        where: { userId: dbUser?.id },
      },
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const hasUserLikedBook = book?.votes && book.votes.length > 0;

  if (!book) {
    notFound();
  }

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      {/* Hero section */}
      <div className="flex gap-8 pb-8 border-b border-border">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="Book Cover"
            width={192}
            height={288}
            loading="eager"
            className="rounded-md shadow-md object-cover flex-shrink-0"
          />
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary">{book.title}</h1>
          <p className="italic text-text-muted">
            by{" "}
            {book.authors?.length
              ? book.authors.map((author, i) => (
                  <span key={author.id ?? i}>
                    <Link
                      href={`/authors/${author.id}`}
                      className="font-semibold hover:text-accent transition-colors"
                    >
                      {author.name}
                    </Link>
                    {i < book.authors.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Unknown Author"}
          </p>
          {book.publishYear && (
            <p className="text-sm text-text-muted">Published: {book.publishYear}</p>
          )}

          {/* Like + Rating */}
          <div className="flex gap-3 items-center mt-1">
            <form action={ToggleLike}>
              <input type="hidden" name="book-id" value={book.id} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className={`border ${hasUserLikedBook ? "border-accent text-accent" : "border-border text-text-muted"}`}
              >
                👍 {hasUserLikedBook ? "Liked" : "Like"} ({book.likeCount || 0})
              </Button>
            </form>
            <span className="text-sm text-text-muted border border-border px-3 py-1 rounded-md">
              ⭐ {book.averageRating ? book.averageRating.toFixed(1) : "—"}
            </span>
          </div>

          {/* Categories */}
          {book.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {book.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="text-xs bg-background text-text-muted px-2 py-1 rounded-sm border border-border hover:border-accent hover:text-accent transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {book.description && (
            <div className="mt-2">
              <h4 className="font-bold text-text-primary mb-1">About this book</h4>
              <p className="text-sm text-text-muted leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-8 bg-surface border border-border rounded-md p-4 flex gap-4">
        <div className="w-10 h-10 bg-border rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
          {dbUser?.avatarUrl ? (
            <img
              src={dbUser.avatarUrl}
              alt={dbUser.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-text-muted text-sm font-bold">
              {(dbUser?.name || "U")[0].toUpperCase()}
            </span>
          )}
        </div>
        <form className="flex-1" action={AddReview}>
          <input type="hidden" name="book-id" value={book.id} />
          <div className="flex gap-2 mb-3 items-center">
            <span className="text-sm text-text-muted">Rating:</span>
            <select
              name="rating"
              required
              className="bg-background border border-border text-text-primary rounded-md px-2 py-1 text-sm outline-none focus:border-accent"
            >
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Average</option>
              <option value="2">2 — Poor</option>
              <option value="1">1 — Terrible</option>
            </select>
          </div>
          <textarea
            rows={5}
            placeholder="Write your review..."
            name="review-text"
            required
            className="w-full p-3 bg-background border border-border text-text-primary rounded-md text-sm outline-none focus:border-accent placeholder:text-text-muted resize-none"
          />
          <Button type="submit" variant="primary" className="mt-2">
            Publish Review
          </Button>
        </form>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-text-primary mb-6">
          Reviews ({book.reviews.length})
        </h3>

        {book.aiSummary && <AISummaryCard summary={book.aiSummary} />}

        {book.reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {book.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                bookId={review.bookId}
                isOwner={dbUser?.id === review.userId}
                user={review.user}
                rating={review.rating}
                content={review.content}
                createdAt={review.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted bg-surface p-6 rounded-md text-center border border-dashed border-border">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </main>
  );
}
