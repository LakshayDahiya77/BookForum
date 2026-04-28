"use client";

import Link from "next/link";
import { useTransition } from "react";
import Image from "next/image";
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
    createdAt?: Date;
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
  const [isPending, startTransition] = useTransition();

  return (
    <div className="p-5 border border-border rounded-md bg-surface flex flex-col gap-4">
      {/* Optional Book Context */}
      {bookContext && (
        <Link href={`/books/${bookContext.id}`} className="hover:opacity-80 transition-opacity">
          <h3 className="font-bold text-accent text-sm">{bookContext.title}</h3>
        </Link>
      )}

      {/* Header — avatar, name, member since, stars, date */}
      <div className="flex gap-4 items-start">
        {/* Avatar */}
        <div className="relative w-10 h-10 bg-background rounded-full shrink-0 overflow-hidden border border-border">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || "User"}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-text-muted font-bold text-sm">
              {(user.name || "A")[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + member since + stars */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            {/* Left — name + member since */}
            <div>
              <span className="font-bold text-text-primary">{user.name || "Anonymous"}</span>
              {user.createdAt && (
                <p className="text-xs text-text-muted mt-0.5">
                  Member since {new Date(user.createdAt).getFullYear()}
                </p>
              )}
            </div>
            {/* Right — stars + date */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= rating ? "fill-accent text-accent" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review content */}
      <div className="border-b border-t border-border pt-2 pb-2">
        <MarkdownPreview
          source={content}
          className="text-sm text-text-primary leading-relaxed wmde-markdown-reset"
        />
      </div>

      {/* Footer — like centered, delete right */}
      <div className="relative flex justify-center items-center pt-1">
        <ReviewLikeButton
          action={ToggleReviewLike}
          reviewId={id}
          bookId={bookId}
          reviewLikes={reviewLikes}
        />
        {isOwner && (
          <div className="absolute right-0">
            <form action={(formData) => startTransition(() => DeleteReview(formData))}>
              <input type="hidden" name="review-id" value={id} />
              <input type="hidden" name="book-id" value={bookId} />
              <button
                type="submit"
                disabled={isPending}
                className={`inline-flex items-center gap-1 text-xs font-semibold text-danger border border-border px-2 py-1 rounded-md hover:border-danger transition-colors ${
                  isPending ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPending ? "Deleting..." : "Delete"}</span>
              </button>
            </form>
          </div>
        )}
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
