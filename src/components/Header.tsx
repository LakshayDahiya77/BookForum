import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "./headerActions";
import { Button } from "@/components/buttons/simpleButton";
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, avatarUrl: true, isAdmin: true },
    });
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-border bg-surface">
      {/* Left side: Logo & Main Nav */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-accent font-serif">
          Literary Insights
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-text-muted">
          <Link href="/books" className="hover:text-text-primary transition-colors">
            Books
          </Link>
          <Link href="/categories" className="hover:text-text-primary transition-colors">
            Categories
          </Link>
        </nav>
      </div>

      {/* Right side: Auth State */}
      <div>
        {dbUser ? (
          <div className="flex items-center gap-4">
            {dbUser.isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-bold text-accent hover:text-accent-hover transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <ThemeToggle />
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-border overflow-hidden flex-shrink-0">
                {dbUser.avatarUrl ? (
                  <img src={dbUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-xs font-bold text-text-muted">
                    {(dbUser.name || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
              {dbUser.name && (
                <span className="text-sm font-medium text-text-primary">
                  {dbUser.name.split(" ")[0]}
                </span>
              )}
            </Link>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-text-muted hover:text-text-primary"
              >
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
