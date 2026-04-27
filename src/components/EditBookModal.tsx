"use client";

import { useState } from "react";
import Form from "next/form";
import { updateBookAction, deleteBookAction } from "@/app/admin/books/actions";
import { Button } from "@/components/buttons/simpleButton";
import { Edit2, X } from "lucide-react";
import { CategorySelector } from "@/components/CategorySelector";

type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  bookCount: number;
};
type Author = { id: string; name: string };

type EditBookModalProps = {
  book: {
    id: string;
    title: string;
    description: string | null;
    publishYear: number | null;
    authors: Author[];
    categories: { id: string; name: string }[];
  };
  allCategories: Category[];
};

export default function EditBookModal({ book, allCategories }: EditBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert authors to comma separated for the input
  const defaultAuthors = book.authors.map((a) => a.name).join(", ");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-0 bg-accent text-background p-3 rounded-full shadow-md hover:scale-105 hover:bg-accent-hover transition-all duration-200 z-10 flex items-center justify-center group"
        title="Edit Book Details"
      >
        <Edit2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface shrink-0">
          <h2 className="text-2xl font-bold text-text-primary">Edit Book</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-accent transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <Form action={updateBookAction} className="flex flex-col gap-6 text-left">
            <input type="hidden" name="id" value={book.id} />

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={book.title}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={book.description || ""}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Author(s){" "}
                <span className="font-normal text-text-muted italic">(comma separated)</span>
              </label>
              <input
                type="text"
                name="authors"
                defaultValue={defaultAuthors}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Cover Image (File or URL)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  name="cover-file"
                  accept="image/*"
                  className="bg-background border border-border p-2 w-full rounded-md text-text-muted text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer transition-all"
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

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Publish Year</label>
              <input
                type="number"
                name="publish-year"
                defaultValue={book.publishYear || ""}
                min="-5000"
                max={new Date().getFullYear()}
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <CategorySelector
                categories={allCategories}
                fieldName="category-ids"
                selectedIds={book.categories.map((c) => c.id)}
              />
            </div>

            <div className="flex justify-between mt-6 pt-6 border-t border-border">
              <Button
                formAction={deleteBookAction}
                type="submit"
                variant="danger"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to delete this book?")) {
                    e.preventDefault();
                  } else {
                    setTimeout(() => setIsOpen(false), 50);
                  }
                }}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest"
              >
                Delete
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={() => setTimeout(() => setIsOpen(false), 50)} // Close soon after submit
                  className="px-8 py-2 text-xs font-bold uppercase tracking-widest"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
