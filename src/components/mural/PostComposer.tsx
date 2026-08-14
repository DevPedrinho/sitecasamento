"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { addMuralPost } from "@/lib/firestore/mural";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function PostComposer({ onPosted }: { onPosted: () => void }) {
  const { guest, firebaseUser } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guest || !firebaseUser || (!text.trim() && !file)) return;
    setPosting(true);
    try {
      let imageUrl = "";
      if (file) {
        const path = `mural/${guest.id}/${Date.now()}-${file.name}`;
        imageUrl = await uploadImage(file, path);
      }
      await addMuralPost({
        authorGuestId: guest.id,
        authorName: firebaseUser.displayName || guest.name,
        text: text.trim(),
        imageUrl,
      });
      setText("");
      clearFile();
      onPosted();
    } finally {
      setPosting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <Textarea
        placeholder="Deixe um recado para os noivos..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-20"
      />
      {preview && (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Pré-visualização" className="h-32 rounded-lg object-cover" />
          <button
            type="button"
            onClick={clearFile}
            className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white"
            aria-label="Remover imagem"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft hover:text-ink">
          <ImagePlus className="h-5 w-5" />
          Foto
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <Button type="submit" size="sm" disabled={posting || (!text.trim() && !file)}>
          {posting ? "Postando..." : "Postar"}
        </Button>
      </div>
    </form>
  );
}
