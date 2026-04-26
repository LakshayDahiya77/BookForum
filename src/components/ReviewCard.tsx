import Link from "next/link";
import { DeleteReview, ToggleReviewLike } from "@/app/books/[id]/actions";
import ReviewLikeButton from "@/components/ReviewLikeButton";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Heart, Sparkles, Star, Trash2 } from "lucide-react";

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
  reviewLikes: number;
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
  reviewLikes,
  createdAt,
  bookContext,
}: ReviewCardProps) {
  return (
    <div className="p-4 border border-border rounded-md bg-surface shadow-sm flex flex-col gap-3">
      {/* Optional Book Context (for profile pages) */}
      {bookContext && (
        <Link href={`/books/${bookContext.id}`} className="hover:opacity-80 transition-opacity">
          <h3 className="font-bold text-accent text-sm mb-1">{bookContext.title}</h3>
        </Link>
      )}

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-background rounded-full shrink-0 overflow-hidden border border-border">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-text-muted font-bold text-sm">
              {(user.name || "A")[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-text-primary">{user.name || "Anonymous"}</span>
            <span className="text-xs text-text-muted">
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
                className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:scale-110 transition-transform duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </form>
          )}
          <div className="flex gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i <= rating ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <MarkdownPreview
            source={content}
            className="text-sm text-text-primary leading-relaxed wmde-markdown-reset"
          />
          <div className="mt-3">
            <ReviewLikeButton
              action={ToggleReviewLike}
              reviewId={id}
              bookId={bookId}
              reviewLikes={reviewLikes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AISummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <div className="relative overflow-hidden p-6 rounded-xl border border-border bg-surface shadow-sm mb-8">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-50"></div>

      <div className="relative z-10 flex gap-4 items-start">
        <Sparkles className="w-6 h-6 text-accent mt-1" />
        <div>
          <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2">
            What Readers Are Saying
            <span className="text-[10px] uppercase tracking-wider font-bold bg-background text-accent px-2 py-0.5 rounded-full border border-border">
              AI Summary
            </span>
          </h3>
          <p className="text-sm text-text-primary leading-relaxed font-medium">{summary}</p>
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
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i <= rating ? "fill-accent text-accent" : "text-border"}`}
            />
          ))}
        </div>
        {/* Review text */}
        <MarkdownPreview
          source={content}
          className="text-sm text-text-muted leading-relaxed flex-1 line-clamp-2 wmde-markdown-reset"
        />
        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs font-medium text-text-primary">{userName || "Anonymous"}</span>
          <span className="text-xs text-text-muted inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-text-muted" />
            {reviewLikes}
          </span>
        </div>
      </div>
    </Link>
  );
}
