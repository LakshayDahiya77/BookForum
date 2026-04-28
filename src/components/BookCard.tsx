import Link from "next/link";
import Image from "next/image";
import { Star, ThumbsUp } from "lucide-react";

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
    <Link href={`/books/${id}`} className="block h-full">
      <div className="bg-surface rounded-md border border-border p-3 sm:p-4 flex flex-col h-full hover:border-accent transition-colors cursor-pointer gap-4">
        {/* Top part: Cover and Details */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-0">
          {/* Cover */}
          <div className="relative shrink-0 w-32 h-48 mx-auto sm:mx-0 bg-border rounded-sm overflow-hidden flex items-center justify-center shadow-sm">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 128px, 128px"
                className="object-cover"
              />
            ) : (
              <span className="text-text-muted text-xs text-center px-2">No cover</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col py-1">
            <h2
              className="text-lg font-bold text-text-primary leading-tight mb-1 line-clamp-2"
              title={title}
            >
              {title}
            </h2>
            {authors.length > 0 && (
              <p
                className="text-sm italic text-text-muted mb-3 line-clamp-2"
                title={authors.map((a) => a.name).join(", ")}
              >
                by {authors.map((a) => a.name).join(", ")}
              </p>
            )}
            {description && (
              <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Bottom part: Stats and Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-auto">
          {/* Stats aligned under the cover */}
          <div className="w-full sm:w-32 shrink-0 flex items-center justify-between text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5 cursor-default" title="Likes">
              <ThumbsUp className="w-4 h-4 text-text-muted" />
              {likeCount || 0}
            </span>
            <span className="inline-flex items-center gap-1 mt-0.5 cursor-default" title="Rating">
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i <= Math.round(averageRating || 0)
                        ? "fill-accent text-accent"
                        : "text-border"
                    }`}
                  />
                ))}
              </span>
              <span className="ml-0.5">{averageRating ? Math.round(averageRating) : 0}</span>
            </span>
          </div>

          {/* Categories aligned with details */}
          {categories.length > 0 && (
            <div className="flex-1 flex gap-2 items-center min-w-0 overflow-hidden">
              {categories.slice(0, 1).map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs bg-background text-text-muted px-2.5 py-1 rounded-sm border border-border truncate shadow-sm"
                  title={cat.name}
                >
                  {cat.name}
                </span>
              ))}
              {categories.length > 1 && (
                <span
                  className="text-xs bg-background text-text-muted px-2 py-1 rounded-sm border border-border shrink-0 shadow-sm font-medium"
                  title={categories
                    .slice(1)
                    .map((c) => c.name)
                    .join(", ")}
                >
                  +{categories.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
