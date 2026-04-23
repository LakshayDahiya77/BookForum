import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const headersList = await headers();
  const fullPath = headersList.get("x-invoke-path") || "";

  const tabs = [
    { href: "/admin/books", label: "Books", icon: "📚" },
    { href: "/admin/categories", label: "Categories", icon: "📁" },
    { href: "/admin/authors", label: "Authors", icon: "✍️" },
  ];

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary mb-8 font-serif">Admin Dashboard</h1>

      {/* Persistent Tab Navigation */}
      <div className="flex border-b border-border mb-8 overflow-x-auto gap-2">
        {tabs.map((t) => {
          const isActive = fullPath.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                isActive
                  ? "border-accent text-accent bg-accent/5"
                  : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="animate-in fade-in duration-300">{children}</div>
    </main>
  );
}
