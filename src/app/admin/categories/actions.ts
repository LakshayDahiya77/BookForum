"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const category = await prisma.category.findUnique({ where: { id } });
  if (category?.icon) {
    // Extract just the filename from the end of the public URL
    const fileName = category.icon.split("/").pop();

    if (fileName) {
      const supabase = await createClient();
      // 2. Delete the file from the bucket
      await supabase.storage.from("category-icons").remove([fileName]);
    }
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const file = formData.get("iconFile") as File;

  if (!file || file.size === 0) {
    throw new Error("File is missing");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 2MB.");
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
  const name = formData.get("name") as string;
  const file = formData.get("iconFile") as File | null;

  const updateData: { name: string; icon?: string } = { name };

  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image must be less than 2MB");
    }
    const supabase = await createClient();
    const oldCategory = await prisma.category.findUnique({ where: { id } });
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage.from("category-icons").upload(fileName, file);
    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("category-icons").getPublicUrl(fileName);

    updateData.icon = publicUrl;

    if (oldCategory?.icon) {
      const oldFileName = oldCategory.icon.split("/").pop();
      if (oldFileName) {
        await supabase.storage.from("category-icons").remove([oldFileName]);
      }
    }
  }

  await prisma.category.update({
    where: { id },
    data: updateData,
  });
  revalidatePath("/admin/categories");
}
