import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/buttons/simpleButton";
import { AddReview } from "./actions";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const authUser = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id: id },
    include: {
      authors: true,
      categories: true,
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
  if (!book) {
    notFound();
  }
  return (
    <main>
      {/* Hero section - book details and cover*/}
      <div>
        <div className="flex p-5 max-w-7xl gap-8 outline-blue-200 outline-2">
          {book.coverUrl && (
            <Image
              src={book.coverUrl}
              alt="Book Cover"
              width={192}
              height={288}
              className="rounded-lg shadow-md object-cover"
            />
          )}

          {/* Text details */}
          <div className="flex flex-col gap-4">
            <h3>{book.title}</h3>
            <h2 className="italic">
              by{" "}
              {book.authors?.length
                ? book.authors.map((author, i) => (
                    <span key={author.id ?? i}>
                      <Link href={`/authors/${author.id}`} className="font-semibold">
                        {author.name}
                      </Link>
                      {i < book.authors.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "Unknown Author"}
            </h2>
            <h2>Published: {book.publishYear}</h2>

            <div className="mt-3 flex flex-col gap-2">
              <div className="flex gap-2 items-center mt-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 border">
                  👍 {book.likeCount || 0}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 border text-gray-700">
                  ⭐ {book.averageRating || 0}
                </Button>
              </div>

              {/* Categories */}
              {book.categories.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {book.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border hover:bg-gray-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {book.description && (
              <div className="mt-4 text-gray-800">
                <h4 className="font-bold mb-1">About this book</h4>
                <p className="text-sm leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*Publish Your review */}

      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 flex gap-4 max-w-7xl mx-5 mt-8">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          {dbUser?.avatarUrl ? (
            <img
              src={dbUser.avatarUrl}
              alt={dbUser.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-500 font-bold">
              {(dbUser?.name || "U")[0].toUpperCase()}
            </div>
          )}
        </div>
        <form className="flex-1 font-black" action={AddReview}>
          <input type="hidden" name="book-id" value={book.id} />
          <textarea
            rows={6}
            placeholder="Write your review..."
            name="review-text"
            required
            className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-400"
          />
          <Button type="submit" variant="primary" className="mt-2">
            Publish Review
          </Button>
        </form>
      </div>
      {/* Review section */}
      <div className="p-5 max-w-7xl mt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-4">Reviews ({book.reviews.length})</h3>

        {book.reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {book.reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border border-gray-200 rounded-md bg-gray-50 flex gap-4"
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                  {review.user.avatarUrl ? (
                    <img
                      src={review.user.avatarUrl}
                      alt={review.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-500 font-bold">
                      {(review.user.name || "A")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold">{review.user.name || "Anonymous"}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-yellow-600 text-sm mb-2">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="text-sm text-gray-700">{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </main>
  );
}
