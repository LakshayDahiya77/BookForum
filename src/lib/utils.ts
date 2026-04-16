import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPublishYear(year: number | null | undefined): string {
  // Usage in your component:
  // <span>Published: {formatPublishYear(book.publishYear)}</span>

  if (!year) return "Unknown";
  if (year < 0) return `${Math.abs(year)} BC`;
  return year.toString();
}
