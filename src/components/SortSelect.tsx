"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortOption = {
  label: string;
  value: string;
};

type SortSelectProps = {
  name?: string;
  value: string;
  options: SortOption[];
};

export default function SortSelect({ name = "sort", value, options }: SortSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      value={value}
      onChange={(event) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set(name, event.target.value);
        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
      }}
      className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
