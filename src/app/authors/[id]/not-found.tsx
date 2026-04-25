import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 bg-background">
      <BookOpen className="w-16 h-16 text-text-muted" />
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-muted text-lg mb-1">Author not found</p>
        <p className="text-text-muted text-sm">
          This author no longer exists or their page has been removed.
        </p>
      </div>
      <Link
        href="/"
        className="bg-accent hover:bg-accent-hover text-background px-6 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
