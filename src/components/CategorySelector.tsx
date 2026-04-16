"use client";

import type { Category } from "@prisma/client";

interface CategorySelectorProps {
  categories: Category[];
  selectedIds?: string[];
  fieldName?: string;
}

export function CategorySelector({
  categories,
  selectedIds = [],
  fieldName = "category-ids",
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Categories</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-3 p-3 border border-gray-200 bg-white rounded-md cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <input
              type="checkbox"
              name={fieldName}
              value={category.id}
              defaultChecked={selectedIds.includes(category.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 flex-1">
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 object-cover rounded-sm"
              />
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
