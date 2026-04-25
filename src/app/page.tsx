import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import { ReviewSnippetCard } from "@/components/ReviewCard";
import SearchBar from "@/components/SearchBar";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  await requireUser();

  const [trendingBooks, newestBooks, recentReviews] = await Promise.all([
    prisma.book.findMany({
      take: 4,
      orderBy: { likeCount: "desc" },
      include: { authors: true, categories: true },
    }),
    prisma.book.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { authors: true, categories: true },
    }),
    prisma.review.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        book: { select: { id: true, title: true } },
      },
    }),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-16">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 py-10">
        <Image
          src="/site-logo-transparent.png"
          alt="Literary Insights"
          width={280}
          height={98}
          priority
          className="object-contain"
        />
        <p className="text-text-muted text-center max-w-md">
          Discover, discuss, and share the books that matter to you.
        </p>
        <SearchBar />
      </section>

      {/* Trending Books */}
      {trendingBooks.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Trending Now</h2>
            <Link
              href="/books"
              className="text-sm text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">From the Community</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentReviews.map((review) => (
              <ReviewSnippetCard
                key={review.id}
                userName={review.user.name || "Anonymous"}
                content={review.content}
                rating={review.rating}
                reviewLikes={review.reviewLikes}
                bookId={review.book.id}
                bookTitle={review.book.title}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newest Books */}
      {newestBooks.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Recently Added</h2>
            <Link
              href="/books"
              className="text-sm text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newestBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
