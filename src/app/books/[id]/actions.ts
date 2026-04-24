"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateBookAverageRating } from "@/lib/ratings";
import { Prisma } from "@prisma/client";
import { generateBookSummary } from "@/lib/ai/summarize";
import { APP_CONFIG } from "@/config/app";

export async function ToggleLike(formData: FormData) {
  try {
    const authUser = await requireUser();
    const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!dbUser) throw new Error("User not found");

    const bookId = formData.get("book-id") as string;
    if (!bookId) return;

    const existingVote = await prisma.bookVote.findUnique({
      where: {
        userId_bookId: {
          userId: dbUser.id,
          bookId: bookId,
        },
      },
    });

    if (existingVote) {
      await prisma.bookVote.delete({
        where: { id: existingVote.id },
      });
      await prisma.book.update({
        where: { id: bookId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await prisma.bookVote.create({
        data: {
          userId: dbUser.id,
          bookId: bookId,
        },
      });
      await prisma.book.update({
        where: { id: bookId },
        data: { likeCount: { increment: 1 } },
      });
    }

    revalidatePath(`/books/${bookId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to toggle like.");
  }
}

async function updateSummaryInBackground(bookId: string) {
  try {
    const dataForAiSummary = await prisma.review.findMany({
      where: { bookId: bookId },
      select: {
        content: true,
        rating: true,
      },
    });
    const newSummary = await generateBookSummary(dataForAiSummary);

    if (newSummary) {
      await prisma.book.update({
        where: { id: bookId },
        data: { aiSummary: newSummary.trim() },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function AddReview(formData: FormData) {
  try {
    const authUser = await requireUser();
    const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!dbUser) throw new Error("User not found");

    const bookId = formData.get("book-id") as string;
    const content = formData.get("review-text") as string;
    const ratingRaw = formData.get("rating") as string;
    const rating = parseInt(ratingRaw, 10);

    if (!bookId || !content || isNaN(rating) || rating < 1 || rating > 5) return;

    await prisma.review.create({
      data: {
        content,
        rating,
        userId: dbUser.id,
        bookId: bookId,
      },
    });

    await updateBookAverageRating(bookId);

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        reviewChangeCount: { increment: 1 },
        reviewCount: { increment: 1 },
      },
    });

    if (updatedBook.reviewChangeCount >= APP_CONFIG.ai.summaryReviewThreshold) {
      await prisma.book.update({
        where: { id: bookId },
        data: { reviewChangeCount: 0 },
      });
      updateSummaryInBackground(bookId).catch(console.error);
    }

    revalidatePath(`/books/${bookId}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("You have already reviewed this book. You cannot submit another.");
      }
    }
    console.error(error);
    throw new Error("Failed to publish review.");
  }
}

export async function DeleteReview(formData: FormData) {
  try {
    const authUser = await requireUser();
    const reviewId = formData.get("review-id") as string;
    const bookId = formData.get("book-id") as string;

    if (!reviewId || !bookId) return;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== authUser.id) {
      throw new Error("Not authorized to delete this review.");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await updateBookAverageRating(bookId);

    const remainingReviewsCount = await prisma.review.count({
      where: { bookId: bookId },
    });

    // Fetch current book state to safely decrement reviewCount
    const currentBook = await prisma.book.findUnique({
      where: { id: bookId },
      select: { reviewCount: true },
    });

    if (remainingReviewsCount === 0) {
      await prisma.book.update({
        where: { id: bookId },
        data: {
          aiSummary: null,
          reviewChangeCount: 0,
          reviewCount: Math.max(0, (currentBook?.reviewCount ?? 0) - 1),
        },
      });
    } else {
      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          reviewChangeCount: { increment: 1 },
          reviewCount: Math.max(0, (currentBook?.reviewCount ?? 0) - 1),
        },
      });

      if (updatedBook.reviewChangeCount >= APP_CONFIG.ai.summaryReviewThreshold) {
        await prisma.book.update({
          where: { id: bookId },
          data: { reviewChangeCount: 0 },
        });

        updateSummaryInBackground(bookId).catch(console.error);
      }
    }

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/profile");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete review.");
  }
}

export async function ToggleReviewLike(formData: FormData) {
  const authUser = await requireUser();
  if (!authUser?.id) {
    throw new Error("Not authenticated.");
  }

  const reviewId = formData.get("review-id") as string;
  const bookId = formData.get("book-id") as string;
  const likedRaw = formData.get("liked") as string;
  const liked = likedRaw === "true";

  if (!reviewId || !bookId) return;

  if (liked) {
    await prisma.review.updateMany({
      where: {
        id: reviewId,
        reviewLikes: {
          gt: 0,
        },
      },
      data: {
        reviewLikes: {
          decrement: 1,
        },
      },
    });
  } else {
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        reviewLikes: {
          increment: 1,
        },
      },
    });
  }

  revalidatePath(`/books/${bookId}`);
  revalidatePath("/profile");
}
