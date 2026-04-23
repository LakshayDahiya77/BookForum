import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "./headerActions";
import { Button } from "@/components/buttons/simpleButton";

export default async function Header() {
  // 1. Soft auth check (doesn't redirect if nobody is logged in)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch DB details if they are logged in
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, avatarUrl: true, isAdmin: true },
    });
  }

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
      {/* Left side: Logo & Main Nav */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-blue-600">
          Literary Insights
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-gray-700">
          <Link href="/books" className="hover:text-blue-600">
            Books
          </Link>
          <Link href="/categories" className="hover:text-blue-600">
            Categories
          </Link>
        </nav>
      </div>

      {/* Right side: Auth State */}
      <div>
        {dbUser ? (
          <div className="flex items-center gap-4">
            {/* Show Admin link only if they are an admin */}
            {dbUser.isAdmin && (
              <Link href="/admin/books" className="text-sm font-bold text-red-600 hover:underline">
                Admin Panel
              </Link>
            )}

            {/* Profile Link */}
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {dbUser.avatarUrl ? (
                  <img src={dbUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-xs font-bold text-gray-500">
                    {(dbUser.name || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium">{dbUser.name?.split(" ")[0]}</span>
            </Link>

            {/* Logout Form */}
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-gray-500">
                Sign Out
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In / Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
