import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { prisma } from "@/lib/prisma";

// 1. Base Auth: Must be logged in, or bounce to /login
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

// 2. Boolean Check: Must be logged in (or bounce), returns true/false for UI toggles
export async function isUserAdmin(): Promise<boolean> {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  return dbUser?.isAdmin === true;
}

// 3. Hard Guard: Must be logged in (or bounce), must be admin (or bounce to /profile)
export async function requireAdmin() {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!dbUser?.isAdmin) {
    redirect("/profile");
  }
  return dbUser;
}
