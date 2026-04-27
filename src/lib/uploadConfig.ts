export const UPLOAD_LIMITS = {
  CATEGORY_ICON: {
    maxSize: 2 * 1024 * 1024, // 2MB
    bucket: "category-icons",
  },
  AVATAR: {
    maxSize: 5 * 1024 * 1024, // 5MB
    bucket: "avatars",
  },
  BOOK_COVER: {
    maxSize: 10 * 1024 * 1024, // 10MB
    bucket: "book-covers",
  },
  AUTHOR_PHOTO: {
    maxSize: 5 * 1024 * 1024, // 5MB
    bucket: "author-photos",
  },
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
