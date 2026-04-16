import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addBookAction } from "./actions";
import Form from "next/form";
import { Button } from "@/components/buttons/simpleButton";
import { CategorySelector } from "@/components/CategorySelector";
import { UPLOAD_LIMITS, formatFileSize } from "@/lib/uploadConfig";

export default async function addNewBook() {
  await requireAdmin();
  const categories = await prisma.category.findMany();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Book</h1>
        <Form action={addBookAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Book title"
              name="title"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Book description"
              name="description"
              rows={3}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author(s) (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. George Orwell, Isaac Asimov"
              name="authors"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image (Max {formatFileSize(UPLOAD_LIMITS.BOOK_COVER.maxSize)})
            </label>
            <input
              type="file"
              name="cover-file"
              id="add-book-cover"
              accept="image/*"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Year</label>
            <input
              type="number"
              name="publish-year"
              placeholder="e.g. 1984 or -700 for BC"
              min="-5000"
              max={new Date().getFullYear()}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Use negative numbers for BC/BCE dates.</p>
          </div>

          <CategorySelector categories={categories} fieldName="category-ids" />

          <div className="flex justify-end mt-4">
            <Button type="submit" variant="primary">
              Add Book
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
