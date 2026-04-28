"use client";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

type ReviewLikeButtonProps = {
  reviewId: string;
  bookId: string;
  reviewLikes: number;
  action: (formData: FormData) => Promise<void>;
};

export default function ReviewLikeButton({
  reviewId,
  bookId,
  reviewLikes,
  action,
}: ReviewLikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(reviewLikes);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const formData = new FormData();
          formData.set("review-id", reviewId);
          formData.set("book-id", bookId);
          formData.set("liked", String(liked));
          await action(formData);
          setLocalLikes((prev) => (liked ? prev - 1 : prev + 1));
          setLiked((prev) => !prev);
        });
      }}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md border transition-colors disabled:opacity-60 disabled:animate-pulse hover:scale-110 duration-150 ${
        liked ? "border-danger text-danger" : "border-border text-text-muted hover:border-danger/50"
      }`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-all duration-200 ${
          liked ? "fill-danger text-danger" : "text-text-muted"
        }`}
      />
      <span>{localLikes}</span>
    </button>
  );
}
