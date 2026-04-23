import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();

  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id: id },
    include: {
      books: {
        include: {
          authors: true,
          categories: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header based on the Category */}
        <div className="flex items-center gap-4 mb-8">
          {category.icon && (
            <img src={category.icon} alt={category.name} className="w-16 h-16 object-contain" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-1">{category.name}</h1>
            {category.description && <p className="text-text-muted">{category.description}</p>}
          </div>
        </div>

        <BookGrid books={category.books} />
      </div>
    </div>
  );
}
