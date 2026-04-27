"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { UPLOAD_LIMITS } from "@/lib/uploadConfig";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function processCoverUpload(file: File | null, url: string | null): Promise<string | null> {
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

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(UPLOAD_LIMITS.BOOK_COVER.bucket).getPublicUrl(fileName);
    return publicUrl;
  } else if (url && url.trim() !== "") {
    try {
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error(`Failed to fetch image from URL. Status: ${res.status}`);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("The provided URL does not point to a valid image.");
      }

      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength > UPLOAD_LIMITS.BOOK_COVER.maxSize) {
        throw new Error("Image from URL must be smaller than 10MB.");
      }

      let fileExt = contentType.split("/")[1] || "jpg";
      if (fileExt.includes(";")) fileExt = fileExt.split(";")[0];
      if (fileExt === "jpeg") fileExt = "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const fileData = Buffer.from(arrayBuffer);

      const { error } = await supabaseAdmin.storage
        .from(UPLOAD_LIMITS.BOOK_COVER.bucket)
        .upload(fileName, fileData, {
          contentType: contentType,
        });

      if (error) throw new Error(error.message);

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from(UPLOAD_LIMITS.BOOK_COVER.bucket).getPublicUrl(fileName);
      return publicUrl;
    } catch (e: any) {
      throw new Error(`Error processing cover URL: ${e.message}`);
    }
  }
  return null;
}

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

  const file = formData.get("cover-file") as File | null;
  const url = formData.get("cover-url") as string | null;
  const coverUrl = await processCoverUpload(file, url);

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

  const file = formData.get("cover-file") as File | null;
  const url = formData.get("cover-url") as string | null;
  const newCoverUrl = await processCoverUpload(file, url);
  const coverUrl = newCoverUrl || existingBook.coverUrl;

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

export async function deleteBookAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) throw new Error("Book ID required");

  const existingBook = await prisma.book.findUnique({
    where: { id },
    include: { categories: true },
  });
  if (!existingBook) throw new Error("Book not found");

  // Delete related BookVotes first to avoid foreign key constraint
  await prisma.bookVote.deleteMany({
    where: { bookId: id },
  });

  // Delete related Reviews
  await prisma.review.deleteMany({
    where: { bookId: id },
  });

  // Decrement bookCount for categories
  for (const category of existingBook.categories) {
    await prisma.category.update({
      where: { id: category.id },
      data: { bookCount: { decrement: 1 } },
    });
  }

  // Delete from Prisma
  await prisma.book.delete({
    where: { id },
  });

  // Optionally delete from Supabase storage if coverUrl exists
  if (existingBook.coverUrl) {
    const urlObj = new URL(existingBook.coverUrl);
    const pathParts = urlObj.pathname.split("/");
    const fileName = pathParts.pop();
    if (fileName) {
      await supabaseAdmin.storage.from(UPLOAD_LIMITS.BOOK_COVER.bucket).remove([fileName]);
    }
  }

  revalidatePath("/admin/books");
  revalidatePath("/books");
  revalidatePath("/");
  redirect("/books");
}
