import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReviewSnippetCard } from "@/components/ReviewCard";
import SortSelect from "@/components/SortSelect";
import { updateAvatar } from "./actions";
import { Edit2, ThumbsUp } from "lucide-react";

const reviewSortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "highest-rated" },
] as const;

const likedSortOptions = [
  { label: "Recently Liked", value: "recently-liked" },
  { label: "Top Rated", value: "top-rated" },
] as const;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const authUser = await requireUser();
  const resolvedSearchParams = await searchParams;
  const rawTab =
    typeof resolvedSearchParams.tab === "string" ? resolvedSearchParams.tab : "reviews";
  const tab = rawTab === "liked" ? "liked" : "reviews";

  const rawReviewSort =
    typeof resolvedSearchParams.reviewSort === "string" ? resolvedSearchParams.reviewSort : "";
  const reviewSort = reviewSortOptions.some((option) => option.value === rawReviewSort)
    ? rawReviewSort
    : "newest";

  const rawLikedSort =
    typeof resolvedSearchParams.likedSort === "string" ? resolvedSearchParams.likedSort : "";
  const likedSort = likedSortOptions.some((option) => option.value === rawLikedSort)
    ? rawLikedSort
    : "recently-liked";

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      _count: {
        select: {
          reviews: true,
          bookVotes: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const reviews =
    tab === "reviews"
      ? await prisma.review.findMany({
          where: { userId: user.id },
          include: { book: true },
          orderBy:
            reviewSort === "highest-rated"
              ? [{ rating: "desc" }, { createdAt: "desc" }]
              : [{ createdAt: "desc" }],
        })
      : [];

  const votes =
    tab === "liked"
      ? await prisma.bookVote.findMany({
          where: { userId: user.id },
          include: {
            book: {
              include: {
                authors: true,
                categories: true,
              },
            },
          },
          orderBy: {
            id: "desc",
          },
        })
      : [];

  const likedBooks =
    tab === "liked"
      ? likedSort === "top-rated"
        ? votes
            .map((vote) => vote.book)
            .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
        : votes.map((vote) => vote.book)
      : [];

  const tabQuery = new URLSearchParams();
  tabQuery.set("reviewSort", reviewSort);
  tabQuery.set("likedSort", likedSort);

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-background rounded-full shrink-0 overflow-hidden border-2 border-border shadow-md">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-accent text-3xl font-bold">
                  {(user.name || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <form action={updateAvatar} className="flex flex-col items-center gap-2">
              <input
                type="file"
                name="avatarFile"
                accept="image/*"
                required
                className="max-w-44 text-xs text-text-muted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer"
              />
              <button
                type="submit"
                className="text-xs font-semibold px-3 py-1 rounded-md border border-border text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                Change Avatar
              </button>
            </form>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{user.name || "Reader"}</h1>
            <p className="text-text-muted">{user.email}</p>
            <div className="mt-2 flex gap-4 text-sm text-text-muted font-medium">
              <span className="inline-flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4" />
                {user._count.bookVotes} Books Liked
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Edit2 className="w-4 h-4" />
                {user._count.reviews} Reviews Written
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-border">
          <Link
            href={`/profile?${new URLSearchParams({ ...Object.fromEntries(tabQuery), tab: "reviews" }).toString()}`}
            className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === "reviews"
                ? "text-accent border-accent"
                : "text-text-muted border-transparent hover:text-text-primary"
            }`}
          >
            My Reviews
          </Link>
          <Link
            href={`/profile?${new URLSearchParams({ ...Object.fromEntries(tabQuery), tab: "liked" }).toString()}`}
            className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === "liked"
                ? "text-accent border-accent"
                : "text-text-muted border-transparent hover:text-text-primary"
            }`}
          >
            Liked Books
          </Link>
        </div>

        {tab === "reviews" ? (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">My Reviews</h2>
              <SortSelect name="reviewSort" value={reviewSort} options={[...reviewSortOptions]} />
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <ReviewSnippetCard
                    key={review.id}
                    userName={user.name || "Anonymous"}
                    content={review.content}
                    rating={review.rating}
                    reviewLikes={review.reviewLikes}
                    bookId={review.book.id}
                    bookTitle={review.book.title}
                  />
                ))}
              </div>
            ) : (
              <div>
                <p className="mb-2 text-text-muted">You haven&apos;t written any reviews yet.</p>
                <Link href="/books" className="text-accent hover:underline font-semibold">
                  Find a book to review
                </Link>
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">Liked Books</h2>
              <SortSelect name="likedSort" value={likedSort} options={[...likedSortOptions]} />
            </div>

            {likedBooks.length > 0 ? (
              <BookGrid books={likedBooks} />
            ) : (
              <p className="text-text-muted">You have not liked any book yet.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
