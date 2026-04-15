import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import { addCategory } from "./actions";
import { deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany();
  return (
    <>
      <div>
        <h1>Add New Category</h1>
        <Form action={addCategory}>
          <div>
            <label htmlFor="title">Name</label>
            <input
              type="text"
              name="name"
              id="add-category-name"
              placeholder="New Category Name"
            />{" "}
          </div>

          <div>
            <label htmlFor="content">Icon</label>
            <input
              type="text"
              name="icon"
              id="add-category-icon"
              placeholder="New Category Icon"
            />{" "}
          </div>
          <button type="submit">Add Category</button>
        </Form>
      </div>

      <div>
        <h1>All Categories</h1>
        <ol>
          {categories.map((category) => (
            <li key={category.id}>
              {category.icon} {category.name}
              <Form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button type="submit">Delete</button>
              </Form>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
