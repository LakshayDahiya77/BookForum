"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

const AUTHOR_PHOTOS_BUCKET = "author-photos";

async function uploadAuthorPhoto(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(AUTHOR_PHOTOS_BUCKET)
    .upload(fileName, file, { upsert: false });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(AUTHOR_PHOTOS_BUCKET).getPublicUrl(fileName);

  return publicUrl;
}

export async function addAuthor(formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const photoFile = formData.get("photoFile") as File;

  if (!name) {
    throw new Error("Author name is required.");
  }

  const photoUrl = await uploadAuthorPhoto(photoFile);

  await prisma.author.create({
    data: {
      name,
      bio: bio || null,
      photoUrl,
    },
  });

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
}

export async function updateAuthor(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const photoFile = formData.get("photoFile") as File;

  if (!id || !name) {
    throw new Error("Author id and name are required.");
  }

  const existing = await prisma.author.findUnique({
    where: { id },
    select: { photoUrl: true },
  });

  let nextPhotoUrl: string | undefined;
  if (photoFile && photoFile.size > 0) {
    nextPhotoUrl = (await uploadAuthorPhoto(photoFile)) ?? undefined;

    if (existing?.photoUrl) {
      const oldFileName = existing.photoUrl.split("/").pop()?.split("?")[0];
      if (oldFileName) {
        await supabaseAdmin.storage.from(AUTHOR_PHOTOS_BUCKET).remove([oldFileName]);
      }
    }
  }

  await prisma.author.update({
    where: { id },
    data: {
      name,
      bio: bio || null,
      ...(nextPhotoUrl ? { photoUrl: nextPhotoUrl } : {}),
    },
  });

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
  revalidatePath(`/authors/${id}`);
}

export async function deleteAuthor(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Author id is required.");
  }

  const existing = await prisma.author.findUnique({
    where: { id },
    select: { photoUrl: true },
  });

  await prisma.author.delete({ where: { id } });

  if (existing?.photoUrl) {
    const fileName = existing.photoUrl.split("/").pop()?.split("?")[0];
    if (fileName) {
      await supabaseAdmin.storage.from(AUTHOR_PHOTOS_BUCKET).remove([fileName]);
    }
  }

  revalidatePath("/admin/authors");
  revalidatePath("/admin");
}
