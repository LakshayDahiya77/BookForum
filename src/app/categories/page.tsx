import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Library Shelves</h1>

        {/* The Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="bg-white rounded-md p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Icon Wrapper */}
              <div className="w-20 h-20 mb-4 flex items-center justify-center">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Content */}
              <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                {category.name}
              </h2>
              <p className="text-[0.8rem] text-gray-500 line-clamp-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
