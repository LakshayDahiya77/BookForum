import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "./headerActions";
import { Button } from "@/components/buttons/simpleButton";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

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
    <header className="flex justify-between items-center px-4 md:px-6 py-3 border-b border-border bg-surface">
      {/* Left side: Logo & Main Nav */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/">
          <Image
            src="/site-logo-transparent.png"
            alt="Literary Insights"
            width={120}
            height={42}
            priority
            className="object-contain"
          />
        </Link>
        {/* Nav hidden on mobile */}
        <nav className="hidden md:flex gap-4 text-sm font-medium text-text-muted">
          <Link href="/books" className="hover:text-text-primary transition-colors">
            Books
          </Link>
          <Link href="/categories" className="hover:text-text-primary transition-colors">
            Categories
          </Link>
        </nav>
      </div>

      {/* Right side */}
      <div>
        {dbUser ? (
          <div className="flex items-center gap-2 md:gap-4">
            {dbUser.isAdmin && (
              <Link
                href="/admin/books"
                className="text-xs font-bold text-accent border border-accent px-2 py-1 md:px-3 md:py-1.5 rounded-md hover:bg-accent hover:text-background transition-colors"
              >
                Admin
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
                <span className="hidden md:inline text-sm font-medium text-text-primary">
                  {dbUser.name.split(" ")[0]}
                </span>
              )}
            </Link>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-text-muted hover:text-text-primary text-xs md:text-sm px-2 md:px-3"
              >
                Sign Out
              </Button>
            </form>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
