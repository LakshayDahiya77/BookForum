import Link from "next/link";
import { DeleteReview } from "@/app/books/[id]/actions";

type ReviewCardProps = {
  id: string;
  bookId: string;
  isOwner?: boolean;
  user: {
    name: string | null;
    avatarUrl: string | null;
  };
  rating: number;
  content: string;
  createdAt: Date;
  bookContext?: {
    id: string;
    title: string;
  };
};

export default function ReviewCard({
  id,
  bookId,
  isOwner,
  user,
  rating,
  content,
  createdAt,
  bookContext,
}: ReviewCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white shadow-sm flex flex-col gap-3">
      {/* Optional Book Context (for profile pages) */}
      {bookContext && (
        <Link href={`/books/${bookContext.id}`} className="hover:opacity-80 transition-opacity">
          <h3 className="font-bold text-blue-900 text-sm mb-1">{bookContext.title}</h3>
        </Link>
      )}

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden border border-gray-300">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-500 font-bold text-sm">
              {(user.name || "A")[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-gray-900">{user.name || "Anonymous"}</span>
            <span className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          {/* The Delete Button (Only shows if they own it) */}
          {isOwner && (
            <form action={DeleteReview}>
              <input type="hidden" name="review-id" value={id} />
              <input type="hidden" name="book-id" value={bookId} />
              <button
                type="submit"
                className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
              >
                Delete
              </button>
            </form>
          )}
          <div className="text-yellow-500 text-sm mb-2">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}

export function AISummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <div className="relative overflow-hidden p-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-sm mb-8">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

      <div className="relative z-10 flex gap-4 items-start">
        <div className="text-2xl mt-1">✨</div>
        <div>
          <h3 className="font-bold text-indigo-950 mb-2 flex items-center gap-2">
            What Readers Are Saying
            <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
              AI Summary
            </span>
          </h3>
          <p className="text-sm text-indigo-900 leading-relaxed font-medium">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewSnippetCard({
  userName,
  content,
  rating,
  reviewLikes,
  bookId,
  bookTitle,
}: {
  userName: string;
  content: string;
  rating: number;
  reviewLikes: number;
  bookId: string;
  bookTitle: string;
}) {
  return (
    <Link href={`/books/${bookId}`} className="block hover:opacity-90 transition-opacity">
      <div className="bg-surface border border-border rounded-md p-4 flex flex-col gap-3 h-full">
        {/* Book title */}
        <p className="text-xs text-accent font-medium italic line-clamp-1">{bookTitle}</p>
        {/* Rating */}
        <div className="text-yellow-500 text-xs">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        {/* Review text */}
        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed flex-1">{content}</p>
        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs font-medium text-text-primary">{userName || "Anonymous"}</span>
          <span className="text-xs text-text-muted">❤️ {reviewLikes}</span>
        </div>
      </div>
    </Link>
  );
}
