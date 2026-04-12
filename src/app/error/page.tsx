import { Suspense } from "react";

function ErrorContent({ message }: { message?: string }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      {message ? (
        <p style={{ color: "#d32f2f", marginTop: "1rem" }}>{message}</p>
      ) : (
        <p>An unexpected error occurred. Please try again.</p>
      )}
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
        <a href="/">← Go back</a>
      </p>
    </div>
  );
}

export default function ErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorContent message={(searchParams as any).error} />
    </Suspense>
  );
}
