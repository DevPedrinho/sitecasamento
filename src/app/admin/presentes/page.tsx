"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Pencil, CheckCircle2 } from "lucide-react";
import {
  addGift,
  deleteGift,
  listGifts,
  markAsGiven,
  updateGift,
  type NewGiftInput,
} from "@/lib/firestore/gifts";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { formatCurrencyBrl } from "@/lib/utils";
import type { GiftItem, GiftType } from "@/types";

const emptyForm: NewGiftInput = {
  name: "",
  description: "",
  imageUrl: "",
  price: 0,
  type: "produto",
  purchaseLink: "",
  pixKey: "",
  category: "",
};

function GiftForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: GiftItem;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<NewGiftInput>(initial ?? emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof NewGiftInput>(key: K, value: NewGiftInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file, `gifts/${Date.now()}-${file.name}`);
      }
      const payload = { ...form, imageUrl };
      if (initial) {
        await updateGift(initial.id, payload);
      } else {
        await addGift(payload);
        setForm(emptyForm);
        setFile(null);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Nome do presente" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        <Input label="Categoria" value={form.category} onChange={(e) => set("category", e.target.value)} />
      </div>
      <Textarea
        label="Descrição"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          label="Preço (R$)"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => set("price", Number(e.target.value))}
        />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Tipo</span>
          <select
            className="rounded-lg border border-ink/15 bg-white px-4 py-2.5"
            value={form.type}
            onChange={(e) => set("type", e.target.value as GiftType)}
          >
            <option value="produto">Produto (link de loja)</option>
            <option value="cota">Cota / Contribuição (Pix)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Foto</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>
      </div>
      {form.type === "produto" && (
        <Input
          label="Link da loja (opcional)"
          value={form.purchaseLink}
          onChange={(e) => set("purchaseLink", e.target.value)}
        />
      )}
      {form.type === "cota" && (
        <Input
          label="Chave Pix (opcional)"
          value={form.pixKey}
          onChange={(e) => set("pixKey", e.target.value)}
        />
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : initial ? "Salvar alterações" : "Adicionar presente"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

export default function AdminPresentesPage() {
  const [gifts, setGifts] = useState<GiftItem[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(() => {
    listGifts().then(setGifts);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleDelete(gift: GiftItem) {
    if (!confirm(`Remover "${gift.name}" do catálogo?`)) return;
    await deleteGift(gift.id);
    reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-3xl text-ink">Catálogo de presentes</h1>
        <p className="mt-1 text-ink-soft">Gerencie os itens que os convidados podem presentear.</p>
      </header>

      <Card className="p-5">
        <GiftForm onSaved={reload} />
      </Card>

      {gifts === null && <FullPageSpinner />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gifts?.map((gift) =>
          editingId === gift.id ? (
            <Card key={gift.id} className="p-5">
              <GiftForm initial={gift} onSaved={() => { setEditingId(null); reload(); }} onCancel={() => setEditingId(null)} />
            </Card>
          ) : (
            <Card key={gift.id} className="flex flex-col gap-2 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg text-ink">{gift.name}</h3>
                {gift.status === "available" && <Badge tone="success">Disponível</Badge>}
                {gift.status === "reserved" && <Badge tone="warning">Reservado</Badge>}
                {gift.status === "given" && <Badge tone="neutral">Presenteado</Badge>}
              </div>
              {gift.reservedByName && (
                <p className="text-xs text-ink-soft">Reservado por {gift.reservedByName}</p>
              )}
              {gift.price > 0 && <p className="text-sm text-ink">{formatCurrencyBrl(gift.price)}</p>}
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {gift.status === "reserved" && (
                  <Button size="sm" variant="secondary" onClick={() => markAsGiven(gift.id).then(reload)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar como dado
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setEditingId(gift.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(gift)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
