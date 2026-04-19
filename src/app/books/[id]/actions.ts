"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { updateBookAverageRating } from "@/lib/ratings";

export async function AddReview(formData: FormData) {
  try {
    const authUser = await requireUser();
    const dbUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!dbUser) throw new Error("User not found");

    const bookId = formData.get("book-id") as string;
    const content = formData.get("review-text") as string;

    if (!bookId || !content) return;

    await prisma.review.create({
      data: {
        content,
        rating: 5, // Default rating for now
        userId: dbUser.id,
        bookId: bookId,
      },
    });

    await updateBookAverageRating(bookId);

    revalidatePath(`/books/${bookId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to publish review.");
  }
}
