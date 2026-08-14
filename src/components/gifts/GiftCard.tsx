"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrencyBrl } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { reserveGift, cancelReservation } from "@/lib/firestore/gifts";
import type { GiftItem } from "@/types";

export function GiftCard({ gift, onChange }: { gift: GiftItem; onChange: () => void }) {
  const { guest, firebaseUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const reservedByMe = guest ? gift.reservedByGuestId === guest.id : false;

  async function handleReserve() {
    if (!guest || !firebaseUser) return;
    setBusy(true);
    try {
      const result = await reserveGift(gift.id, guest.id, firebaseUser.displayName || guest.name);
      if (result === "already-taken") alert("Ops, alguém já reservou este presente agora mesmo.");
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    setBusy(true);
    try {
      await cancelReservation(gift.id);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  function copyPixKey() {
    navigator.clipboard.writeText(gift.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-square w-full bg-ink/5">
        {gift.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gift.imageUrl} alt={gift.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">Sem foto</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg text-ink">{gift.name}</h3>
          {gift.status === "available" && <Badge tone="success">Disponível</Badge>}
          {gift.status === "reserved" && (
            <Badge tone="warning">{reservedByMe ? "Reservado por você" : "Reservado"}</Badge>
          )}
          {gift.status === "given" && <Badge tone="neutral">Presenteado</Badge>}
        </div>
        {gift.description && <p className="text-sm text-ink-soft">{gift.description}</p>}
        {gift.price > 0 && (
          <p className="text-sm font-medium text-ink">{formatCurrencyBrl(gift.price)}</p>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {gift.status === "available" && (
            <Button size="sm" onClick={handleReserve} disabled={busy}>
              Presentear
            </Button>
          )}
          {gift.status === "reserved" && reservedByMe && (
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={busy}>
              Cancelar reserva
            </Button>
          )}

          {reservedByMe && gift.type === "produto" && gift.purchaseLink && (
            <a href={gift.purchaseLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" className="w-full">
                <ExternalLink className="h-4 w-4" />
                Comprar na loja
              </Button>
            </a>
          )}

          {reservedByMe && gift.type === "cota" && gift.pixKey && (
            <button
              onClick={copyPixKey}
              className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink hover:bg-ink/5"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Chave copiada!" : "Copiar chave Pix"}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
