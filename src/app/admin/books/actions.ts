"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { UPLOAD_LIMITS } from "@/lib/uploadConfig";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBookAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const publishYearString = formData.get("publish-year") as string;
  const publishYear = publishYearString ? parseInt(publishYearString, 10) : null;
  const categoryIds = formData.getAll("category-ids") as string[];

  const authorsString = formData.get("authors") as string;
  const authorsNames = authorsString
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  let coverUrl: string | null = null;
  const file = formData.get("cover-file") as File;
  if (file && file.size > 0) {
    if (file.size > UPLOAD_LIMITS.BOOK_COVER.maxSize) {
      throw new Error("Image must be smaller than 10MB.");
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error } = await supabaseAdmin.storage
      .from(UPLOAD_LIMITS.BOOK_COVER.bucket)
      .upload(fileName, file);

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(UPLOAD_LIMITS.BOOK_COVER.bucket).getPublicUrl(fileName);
    coverUrl = publicUrl;
  }

  await prisma.book.create({
    data: {
      title: title,
      description: description,
      coverUrl: coverUrl,
      publishYear: publishYear,
      categories: {
        connect: categoryIds.map((id) => ({ id: id })),
      },
      authors: {
        connectOrCreate: authorsNames.map((name) => ({
          where: { name: name },
          create: { name: name },
        })),
      },
    },
  });

  // Increment bookCount for each connected category
  for (const categoryId of categoryIds) {
    await prisma.category.update({
      where: { id: categoryId },
      data: { bookCount: { increment: 1 } },
    });
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function updateBookAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Book ID required");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const publishYearString = formData.get("publish-year") as string;
  const publishYear = publishYearString ? parseInt(publishYearString, 10) : null;
  const categoryIds = formData.getAll("category-ids") as string[];

  const authorsString = formData.get("authors") as string;
  const authorsNames = authorsString
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const existingBook = await prisma.book.findUnique({
    where: { id },
    include: { categories: true },
  });
  if (!existingBook) throw new Error("Book not found");

  let coverUrl = existingBook.coverUrl;
  const file = formData.get("cover-file") as File;
  if (file && file.size > 0) {
    if (file.size > UPLOAD_LIMITS.BOOK_COVER.maxSize) {
      throw new Error("Image must be smaller than 10MB.");
    }
    const fileExt = file.name.split(".").pop();
    if (!fileExt) throw new Error("File extension not found");

    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error } = await supabaseAdmin.storage
      .from(UPLOAD_LIMITS.BOOK_COVER.bucket)
      .upload(fileName, file);

    if (error) {
      throw new Error(error.message);
    }
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(UPLOAD_LIMITS.BOOK_COVER.bucket).getPublicUrl(fileName);
    coverUrl = publicUrl;
  }

  const existingCategoryIds = existingBook.categories.map((c) => c.id);
  const categoriesToDisconnect = existingCategoryIds.filter((cid) => !categoryIds.includes(cid));
  const categoriesToConnect = categoryIds.filter((cid) => !existingCategoryIds.includes(cid));

  await prisma.book.update({
    where: { id },
    data: {
      title,
      description,
      publishYear,
      coverUrl,
      categories: {
        set: categoryIds.map((cid) => ({ id: cid })),
      },
      authors: {
        set: [], // Clear existing connections
        connectOrCreate: authorsNames.map((name) => ({
          where: { name: name },
          create: { name: name },
        })),
      },
    },
  });

  // Update category counts
  for (const cid of categoriesToDisconnect) {
    await prisma.category.update({
      where: { id: cid },
      data: { bookCount: { decrement: 1 } },
    });
  }
  for (const cid of categoriesToConnect) {
    await prisma.category.update({
      where: { id: cid },
      data: { bookCount: { increment: 1 } },
    });
  }

  revalidatePath(`/books/${id}`);
  revalidatePath("/");
  redirect(`/books/${id}`);
}
