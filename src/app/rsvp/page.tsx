"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { useAuth } from "@/lib/auth-context";
import { submitRsvp } from "@/lib/firestore/guests";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { GuestRsvp, RsvpStatus } from "@/types";

function RsvpForm() {
  const { guest, refreshGuest } = useAuth();
  const [status, setStatus] = useState<RsvpStatus>(guest?.rsvp.status ?? "pending");
  const [companions, setCompanions] = useState(guest?.rsvp.companions ?? 0);
  const [companionNames, setCompanionNames] = useState<string[]>(
    guest?.rsvp.companionNames ?? []
  );
  const [dietaryNotes, setDietaryNotes] = useState(guest?.rsvp.dietaryNotes ?? "");
  const [message, setMessage] = useState(guest?.rsvp.message ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!guest) return null;

  function setCompanionCount(count: number) {
    const bounded = Math.max(0, Math.min(count, guest!.maxCompanions));
    setCompanions(bounded);
    setCompanionNames((prev) => {
      const next = [...prev];
      next.length = bounded;
      return next.map((n) => n ?? "");
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guest) return;
    setSaving(true);
    setSaved(false);
    const rsvp: GuestRsvp = {
      status,
      companions: status === "yes" ? companions : 0,
      companionNames: status === "yes" ? companionNames.filter(Boolean) : [],
      dietaryNotes,
      message,
      respondedAt: null,
    };
    try {
      await submitRsvp(guest.id, rsvp);
      await refreshGuest();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Você vai comparecer?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus("yes")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border p-4 font-medium transition-colors",
              status === "yes"
                ? "border-sage bg-sage/10 text-sage-dark"
                : "border-ink/10 text-ink-soft hover:border-ink/20"
            )}
          >
            <CheckCircle2 className="h-5 w-5" /> Sim, vou!
          </button>
          <button
            type="button"
            onClick={() => setStatus("no")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border p-4 font-medium transition-colors",
              status === "no"
                ? "border-lilac bg-lilac/10 text-lilac-dark"
                : "border-ink/10 text-ink-soft hover:border-ink/20"
            )}
          >
            <XCircle className="h-5 w-5" /> Não poderei ir
          </button>
        </div>
      </div>

      {status === "yes" && guest.maxCompanions > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink">
            Quantos acompanhantes (além de você)? Máximo: {guest.maxCompanions}
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCompanionCount(companions - 1)}
            >
              -
            </Button>
            <span className="w-8 text-center font-medium">{companions}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCompanionCount(companions + 1)}
            >
              +
            </Button>
          </div>

          {companions > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: companions }).map((_, i) => (
                <Input
                  key={i}
                  label={`Nome do acompanhante ${i + 1}`}
                  value={companionNames[i] ?? ""}
                  onChange={(e) =>
                    setCompanionNames((prev) => {
                      const next = [...prev];
                      next[i] = e.target.value;
                      return next;
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {status === "yes" && (
        <Textarea
          label="Restrição alimentar (opcional)"
          value={dietaryNotes}
          onChange={(e) => setDietaryNotes(e.target.value)}
          placeholder="Vegetariano, alergias, etc."
        />
      )}

      <Textarea
        label="Deixe uma mensagem para os noivos (opcional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button type="submit" disabled={saving || status === "pending"}>
        {saving ? "Salvando..." : "Confirmar"}
      </Button>

      {saved && <p className="text-center text-sm text-sage-dark">Presença atualizada! 🎉</p>}
    </form>
  );
}

export default function RsvpPage() {
  return (
    <GuestRoute>
      <div className="mx-auto w-full max-w-xl px-4 py-14 sm:px-6">
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-lilac">RSVP</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Confirmação de presença</h1>
        </header>
        <Card className="p-6 sm:p-8">
          <RsvpForm />
        </Card>
      </div>
    </GuestRoute>
  );
}
