"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleSortChange = (newValue: string | null) => {
    if (!newValue) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set(name, newValue);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleSortChange}>
      {/* The visible button */}
      <SelectTrigger className="w-[180px] bg-surface border-border text-text-primary focus:ring-accent">
        <SelectValue placeholder="Sort by...">
          {options.find((opt) => opt.value === value)?.label || "Sort by..."}
        </SelectValue>
      </SelectTrigger>

      {/* The custom dropdown menu (inherits your fonts automatically) */}
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
