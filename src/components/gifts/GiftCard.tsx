"use client";

import { useState } from "react";
import Link from "next/link";
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
    <Card className="flex flex-col overflow-hidden text-center">
      <div className="relative flex aspect-square w-full items-center justify-center bg-cream-dark/60">
        {gift.status !== "available" && (
          <div className="absolute left-3 top-3">
            {gift.status === "reserved" && (
              <Badge tone="warning">{reservedByMe ? "Reservado por você" : "Reservado"}</Badge>
            )}
            {gift.status === "given" && <Badge tone="neutral">Presenteado</Badge>}
          </div>
        )}
        {gift.icon ? (
          <span className="text-7xl" aria-hidden>
            {gift.icon}
          </span>
        ) : gift.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gift.imageUrl} alt={gift.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-ink-soft">Sem foto</span>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 p-5">
        <h3 className="font-serif text-lg text-ink">{gift.name}</h3>
        {gift.description && <p className="text-sm text-ink-soft">{gift.description}</p>}
        {gift.price > 0 && (
          <p className="text-lg font-semibold text-ink">{formatCurrencyBrl(gift.price)}</p>
        )}

        <div className="mt-auto flex w-full flex-col items-center gap-2 pt-2">
          {gift.status === "available" && guest && (
            <Button onClick={handleReserve} disabled={busy} className="w-full">
              Presentear
            </Button>
          )}
          {gift.status === "available" && !guest && (
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Entrar para presentear
              </Button>
            </Link>
          )}
          {gift.status === "reserved" && reservedByMe && (
            <Button variant="outline" onClick={handleCancel} disabled={busy} className="w-full">
              Cancelar reserva
            </Button>
          )}

          {reservedByMe && gift.type === "produto" && gift.purchaseLink && (
            <a href={gift.purchaseLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="secondary" className="w-full">
                <ExternalLink className="h-4 w-4" />
                Comprar na loja
              </Button>
            </a>
          )}

          {reservedByMe && gift.type === "cota" && gift.pixKey && (
            <button
              onClick={copyPixKey}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink hover:bg-ink/5"
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
