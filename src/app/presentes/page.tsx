"use client";

import { useCallback, useEffect, useState } from "react";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { GiftCard } from "@/components/gifts/GiftCard";
import { listGifts } from "@/lib/firestore/gifts";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { GiftItem } from "@/types";

function GiftCatalog() {
  const [gifts, setGifts] = useState<GiftItem[] | null>(null);

  const reload = useCallback(() => {
    listGifts().then(setGifts);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-lilac">Lista de presentes</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Presenteie o casal</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Escolha um item disponível — ele fica reservado em seu nome para que
          ninguém repita o presente.
        </p>
      </header>

      {gifts === null && <FullPageSpinner />}
      {gifts !== null && gifts.length === 0 && (
        <p className="text-center text-ink-soft">
          O catálogo de presentes ainda está sendo preparado pelos noivos.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gifts?.map((gift) => (
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
