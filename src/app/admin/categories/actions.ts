"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const file = formData.get("iconFile") as File;

  if (!file || file.size === 0) {
    throw new Error("File is missing");
  }

  await requireAdmin();
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage.from("category-icons").upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("category-icons").getPublicUrl(fileName);

  await prisma.category.create({
    data: { name, icon: publicUrl },
  });

  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const new_name = formData.get("name") as string;
  const new_icon = formData.get("icon") as string;
  await prisma.category.update({
    where: { id },
    data: { name: new_name, icon: new_icon },
  });
  revalidatePath("admin/categories");
}
