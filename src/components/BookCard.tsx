import Link from "next/link";

type BookCardProps = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  likeCount: number;
  averageRating: number;
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
};

export default function BookCard({
  id,
  title,
  description,
  coverUrl,
  likeCount,
  averageRating,
  authors,
  categories,
}: BookCardProps) {
  return (
    <Link href={`/books/${id}`}>
      <div className="bg-surface rounded-md border border-border p-5 flex gap-5 hover:border-accent transition-colors cursor-pointer">
        {/* Cover */}
        <div className="shrink-0 w-28 h-40 bg-border rounded-sm overflow-hidden flex items-center justify-center">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-text-muted text-xs text-center px-2">No cover</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h2 className="text-base font-bold text-text-primary leading-tight mb-1">{title}</h2>
            {authors.length > 0 && (
              <p className="text-sm italic text-text-muted mb-2">
                by {authors.map((a) => a.name).join(", ")}
              </p>
            )}
            {description && (
              <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">{description}</p>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-3 text-sm text-text-muted">
              <span>👍 {likeCount || 0}</span>
              <span>⭐ {averageRating || 0}</span>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-xs bg-background text-text-muted px-2 py-0.5 rounded-sm border border-border"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
