import { prisma } from "@/lib/prisma";
import { isUserAdmin, requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/buttons/simpleButton";
import { AddReview, ToggleLike } from "./actions";
import ReviewCard, { AISummaryCard } from "@/components/ReviewCard";
import MarkdownEditor from "@/components/MarkdownEditor";
import SortSelect from "@/components/SortSelect";
import EditBookModal from "@/components/EditBookModal";
import Pagination from "@/components/Pagination";
import { APP_CONFIG } from "@/config/app";

const REVIEWS_PER_PAGE = APP_CONFIG.pagination.reviewsPerPage;

const reviewSortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Highest Rated", value: "highest-rated" },
  { label: "Lowest Rated", value: "lowest-rated" },
  { label: "Most Liked", value: "most-liked" },
] as const;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  if (!value || Array.isArray(value)) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function reviewOrderBy(sort: string) {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" as const }];
    case "highest-rated":
      return [{ rating: "desc" as const }, { createdAt: "desc" as const }];
    case "lowest-rated":
      return [{ rating: "asc" as const }, { createdAt: "desc" as const }];
    case "most-liked":
      return [{ reviewLikes: "desc" as const }, { createdAt: "desc" as const }];
    default:
      return [{ createdAt: "desc" as const }];
  }
}

export default async function BookDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const authUser = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });
  const isAdmin = await isUserAdmin();
  const resolvedSearchParams = await searchParams;
  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const rawSort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "";
  const sort = reviewSortOptions.some((option) => option.value === rawSort) ? rawSort : "newest";
  const reviewsSkip = (page - 1) * REVIEWS_PER_PAGE;

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
        orderBy: reviewOrderBy(sort),
        take: REVIEWS_PER_PAGE,
        skip: reviewsSkip,
      },
    },
  });

  const totalReviews = await prisma.review.count({
    where: {
      bookId: id,
    },
  });
  const totalReviewPages = Math.max(1, Math.ceil(totalReviews / REVIEWS_PER_PAGE));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalReviewPages;

  const allCategories = isAdmin ? await prisma.category.findMany({ orderBy: { name: "asc" } }) : [];

  const pageQuery = new URLSearchParams();
  pageQuery.set("sort", sort);

  const hasUserLikedBook = book?.votes && book.votes.length > 0;

  if (!book) {
    notFound();
  }

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6 relative">
      {/* Hero section */}
      <div className="flex gap-8 pb-8 border-b border-border relative">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt="Book Cover"
            width={192}
            height={288}
            loading="eager"
            className="rounded-md shadow-md object-cover shrink-0 w-auto h-auto"
          />
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary">{book.title}</h1>
          <p className="italic text-text-muted">
            by{" "}
            {book.authors?.length
              ? book.authors.map((author: { id: string; name: string }, i: number) => (
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
                className={`border hover:scale-110 transition-transform duration-150 ${hasUserLikedBook ? "border-accent text-accent" : "border-border text-text-muted"}`}
              >
                <ThumbsUp
                  className={`w-4 h-4 mr-1 transition-all duration-200 ${
                    hasUserLikedBook
                      ? "fill-accent text-accent scale-110"
                      : "text-text-muted scale-100"
                  }`}
                />
                {hasUserLikedBook ? "Liked" : "Like"} ({book.likeCount || 0})
              </Button>
            </form>
            <span className="text-sm text-text-muted border border-border px-3 py-1 rounded-md">
              <span className="inline-flex items-center gap-2">
                <span className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i <= Math.round(book.averageRating || 0)
                          ? "fill-accent text-accent"
                          : "text-border"
                      }`}
                    />
                  ))}
                </span>
                {book.averageRating ? book.averageRating.toFixed(1) : "—"}
              </span>
            </span>
          </div>

          {/* Categories */}
          {book.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {book.categories.map((cat: { id: string; name: string }) => (
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
        {isAdmin && <EditBookModal book={book} allCategories={allCategories} />}
      </div>

      {/* Write a review */}
      <div className="mt-8 bg-surface border border-border rounded-md p-4 flex gap-4">
        <div className="relative w-10 h-10 bg-border rounded-full shrink-0 overflow-hidden flex items-center justify-center">
          {dbUser?.avatarUrl ? (
            <Image
              src={dbUser.avatarUrl}
              alt={dbUser.name || "User"}
              fill
              sizes="40px"
              className="object-cover"
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
              defaultValue=""
              className="bg-background border border-border text-text-primary rounded-md px-2 py-1 text-sm outline-none focus:border-accent font-sans"
            >
              <option value="" disabled>
                Select a rating...
              </option>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Average</option>
              <option value="2">2 — Poor</option>
              <option value="1">1 — Terrible</option>
            </select>
          </div>
          <MarkdownEditor name="review-text" placeholder="Write your review..." />
          <Button type="submit" variant="primary" className="mt-2">
            Publish Review
          </Button>
        </form>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-xl font-bold text-text-primary">Reviews ({totalReviews})</h3>
          <SortSelect value={sort} options={[...reviewSortOptions]} />
        </div>

        {book.aiSummary && <AISummaryCard summary={book.aiSummary} />}

        {book.reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {book.reviews.map(
              (review: {
                id: string;
                bookId: string;
                userId: string;
                content: string;
                rating: number;
                reviewLikes: number;
                createdAt: Date;
                user: { name: string | null; avatarUrl: string | null };
              }) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  bookId={review.bookId}
                  isOwner={dbUser?.id === review.userId}
                  user={review.user}
                  rating={review.rating}
                  content={review.content}
                  reviewLikes={review.reviewLikes}
                  createdAt={review.createdAt}
                />
              ),
            )}
          </div>
        ) : (
          <p className="text-sm text-text-muted bg-surface p-6 rounded-md text-center border border-dashed border-border">
            No reviews yet. Be the first to review!
          </p>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalReviewPages}
          baseUrl={`/books/${book.id}`}
          queryParams={pageQuery.toString()}
        />
      </div>
    </main>
  );
}
