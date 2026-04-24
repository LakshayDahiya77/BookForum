import { Suspense } from "react";
import Link from "next/link";

function ErrorContent({ message }: { message?: string }) {
  return (
    <div className="p-8 text-center bg-background text-text-primary">
      <h1>Something went wrong</h1>
      {message ? (
        <p className="text-danger mt-4">{message}</p>
      ) : (
        <p className="text-text-muted mt-4">An unexpected error occurred. Please try again.</p>
      )}
      <p className="mt-8 text-sm text-text-muted">
        <Link href="/" className="text-accent hover:underline">
          ← Go back
        </Link>
      </p>
    </div>
  );
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorContent message={resolvedSearchParams.error} />
    </Suspense>
  );
}
