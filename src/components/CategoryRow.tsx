"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/buttons/simpleButton";
import { updateCategory, deleteCategory } from "@/app/admin/categories/actions";
import type { Category } from "@prisma/client";

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
    <li className="flex items-center justify-between p-3 border border-gray-200 bg-white rounded-md w-full shadow-sm">
      <div className="flex items-center">
        <img
          src={category.icon}
          alt={category.name}
          className="w-8 h-8 mr-3 object-cover rounded-sm"
        />
        <span className="font-medium text-gray-700">{category.name}</span>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Category : {category.name}
            </h2>

            <form action={handleUpdate} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={category.id} />
              <div>
                <input
                  type="text"
                  name="name"
                  defaultValue={category.name}
                  className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Max 2MB)
                </label>
                <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-gray-400 mb-1 uppercase font-bold tracking-wider">
                      Current
                    </span>
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-10 h-10 object-cover rounded shadow-sm bg-white"
                    />
                  </div>
                  <div className="text-gray-300 text-lg">→</div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      name="iconFile"
                      accept="image/*"
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  Leave empty to keep the current icon
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="primary" type="submit" isLoading={isPending}>
                  Save Changes
                </Button>
                <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <form action={handleDelete}>
                <input type="hidden" name="id" value={category.id} />
                <Button variant="danger" type="submit" className="w-full" isLoading={isPending}>
                  Delete Category
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
