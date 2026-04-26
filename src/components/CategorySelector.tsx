"use client";

type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  bookCount: number;
};

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
      <label className="block text-sm font-medium text-text-primary">Categories</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-border rounded-lg bg-background">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-3 p-3 border border-border bg-surface rounded-md cursor-pointer hover:bg-background hover:border-accent transition-all"
          >
            <input
              type="checkbox"
              name={fieldName}
              value={category.id}
              defaultChecked={selectedIds.includes(category.id)}
              className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
            />
            <div className="flex items-center gap-2 flex-1">
              <img
                src={category.icon}
                alt={category.name}
                className="w-6 h-6 object-cover rounded-sm"
              />
              <span className="text-sm font-medium text-text-primary">{category.name}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
