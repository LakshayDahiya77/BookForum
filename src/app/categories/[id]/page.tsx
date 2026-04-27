import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";
import { notFound } from "next/navigation";
import Image from "next/image";
import SortSelect from "@/components/SortSelect";
import PaginationControl from "@/components/PaginationControl";
import { APP_CONFIG } from "@/config/app";

const BOOKS_PER_PAGE = APP_CONFIG.pagination.booksPerPage;

const categorySortOptions = [
  { label: "Latest Added", value: "latest-added" },
  { label: "Oldest Added", value: "oldest-added" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Most Liked", value: "most-liked" },
  { label: "Most Reviewed", value: "most-reviewed" },
] as const;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  if (!value || Array.isArray(value)) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function categoryBookOrderBy(sort: string) {
  switch (sort) {
    case "oldest-added":
      return [{ createdAt: "asc" as const }];
    case "top-rated":
      return [{ averageRating: "desc" as const }, { createdAt: "desc" as const }];
    case "most-liked":
      return [{ likeCount: "desc" as const }, { createdAt: "desc" as const }];
    case "most-reviewed":
      return [{ reviewCount: "desc" as const }, { createdAt: "desc" as const }];
    default:
      return [{ createdAt: "desc" as const }];
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireUser();

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const rawSort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "";
  const sort = categorySortOptions.some((option) => option.value === rawSort)
    ? rawSort
    : "latest-added";
  const skip = (page - 1) * BOOKS_PER_PAGE;

  const category = await prisma.category.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
    },
  });

  if (!category) {
    notFound();
  }

  const [books, totalBooks] = await Promise.all([
    prisma.book.findMany({
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
      include: {
        authors: true,
        categories: true,
      },
      orderBy: categoryBookOrderBy(sort),
      skip,
      take: BOOKS_PER_PAGE,
    }),
    prisma.book.count({
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalBooks / BOOKS_PER_PAGE));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const queryBase = new URLSearchParams();
  queryBase.set("sort", sort);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header based on the Category */}
        <div className="flex items-center gap-4 mb-8">
          {category.icon && (
            <Image
              src={category.icon}
              alt={category.name}
              width={64}
              height={64}
              className="object-contain"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-1">{category.name}</h1>
            {category.description && <p className="text-text-muted">{category.description}</p>}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">{totalBooks} books found</p>
          <SortSelect value={sort} options={[...categorySortOptions]} />
        </div>

        <BookGrid books={books} />

        <PaginationControl totalPages={totalPages} />
      </div>
    </div>
  );
}
