import { Heart } from "lucide-react";
import { WEDDING_DATE } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream-dark/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-ink-soft sm:px-6">
        <p className="flex items-center gap-2 font-serif text-lg text-ink">
          Deysiane <Heart className="h-4 w-4 text-terracotta" /> Pedro
        </p>
        <p>
          {WEDDING_DATE.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-ink-soft/70">Feito com carinho para o nosso grande dia.</p>
      </div>
    </footer>
  );
}
