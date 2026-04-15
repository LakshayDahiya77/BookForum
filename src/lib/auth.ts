import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { prisma } from "@/lib/prisma";

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
