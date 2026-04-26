import { prisma } from "@/lib/prisma";

// Recalculates and updates Book.averageRating after any review change
export async function updateBookAverageRating(bookId: string) {
  const result = await prisma.review.aggregate({
    where: { bookId },
    _avg: { rating: true },
  });

  await prisma.book.update({
    where: { id: bookId },
    data: { averageRating: result._avg.rating ?? 0 },
  });
}
