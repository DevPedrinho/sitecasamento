"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Início" },
  { href: "/historia", label: "Nossa História" },
  { href: "/local", label: "Local" },
  { href: "/dress-code", label: "Dress Code" },
];

const guestLinks = [
  { href: "/rsvp", label: "Confirmar Presença" },
  { href: "/mural", label: "Mural" },
  { href: "/presentes", label: "Presentes" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { firebaseUser, isAdmin, guest, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const links = [...publicLinks, ...(firebaseUser && guest ? guestLinks : [])];

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
          <Heart className="h-5 w-5 text-lilac" />
          Deysiane &amp; Pedro
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-ink-soft transition-colors hover:text-ink",
                pathname === link.href && "text-lilac"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Painel Admin
              </Button>
            </Link>
          )}
          {firebaseUser ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>

        <button
          className="p-2 lg:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-cream px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-ink/5",
                  pathname === link.href && "text-lilac"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-ink/5"
              >
                Painel Admin
              </Link>
            )}
            {firebaseUser ? (
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-soft hover:bg-ink/5"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-lilac"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
