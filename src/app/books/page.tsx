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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {/* Book Cover */}
              {book.coverUrl ? (
                <div className="w-full h-56 bg-gray-200 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No cover image</span>
                </div>
              )}

              {/* Book Info */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{book.title}</h2>

                {/* Authors */}
                {book.authors.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    by {book.authors.map((a) => a.name).join(", ")}
                  </p>
                )}

                {/* Publish Year */}
                {book.publishYear && (
                  <p className="text-xs text-gray-500 mb-3">{book.publishYear}</p>
                )}

                {/* Categories */}
                {book.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {book.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {book.categories.length > 2 && (
                      <span className="text-xs text-gray-600 px-2 py-1">
                        +{book.categories.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {book.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                    {book.description}
                  </p>
                )}

                {/* Vote Counts */}
                <div className="flex gap-2 text-xs text-gray-600 mb-4 border-t pt-3">
                  <span>👍 {book.likeCount}</span>
                  <span>👎 {book.dislikeCount}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Like
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
