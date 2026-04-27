"use client";

import { useState } from "react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(String(currentPage));

  const handlePageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      const params = new URLSearchParams(queryParams);
      params.set("page", String(pageNum));
      window.location.href = `${baseUrl}?${params.toString()}`;
    }
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const getPrevUrl = () => {
    const params = new URLSearchParams(queryParams);
    params.set("page", String(currentPage - 1));
    return `${baseUrl}?${params.toString()}`;
  };

  const getNextUrl = () => {
    const params = new URLSearchParams(queryParams);
    params.set("page", String(currentPage + 1));
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Previous Button */}
      <div>
        {hasPrevPage ? (
          <Link
            href={getPrevUrl()}
            className="inline-block px-3 py-1.5 text-sm border border-border rounded-md text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-block px-3 py-1.5 text-sm border border-border rounded-md text-text-muted opacity-60">
            Previous
          </span>
        )}
      </div>

      {/* Page Info and Input */}
      <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
        <span className="text-sm text-text-muted">Page</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 px-2 py-1.5 text-sm border border-border rounded-md bg-background text-text-primary focus:outline-none focus:border-accent font-sans"
        />
        <span className="text-sm text-text-muted">of {totalPages}</span>
        <button
          type="submit"
          className="px-2 py-1.5 text-xs bg-accent text-background rounded-md hover:bg-accent-hover transition-colors font-semibold uppercase"
        >
          Go
        </button>
      </form>

      {/* Next Button */}
      <div>
        {hasNextPage ? (
          <Link
            href={getNextUrl()}
            className="inline-block px-3 py-1.5 text-sm border border-border rounded-md text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="inline-block px-3 py-1.5 text-sm border border-border rounded-md text-text-muted opacity-60">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
