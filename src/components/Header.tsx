import Link from "next/link";
import Form from "next/form";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "./headerActions";
import { Button } from "@/components/buttons/simpleButton";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { BookOpen, House, LogOut, Menu, Shapes, User, Settings } from "lucide-react";
import Dropdown from "@/components/Dropdown";

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

  const navLinks = [
    { href: "/", label: "Home", icon: <House className="w-4 h-4" /> },
    { href: "/books", label: "Books", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/categories", label: "Categories", icon: <Shapes className="w-4 h-4" /> },
  ];

  return (
    <header className="relative z-50 flex justify-between items-center px-4 md:px-6 py-3 border-b border-border bg-surface/95 backdrop-blur-sm">
      {/* Left side: Logo & Main Nav */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/site-logo-transparent.png"
            alt="Literary Insights"
            width={120}
            height={42}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 text-sm font-medium text-text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-text-primary hover:bg-background transition-colors inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side: User Actions & Mobile Nav */}
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        {dbUser ? (
          /* Profile Dropdown */
          <Dropdown
            align="right"
            menuClassName="w-48"
            trigger={
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-1.5 py-1 pr-2.5 hover:border-accent transition-colors">
                <div className="relative w-8 h-8 rounded-full bg-border overflow-hidden shrink-0">
                  {dbUser.avatarUrl ? (
                    <Image
                      src={dbUser.avatarUrl}
                      alt="Avatar"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-xs font-bold text-text-muted">
                      {(dbUser.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {dbUser.name && (
                  <span className="hidden md:inline max-w-24 truncate text-sm font-medium text-text-primary">
                    {dbUser.name.split(" ")[0]}
                  </span>
                )}
              </div>
            }
          >
            <Link
              href="/profile"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            {dbUser.isAdmin && (
              <Link
                href="/admin"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-accent hover:bg-background transition-colors"
              >
                <Settings className="w-4 h-4" />
                Admin Settings
              </Link>
            )}

            <div className="my-1 h-px w-full bg-border" />

            <Form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3 text-text-primary hover:text-accent inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </Form>
          </Dropdown>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
        )}

        {/* Mobile Navigation Dropdown (Right End) */}
        <Dropdown
          className="md:hidden"
          align="right"
          menuClassName="w-44"
          trigger={
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/60 text-text-primary hover:border-accent hover:text-accent transition-colors cursor-pointer">
              <Menu className="w-5 h-5" />
            </div>
          }
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </Dropdown>
      </div>
    </header>
  );
}
