"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Pencil, Trash2, Upload, X, Check } from "lucide-react";
import { addGuest, deleteGuest, listGuests, updateGuest } from "@/lib/firestore/guests";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { Guest } from "@/types";

function inviteMessage(guest: Guest, siteUrl: string): string {
  if (!guest.authUid) {
    return `Oi ${guest.name}! Você está convidado(a) para o nosso casamento 💍 Deysiane & Pedro, 22/05/2027.\nAcesse ${siteUrl}/login, aba "Primeiro acesso", e use o código: ${guest.inviteCode}`;
  }
  if (guest.rsvp.status === "pending") {
    return `Oi ${guest.name}! Não esqueça de confirmar sua presença no nosso casamento em ${siteUrl}/rsvp 💛`;
  }
  return `Oi ${guest.name}! Obrigado por confirmar presença no nosso casamento! Qualquer novidade, avisamos por aqui. 💛`;
}

function statusBadge(guest: Guest) {
  if (guest.rsvp.status === "yes") return <Badge tone="success">Confirmado</Badge>;
  if (guest.rsvp.status === "no") return <Badge tone="danger">Não vai</Badge>;
  return <Badge tone="neutral">Pendente</Badge>;
}

function AddGuestForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [maxCompanions, setMaxCompanions] = useState(0);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addGuest({ name: name.trim(), phone: phone.trim(), maxCompanions });
      setName("");
      setPhone("");
      setMaxCompanions(0);
      onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <Input label="Nome / Família" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="WhatsApp"
        placeholder="5581999999999"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        label="Máx. acompanhantes"
        type="number"
        min={0}
        value={maxCompanions}
        onChange={(e) => setMaxCompanions(Number(e.target.value))}
      />
      <Button type="submit" disabled={saving}>
        {saving ? "Adicionando..." : "Adicionar convidado"}
      </Button>
    </form>
  );
}

function ImportCsv({ onImported }: { onImported: () => void }) {
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      for (const line of lines) {
        const [name, phone = "", maxCompanionsRaw = "0"] = line.split(",").map((v) => v.trim());
        if (!name || name.toLowerCase() === "nome") continue;
        await addGuest({ name, phone, maxCompanions: Number(maxCompanionsRaw) || 0 });
      }
      onImported();
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft hover:text-ink">
      <Upload className="h-4 w-4" />
      {importing ? "Importando..." : "Importar CSV (nome,whatsapp,acompanhantes)"}
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
    </label>
  );
}

function EditRow({ guest, onSaved, onCancel }: { guest: Guest; onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState(guest.phone);
  const [maxCompanions, setMaxCompanions] = useState(guest.maxCompanions);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateGuest(guest.id, { name, phone, maxCompanions });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-t border-ink/10 bg-sage/5">
      <td className="p-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </td>
      <td className="p-3">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </td>
      <td className="p-3">
        <Input
          type="number"
          min={0}
          value={maxCompanions}
          onChange={(e) => setMaxCompanions(Number(e.target.value))}
        />
      </td>
      <td className="p-3" colSpan={2}>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function ConvidadosPage() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  const reload = useCallback(() => {
    listGuests().then(setGuests);
  }, []);

  useEffect(() => {
    reload();
    const setUrlFromLocation = () => setSiteUrl(window.location.origin);
    setUrlFromLocation();
  }, [reload]);

  async function handleDelete(guest: Guest) {
    if (!confirm(`Remover ${guest.name} da lista de convidados?`)) return;
    await deleteGuest(guest.id);
    reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">Convidados</h1>
          <p className="mt-1 text-ink-soft">Cadastre convidados e envie o convite pelo WhatsApp.</p>
        </div>
        <ImportCsv onImported={reload} />
      </header>

      <Card className="p-5">
        <AddGuestForm onAdded={reload} />
      </Card>

      {guests === null && <FullPageSpinner />}

      {guests && (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink-soft">
                <th className="p-3 font-medium">Nome</th>
                <th className="p-3 font-medium">WhatsApp</th>
                <th className="p-3 font-medium">Acompanhantes</th>
                <th className="p-3 font-medium">RSVP</th>
                <th className="p-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) =>
                editingId === guest.id ? (
                  <EditRow
                    key={guest.id}
                    guest={guest}
                    onSaved={() => {
                      setEditingId(null);
                      reload();
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <tr key={guest.id} className="border-t border-ink/10">
                    <td className="p-3">
                      <p className="font-medium text-ink">{guest.name}</p>
                      <p className="text-xs text-ink-soft">{guest.inviteCode}</p>
                    </td>
                    <td className="p-3 text-ink-soft">{guest.phone || "—"}</td>
                    <td className="p-3 text-ink-soft">
                      {guest.rsvp.status === "yes" ? guest.rsvp.companions : "—"} /{" "}
                      {guest.maxCompanions}
                    </td>
                    <td className="p-3">{statusBadge(guest)}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        {guest.phone && (
                          <a
                            href={buildWhatsAppLink(guest.phone, inviteMessage(guest, siteUrl))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sage-dark hover:text-sage"
                            aria-label="Enviar WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setEditingId(guest.id)}
                          className="text-ink-soft hover:text-ink"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest)}
                          className="text-ink-soft hover:text-red-700"
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
