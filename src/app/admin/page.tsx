"use client";

import { useEffect, useState } from "react";
import { listGuests } from "@/lib/firestore/guests";
import { listGifts } from "@/lib/firestore/gifts";
import { listMuralPosts } from "@/lib/firestore/mural";
import { Card } from "@/components/ui/Card";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { Guest, GiftItem, MuralPost } from "@/types";

interface Stats {
  guests: Guest[];
  gifts: GiftItem[];
  posts: MuralPost[];
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-serif text-3xl text-ink">{value}</p>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([listGuests(), listGifts(), listMuralPosts()]).then(
      ([guests, gifts, posts]) => setStats({ guests, gifts, posts })
    );
  }, []);

  if (!stats) return <FullPageSpinner />;

  const { guests, gifts, posts } = stats;
  const confirmed = guests.filter((g) => g.rsvp.status === "yes");
  const declined = guests.filter((g) => g.rsvp.status === "no");
  const pending = guests.filter((g) => g.rsvp.status === "pending");
  const totalConfirmedPeople = confirmed.reduce((sum, g) => sum + 1 + g.rsvp.companions, 0);
  const reservedGifts = gifts.filter((g) => g.status === "reserved" || g.status === "given");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-3xl text-ink">Painel administrativo</h1>
        <p className="mt-1 text-ink-soft">Resumo do casamento de Deysiane &amp; Pedro.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Convidados cadastrados" value={guests.length} />
        <StatCard label="Confirmaram presença" value={confirmed.length} />
        <StatCard label="Pessoas confirmadas" value={totalConfirmedPeople} />
        <StatCard label="Não vão comparecer" value={declined.length} />
        <StatCard label="Aguardando resposta" value={pending.length} />
        <StatCard label="Presentes no catálogo" value={gifts.length} />
        <StatCard label="Presentes reservados/dados" value={reservedGifts.length} />
        <StatCard label="Recados no mural" value={posts.length} />
      </div>
    </div>
  );
}
