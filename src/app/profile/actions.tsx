"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UPLOAD_LIMITS } from "@/lib/config";

export async function logout() {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
  redirect("/login");
}

export async function updateAvatar(formData: FormData) {
  const authUser = await requireUser();
  const file = formData.get("avatarFile") as File;

  if (!file || file.size === 0) {
    throw new Error("Please select an image to upload.");
  }

  if (file.size > UPLOAD_LIMITS.AVATAR.maxSize) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { avatarUrl: true },
  });

  if (existingUser?.avatarUrl) {
    const oldFileName = existingUser.avatarUrl.split("/").pop()?.split("?")[0];
    if (oldFileName) {
      await supabaseAdmin.storage.from(UPLOAD_LIMITS.AVATAR.bucket).remove([oldFileName]);
    }
  }

  const extension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(UPLOAD_LIMITS.AVATAR.bucket)
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(UPLOAD_LIMITS.AVATAR.bucket).getPublicUrl(fileName);

  await prisma.user.update({
    where: { id: authUser.id },
    data: { avatarUrl: publicUrl },
  });

  revalidatePath("/profile");
}

