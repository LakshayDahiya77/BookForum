// ============================================
// APP CONFIG — single source of truth
// ============================================

// Site
export const APP_CONFIG = {
  site: {
    name: "Literary Insights",
    description: "Share. Discuss. Explore.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },

  // UI
  ui: {
    headerHeight: 65, // px — used for progress bar offset, sticky positioning
    maxWidth: "max-w-6xl",
    pagepadding: "px-4",
    progressBarHeight: 1,
    progressBarColor: "#C8922A",
  },

  // Pagination
  pagination: {
    booksPerPage: 12,
    reviewsPerPage: 10,
  },

  // AI Summary
  ai: {
    summaryReviewThreshold: 5, // trigger summary after N review changes
    summaryMaxTokens: 300,
    summaryModel: "meta-llama/Llama-3.1-8B-Instruct",
    summaryProvider: "cerebras",
  },

  // Storage buckets
  storage: {
    bookCovers: "book-covers",
    authorPhotos: "author-photos",
    categoryIcons: "category-icons",
    avatars: "avatars",
    assets: "assets",
  },

  // Upload limits
  upload: {
    maxFileSizeMB: 5,
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  },
} as const;

export const UPLOAD_LIMITS = {
  CATEGORY_ICON: {
    maxSize: 2 * 1024 * 1024, // 2MB
    bucket: APP_CONFIG.storage.categoryIcons,
  },
  AVATAR: {
    maxSize: 5 * 1024 * 1024, // 5MB
    bucket: APP_CONFIG.storage.avatars,
  },
  BOOK_COVER: {
    maxSize: 10 * 1024 * 1024, // 10MB
    bucket: APP_CONFIG.storage.bookCovers,
  },
  AUTHOR_PHOTO: {
    maxSize: 5 * 1024 * 1024, // 5MB
    bucket: APP_CONFIG.storage.authorPhotos,
  },
} as const;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
