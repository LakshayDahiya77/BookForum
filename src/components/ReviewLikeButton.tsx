"use client";

import { useState, useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();

  const visibleLikes = Math.max(0, reviewLikes + (liked ? 1 : 0));

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
          setLiked((prev) => !prev);
        });
      }}
      className="text-xs font-semibold text-text-muted hover:text-accent transition-colors disabled:opacity-60"
    >
      {liked ? "Unlike" : "Like"} ({visibleLikes})
    </button>
  );
}
