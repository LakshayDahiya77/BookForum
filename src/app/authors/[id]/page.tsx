import { requireUser } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/buttons/simpleButton";

export default async function AuthorProfilePage({ params }: { params: { id: string } }) {
  await requireUser();

  const isAdmin = await isUserAdmin();

  const author = await prisma.author.findUnique({
    where: {
      id: params.id,
    },
    include: {
      books: true,
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="flex flex-col items-start justify-between">
      <div className="flex items-center gap-6">
        {/* Author Photo (with fallback if null) */}
        {author.photoUrl ? (
          <img
            src={author.photoUrl}
            alt={author.name}
            className="w-32 h-32 rounded-full object-cover"
          ></img>
        ) : (
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-800">
            No Photo
          </div>
        )}
        {/* Author Name with Bio (with fallback if bio is null) */}
        <div>
          <h2 className="text-3xl font-bold">{author.name}</h2>
          {author.bio && <p className="text-slate-600 mt-2 max-w-xl">{author.bio}</p>}
        </div>
        {/* --- INLINE ADMIN CONTROLS --- */}
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
            <span className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2 block">
              Admin Controls
            </span>
            {/* You will eventually wire this to open an Edit Modal */}
            <Button variant="secondary">Edit Author</Button>
          </div>
        )}
      </div>

      {/* --- BOOKS GRID SECTION --- */}
      <div className="mt-16 w-full">
        <h2 className="text-2xl font-bold mb-6">Books by {author.name}</h2>

        {author.books.length === 0 ? (
          <p className="text-slate-500">No books found for this author yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {author.books.map((book) => (
              <div key={book.id} className="border rounded-md p-4 flex flex-col gap-3">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    // Changed to a rectangle ratio instead of a circle
                    className="w-full aspect-2/3 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-full aspect-2/3 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 text-center p-4">
                    No Cover Photo
                  </div>
                )}
                <h3 className="font-medium text-center">{book.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
