"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
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
  const supabase = await createClient();
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
    const oldFileName = (() => {
      try {
        const parsedUrl = new URL(existingUser.avatarUrl);
        return decodeURIComponent(parsedUrl.pathname.split("/").pop() ?? "");
      } catch {
        return existingUser.avatarUrl.split("/").pop()?.split("?")[0] ?? "";
      }
    })();

    if (oldFileName) {
      await supabase.storage.from(UPLOAD_LIMITS.AVATAR.bucket).remove([oldFileName]);
    }
  }

  const extension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(UPLOAD_LIMITS.AVATAR.bucket)
    .upload(fileName, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(UPLOAD_LIMITS.AVATAR.bucket).getPublicUrl(fileName);

  await prisma.user.update({
    where: { id: authUser.id },
    data: { avatarUrl: publicUrl },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}

export async function deleteAvatar() {
  const authUser = await requireUser();
  const supabase = await createClient();

  const existingUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { avatarUrl: true },
  });

  if (existingUser?.avatarUrl) {
    const oldFileName = (() => {
      try {
        const parsedUrl = new URL(existingUser.avatarUrl);
        return decodeURIComponent(parsedUrl.pathname.split("/").pop() ?? "");
      } catch {
        return existingUser.avatarUrl.split("/").pop()?.split("?")[0] ?? "";
      }
    })();

    if (oldFileName) {
      await supabase.storage.from(UPLOAD_LIMITS.AVATAR.bucket).remove([oldFileName]);
    }
  }

  await prisma.user.update({
    where: { id: authUser.id },
    data: { avatarUrl: null },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}

export async function updateProfileSettings(formData: FormData) {
  const authUser = await requireUser();
  const supabase = await createClient();

  const nameInput = (formData.get("name") as string | null)?.trim();
  const emailInput = (formData.get("email") as string | null)?.trim().toLowerCase();
  const currentPassword = (formData.get("currentPassword") as string | null)?.trim();
  const newPassword = (formData.get("newPassword") as string | null)?.trim();

  if (!emailInput) {
    throw new Error("Email is required.");
  }

  if (emailInput && !emailInput.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  const userDataToUpdate: { name?: string | null; email?: string } = {};

  userDataToUpdate.name = nameInput && nameInput.length > 0 ? nameInput : null;

  if (emailInput !== (authUser.email || "").toLowerCase()) {
    const { error: emailError } = await supabase.auth.updateUser({ email: emailInput });
    if (emailError) {
      throw new Error(emailError.message);
    }
    userDataToUpdate.email = emailInput;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new Error("Current password is required to change your password.");
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: authUser.email || emailInput,
      password: currentPassword,
    });

    if (verifyError) {
      throw new Error("Current password is incorrect.");
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      throw new Error(passwordError.message);
    }
  }

  await prisma.user.update({
    where: { id: authUser.id },
    data: userDataToUpdate,
  });

  revalidatePath("/profile");
  revalidatePath("/");
}
