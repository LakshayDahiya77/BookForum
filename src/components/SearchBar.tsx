"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
  defaultValue?: string;
  preserveParams?: boolean;
  path?: string;
};

export default function SearchBar({
  defaultValue = "",
  preserveParams = false,
  path = "/books",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next = preserveParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();

    if (value.trim()) {
      next.set("q", value.trim());
    } else {
      next.delete("q");
    }

    const query = next.toString();
    router.push(query ? `${path}?${query}` : path);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full pl-9 pr-4 py-2 bg-surface border border-border text-text-primary placeholder:text-text-muted rounded-md text-sm outline-none focus:border-accent transition-colors"
        />
      </div>
      <button
        type="submit"
        className="bg-accent hover:bg-accent-hover text-background font-medium px-4 py-2 rounded-md text-sm transition-colors"
      >
        Search
      </button>
    </form>
  );
}
