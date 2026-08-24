"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Gift } from "lucide-react";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { GiftCard } from "@/components/gifts/GiftCard";
import { listGifts } from "@/lib/firestore/gifts";
import { useAuth } from "@/lib/auth-context";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import type { GiftItem } from "@/types";

type SortOption = "az" | "price-asc" | "price-desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "az", label: "A-Z" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

function sortGifts(gifts: GiftItem[], sort: SortOption): GiftItem[] {
  const sorted = [...gifts];
  if (sort === "az") sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function GiftCatalog() {
  const { guest } = useAuth();
  const [gifts, setGifts] = useState<GiftItem[] | null>(null);
  const [sort, setSort] = useState<SortOption>("az");
  const [showMineOnly, setShowMineOnly] = useState(false);

  const reload = useCallback(() => {
    listGifts().then(setGifts);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const myReservedCount = useMemo(
    () => (guest ? (gifts ?? []).filter((g) => g.reservedByGuestId === guest.id).length : 0),
    [gifts, guest]
  );

  const visibleGifts = useMemo(() => {
    if (!gifts) return [];
    const filtered = showMineOnly
      ? gifts.filter((g) => guest && g.reservedByGuestId === guest.id)
      : gifts;
    return sortGifts(filtered, sort);
  }, [gifts, showMineOnly, guest, sort]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-lilac">Lista de presentes</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Presenteie o casal</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Escolha uma cota disponível — ela fica reservada em seu nome para que
          ninguém repita o presente.
        </p>
      </header>

      {gifts === null && <FullPageSpinner />}

      {gifts !== null && gifts.length === 0 && (
        <p className="text-center text-ink-soft">
          O catálogo de presentes ainda está sendo preparado pelos noivos.
        </p>
      )}

      {gifts !== null && gifts.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowMineOnly((v) => !v)}
            disabled={myReservedCount === 0}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              showMineOnly
                ? "border-sage bg-sage text-white"
                : "border-sage/40 bg-sage/10 text-sage-dark hover:bg-sage/20"
            )}
          >
            <Gift className="h-4 w-4" />
            {myReservedCount === 0
              ? "Você ainda não reservou nenhum presente"
              : `Você reservou ${myReservedCount} presente${myReservedCount > 1 ? "s" : ""}`}
          </button>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            Ordenar lista por:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {showMineOnly && visibleGifts.length === 0 && (
        <p className="text-center text-ink-soft">Você ainda não reservou nenhum presente.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGifts.map((gift) => (
          <GiftCard key={gift.id} gift={gift} onChange={reload} />
        ))}
      </div>
    </div>
  );
}

export default function PresentesPage() {
  return (
    <GuestRoute>
      <GiftCatalog />
    </GuestRoute>
  );
}
