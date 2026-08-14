"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Gift, MessageSquareText, BookHeart } from "lucide-react";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/convidados", label: "Convidados", icon: Users },
  { href: "/admin/presentes", label: "Presentes", icon: Gift },
  { href: "/admin/mural", label: "Mural", icon: MessageSquareText },
  { href: "/admin/historia", label: "Nossa História", icon: BookHeart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminRoute>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-sage text-white" : "text-ink-soft hover:bg-ink/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </AdminRoute>
  );
}
