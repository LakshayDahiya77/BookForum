import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import BookGrid from "@/components/BookGrid";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import PaginationControl from "@/components/PaginationControl";
import { APP_CONFIG } from "@/lib/config";

const BOOKS_PER_PAGE = APP_CONFIG.pagination.booksPerPage;

const booksSortOptions = [
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

export default async function BooksGridPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireUser();

  const resolvedSearchParams = await searchParams;
  const qRaw = resolvedSearchParams.q;
  const q = typeof qRaw === "string" ? qRaw.trim() : "";
  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const rawSort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "";
  const sort = booksSortOptions.some((option) => option.value === rawSort)
    ? rawSort
    : "latest-added";
  const skip = (page - 1) * BOOKS_PER_PAGE;

  const whereClause = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { authors: { some: { name: { contains: q, mode: "insensitive" as const } } } },
        ],
      }
    : undefined;

  const [books, totalBooks] = await Promise.all([
    prisma.book.findMany({
      where: whereClause,
      include: {
        authors: true,
        categories: true,
      },
      orderBy: categoryBookOrderBy(sort),
      skip,
      take: BOOKS_PER_PAGE,
    }),
    prisma.book.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalBooks / BOOKS_PER_PAGE));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  const queryBase = new URLSearchParams();
  if (q) queryBase.set("q", q);
  queryBase.set("sort", sort);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-2">All Books</h1>
        <p className="text-text-muted mb-6">Discover and explore our entire collection</p>

        <div className="mb-6 flex flex-col gap-4">
          <SearchBar defaultValue={q} preserveParams />
          <div className="flex justify-between items-center sm:flex-row">
            <p className="text-sm text-text-muted">{totalBooks} books found</p>
            <SortSelect value={sort} options={[...booksSortOptions]} />
          </div>
        </div>

        {q ? (
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Results for &apos;{q}&apos;
          </h2>
        ) : null}

        {books.length > 0 ? (
          <BookGrid books={books} />
        ) : q ? (
          <p className="text-text-muted bg-surface border border-border rounded-md px-4 py-3">
            No books found for &apos;{q}&apos;
          </p>
        ) : (
          <BookGrid books={books} />
        )}

        {totalBooks > BOOKS_PER_PAGE && <PaginationControl totalPages={totalPages} />}
      </div>
    </div>
  );
}

