"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
}

export async function addCategory(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  await prisma.category.create({
    data: { name, icon },
  });
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
}
