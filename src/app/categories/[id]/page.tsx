import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";
import { notFound } from "next/navigation";

// In recent Next.js versions, params must be awaited
export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();

  const { id } = await params;

  // Find the category and include all related books (with their authors/categories)
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

  // If someone types a bad ID in the URL, show the 404 page
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header based on the Category */}
        <div className="flex items-center gap-4 mb-8">
          {category.icon && (
            <img src={category.icon} alt={category.name} className="w-16 h-16 object-contain" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{category.name}</h1>
            {category.description && <p className="text-gray-600">{category.description}</p>}
          </div>
        </div>

        {/* Use your shared component! */}
        <BookGrid books={category.books} />
      </div>
    </div>
  );
}
