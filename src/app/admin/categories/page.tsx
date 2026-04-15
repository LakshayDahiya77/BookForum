import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import { addCategory } from "./actions";
import { deleteCategory } from "./actions";
import { Button } from "@/components/buttons/simpleButton";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany();
  return (
    <div className="lex justify-center min-h-screen py-8">
      <h1>Add New Category</h1>
      <div className="flex items-center justify-center outline-1 mx-auto ">
        <Form action={addCategory}>
          <input type="text" name="name" id="add-category-name" placeholder="New Category Name" />{" "}
          <input type="file" name="iconFile" id="add-category-icon" accept="image/*" required />
          <Button type="submit">Add Category</Button>
        </Form>
      </div>

      <div>
        <h1>All Categories</h1>
        <ol>
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-center outline-1 mx-auto ">
              <img src={category.icon} alt={category.name} className="w-8 h-8 mr-2" />{" "}
              {category.name}
              <Form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </Form>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
