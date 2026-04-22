"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateBookAverageRating } from "@/lib/ratings";
import { Prisma } from "@prisma/client";

export async function ToggleLike(formData: FormData) {
  try {
    const authUser = await requireUser();
    const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!dbUser) throw new Error("User not found");

    const bookId = formData.get("book-id") as string;
    if (!bookId) return;

    // Check if the user already voted for this book
    const existingVote = await prisma.bookVote.findUnique({
      where: {
        userId_bookId: {
          userId: dbUser.id,
          bookId: bookId,
        },
      },
    });

    if (existingVote) {
      // User already liked it, so we toggle it OFF (delete the vote)
      await prisma.bookVote.delete({
        where: { id: existingVote.id },
      });
      // Decrement the book's total likeCount
      await prisma.book.update({
        where: { id: bookId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      // User hasn't liked it yet, so we toggle it ON (create the vote)
      await prisma.bookVote.create({
        data: {
          userId: dbUser.id,
          bookId: bookId,
        },
      });
      // Increment the book's total likeCount
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
