"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown, { DropdownItem } from "@/components/Dropdown";
import { ChevronDown } from "lucide-react";

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

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "Sort by...";

  const trigger = (
    <div className="flex w-[180px] items-center justify-between gap-1.5 rounded-lg border border-border bg-surface py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors hover:border-accent">
      <span className="truncate">{selectedLabel}</span>
      <ChevronDown className="size-4 text-text-muted shrink-0 pointer-events-none" />
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="left" menuClassName="w-[180px]">
      {options.map((option) => (
        <DropdownItem key={option.value} onClick={() => handleSortChange(option.value)}>
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
