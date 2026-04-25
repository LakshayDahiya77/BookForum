"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/buttons/simpleButton";
import { updateCategory, deleteCategory } from "@/app/admin/categories/actions";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/uploadConfig";
import type { Category } from "@prisma/client";
import { ArrowRight, Edit2, Trash2 } from "lucide-react";

export function CategoryRow({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateCategory(formData);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : "Failed to update category");
      }
    });
  };

  const handleDelete = (formData: FormData) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    startTransition(async () => {
      try {
        await deleteCategory(formData);
      } catch (error) {
        console.error(error);
        alert("Failed to delete category");
      }
    });
  };

  return (
    <li className="flex items-center justify-between p-4 border border-border bg-surface rounded-lg w-full shadow-sm">
      <div className="flex items-center">
        <img
          src={category.icon}
          alt={category.name}
          className="w-10 h-10 mr-4 object-contain rounded bg-background p-1 border border-border"
        />
        <span className="font-bold text-text-primary">{category.name}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:scale-110 transition-transform duration-150"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Edit</span>
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="bg-surface p-8 rounded-xl shadow-2xl border border-border w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
              Edit Category
            </h2>

            <form action={handleUpdate} className="flex flex-col gap-5">
              <input type="hidden" name="id" value={category.id} />

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category.name}
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={category.description || ""}
                  rows={2}
                  className="bg-background border border-border p-3 w-full rounded-md text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Icon{" "}
                  <span className="font-normal text-text-muted text-xs">
                    (Max {formatFileSize(UPLOAD_LIMITS.CATEGORY_ICON.maxSize)})
                  </span>
                </label>
                <div className="flex items-center gap-4 p-3 bg-background border border-border rounded-lg">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-[10px] text-text-muted mb-1 uppercase font-black tracking-widest">
                      Active
                    </span>
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-12 h-12 object-contain rounded bg-surface p-1 border border-border shadow-inner"
                    />
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted" />
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      name="iconFile"
                      accept="image/*"
                      className="w-full text-xs text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-2 italic">
                  Leave empty to keep the current icon
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isPending}
                  className="font-bold text-xs uppercase tracking-widest px-6"
                >
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-xs uppercase"
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-danger/20">
              <form action={handleDelete}>
                <input type="hidden" name="id" value={category.id} />
                <Button
                  variant="danger"
                  type="submit"
                  className="w-full font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center gap-1.5 hover:scale-110 transition-transform duration-150"
                  isLoading={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Category</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
