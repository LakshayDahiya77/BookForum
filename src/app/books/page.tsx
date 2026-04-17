import { prisma } from "@/lib/prisma";
import { Button } from "@/components/buttons/simpleButton";
import { requireUser } from "@/lib/auth";

export default async function BooksGridPage() {
  await requireUser();
  const books = await prisma.book.findMany({
    include: {
      authors: true,
      categories: true,
    },
  });

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">No Books Yet</h1>
          <p className="text-gray-600">Check back soon for new books!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Books</h1>
        <p className="text-gray-600 mb-8">Discover and explore our collection of books</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex gap-5 hover:shadow-md transition-shadow"
            >
              {/* Book Cover */}
              <div className="shrink-0 w-32 h-54 bg-gray-100 rounded-sm shadow-sm flex items-center justify-center overflow-hidden">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">No cover</span>
                )}
              </div>

              {/* Book Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                    {book.title}
                  </h2>
                  {/* Authors */}
                  {book.authors.length > 0 && (
                    <p className="text-[0.9rem] italic font-semibold text-gray-600 line-clamp-2">
                      by {book.authors.map((a) => a.name).join(", ")}
                    </p>
                  )}
                  {/* Description / Subtitle */}
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  )}
                </div>

                {/* Footer items */}
                <div className="mt-3 flex flex-col gap-2">
                  {/* Action Buttons (Like / Dislike) */}
                  <div className="flex gap-2 items-center mt-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                      👍 {book.likeCount || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-gray-500">
                      👎{book.dislikeCount || 0}
                    </Button>
                  </div>
                  {/* Categories */}
                  {book.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 line-clamp-2 overflow-hidden max-h-12">
                      {book.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-[0.65rem] bg-blue-50 text-blue-700 px-2 py-0.5 rounded cursor-default border border-blue-100"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
