import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import { addCategory } from "./actions";
import { Button } from "@/components/buttons/simpleButton";
import { CategoryRow } from "@/components/CategoryRow";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/uploadConfig";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-start gap-8">
        {/* Section 1: Add New Category */}
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
            Add New Category
          </h1>

          <Form action={addCategory} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="add-category-name"
                placeholder="e.g. Science Fiction"
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Description</label>
              <input
                type="text"
                name="description"
                id="add-category-description"
                placeholder="Brief genre overview..."
                className="bg-background border border-border p-3 w-full rounded-md text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Icon{" "}
                <span className="font-normal text-text-muted">
                  (Max {formatFileSize(UPLOAD_LIMITS.CATEGORY_ICON.maxSize)})
                </span>
              </label>
              <input
                type="file"
                name="iconFile"
                id="add-category-icon"
                accept="image/*"
                className="bg-background border border-border p-2 w-full rounded-md text-text-muted text-sm
                  file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 
                  file:text-xs file:font-bold file:uppercase file:bg-accent 
                  file:text-background hover:file:bg-accent-hover cursor-pointer transition-all"
                required
              />
            </div>

            <div className="flex justify-end mt-2 pt-4 border-t border-border">
              <Button
                type="submit"
                variant="primary"
                className="font-bold uppercase tracking-widest text-xs"
              >
                Add Category
              </Button>
            </div>
          </Form>
        </div>

        {/* Section 2: Category List */}
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-border w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
            All Categories
          </h1>
          {categories.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-center py-4 italic">No categories created yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
