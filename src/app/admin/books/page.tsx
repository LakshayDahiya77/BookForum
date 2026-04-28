import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addBookAction } from "./actions";
import Form from "next/form";
import { Button } from "@/components/buttons/simpleButton";
import { CategorySelector } from "@/components/CategorySelector";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/config";

export default async function addNewBook() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-start min-h-screen px-4">
        {/* Main Form Container */}
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-8 border-b border-border pb-4">
            Add New Book
          </h1>

          <Form action={addBookAction} className="flex flex-col gap-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Title</label>
              <input
                type="text"
                placeholder="The name of the book"
                name="title"
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Description</label>
              <textarea
                placeholder="A brief overview of the book's content..."
                name="description"
                rows={4}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-y"
              />
            </div>

            {/* Authors Field */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Author(s){" "}
                <span className="font-normal text-text-muted italic">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. George Orwell, Isaac Asimov"
                name="authors"
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                required
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Cover Image (File or URL){" "}
                <span className="font-normal text-text-muted">
                  (Max {formatFileSize(UPLOAD_LIMITS.BOOK_COVER.maxSize)})
                </span>
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  name="cover-file"
                  id="add-book-cover"
                  accept="image/*"
                  className="bg-background border border-border p-2 w-full rounded-md text-text-muted text-sm
                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                    file:text-xs file:font-bold file:uppercase file:tracking-wider
                    file:bg-accent file:text-background hover:file:bg-accent-hover 
                    cursor-pointer transition-all"
                />
                <div className="text-center text-xs text-text-muted font-bold uppercase">or</div>
                <input
                  type="url"
                  name="cover-url"
                  placeholder="https://example.com/image.jpg"
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                />
              </div>
            </div>

            {/* Publish Year */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Publish Year</label>
              <input
                type="number"
                name="publish-year"
                placeholder="e.g. 1984"
                min="-5000"
                max={new Date().getFullYear()}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
              />
              <p className="text-xs text-text-muted mt-2">Use negative numbers for BC/BCE dates.</p>
            </div>

            {/* Categories Selector */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-text-primary mb-3">
                Shelves / Categories
              </label>
              <CategorySelector categories={categories} fieldName="category-ids" />
            </div>

            {/* Submit Section */}
            <div className="flex justify-end mt-6 pt-6 border-t border-border">
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-2 font-bold uppercase tracking-widest text-xs"
              >
                Add Book to Library
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

