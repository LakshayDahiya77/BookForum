import { logout } from "./actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";
import { redirect } from "next/navigation";
import ReviewCard from "@/components/ReviewCard";

export default async function ProfilePage() {
  const authUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
    include: {
      bookVotes: {
        include: {
          book: {
            include: {
              authors: true,
              categories: true,
            },
          },
        },
        orderBy: {
          bookId: "asc",
        },
      },
      reviews: {
        include: {
          book: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const likedBooks = user.bookVotes.map((vote) => vote.book);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex-shrink-0 overflow-hidden border-4 border-white shadow-md">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-blue-600 text-3xl font-bold">
                {(user.name || "U")[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name || "Reader"}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-600 font-medium">
              <span>👍 {likedBooks.length} Books Liked</span>
              <span>📝 {user.reviews.length} Reviews Written</span>
            </div>
          </div>
        </div>

        {/* liked books */}
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">Books You Love</h2>
          {likedBooks.length > 0 ? (
            <BookGrid books={likedBooks} />
          ) : (
            <p>You have not liked any book yet.</p>
          )}
        </section>

        {/* written reviews */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Your reviews</h2>
          {user.reviews.length > 0 ? (
            <div className="flex flex-col gap-8">
              {user.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  bookId={review.bookId}
                  isOwner={true}
                  user={{ name: user.name, avatarUrl: user.avatarUrl }}
                  rating={review.rating}
                  content={review.content}
                  createdAt={review.createdAt}
                  bookContext={{ id: review.book.id, title: review.book.title }}
                />
              ))}
            </div>
          ) : (
            <div>
              <p className="mb-2">You haven't written any reviews yet.</p>
              <Link href="/books" className="text-blue-600 underline">
                Find a book to review
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
