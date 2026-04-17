import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import { addCategory } from "./actions";
import { Button } from "@/components/buttons/simpleButton";
import { CategoryRow } from "@/components/CategoryRow";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/uploadConfig";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany();
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-xl m-10">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Add New Category</h1>
        <Form action={addCategory} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              id="add-category-name"
              placeholder="e.g. Science Fiction"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              id="add-category-description"
              placeholder="Some Catchy Line"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Max {formatFileSize(UPLOAD_LIMITS.CATEGORY_ICON.maxSize)})
            </label>
            <input
              type="file"
              name="iconFile"
              id="add-category-icon"
              accept="image/*"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              required
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button type="submit" variant="primary">
              Add Category
            </Button>
          </div>
        </Form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-xl">
        <h1 className="text-xl font-bold text-gray-900 mb-5">All Categories</h1>
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      </div>
    </div>
  );
}
