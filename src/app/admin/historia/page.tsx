"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  addStoryEvent,
  deleteStoryEvent,
  listStoryEvents,
  updateStoryEvent,
  type NewStoryEventInput,
} from "@/lib/firestore/story";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { formatDatePtBr } from "@/lib/utils";
import type { StoryEvent } from "@/types";

function emptyForm(order: number): NewStoryEventInput {
  return { title: "", date: new Date().toISOString().slice(0, 10), description: "", imageUrl: "", order };
}

function StoryForm({
  initial,
  nextOrder,
  onSaved,
  onCancel,
}: {
  initial?: StoryEvent;
  nextOrder: number;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<NewStoryEventInput>(initial ?? emptyForm(nextOrder));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof NewStoryEventInput>(key: K, value: NewStoryEventInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file, `story/${Date.now()}-${file.name}`);
      }
      const payload = { ...form, imageUrl };
      if (initial) {
        await updateStoryEvent(initial.id, payload);
      } else {
        await addStoryEvent(payload);
        setForm(emptyForm(nextOrder + 1));
        setFile(null);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          label="Título"
          className="sm:col-span-2"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
        <Input label="Data" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
      </div>
      <Textarea
        label="Descrição"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Ordem (posição na linha do tempo)"
          type="number"
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
        />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Foto</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : initial ? "Salvar alterações" : "Adicionar capítulo"}
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

export default function AdminHistoriaPage() {
  const [events, setEvents] = useState<StoryEvent[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(() => {
    listStoryEvents().then(setEvents);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleDelete(event: StoryEvent) {
    if (!confirm(`Remover "${event.title}" da linha do tempo?`)) return;
    await deleteStoryEvent(event.id);
    reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-3xl text-ink">Nossa história</h1>
        <p className="mt-1 text-ink-soft">Monte a linha do tempo exibida em &quot;Nossa História&quot;.</p>
      </header>

      <Card className="p-5">
        <StoryForm nextOrder={events?.length ?? 0} onSaved={reload} />
      </Card>

      {events === null && <FullPageSpinner />}

      <div className="flex flex-col gap-3">
        {events?.map((event) =>
          editingId === event.id ? (
            <Card key={event.id} className="p-5">
              <StoryForm
                initial={event}
                nextOrder={events.length}
                onSaved={() => {
                  setEditingId(null);
                  reload();
                }}
                onCancel={() => setEditingId(null)}
              />
            </Card>
          ) : (
            <Card key={event.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-xs text-ink-soft">
                  #{event.order} · {formatDatePtBr(event.date)}
                </p>
                <p className="font-serif text-lg text-ink">{event.title}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingId(event.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(event)}>
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
