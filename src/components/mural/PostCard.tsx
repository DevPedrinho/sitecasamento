"use client";

import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toggleLike, deleteMuralPost } from "@/lib/firestore/mural";
import { cn } from "@/lib/utils";
import type { MuralPost } from "@/types";

export function PostCard({ post, onChange }: { post: MuralPost; onChange: () => void }) {
  const { guest, isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const liked = guest ? post.likes.includes(guest.id) : false;
  const canDelete = isAdmin || (guest && guest.id === post.authorGuestId);

  async function handleLike() {
    if (!guest || busy) return;
    setBusy(true);
    try {
      await toggleLike(post.id, guest.id, liked);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!canDelete) return;
    if (!confirm("Apagar este recado?")) return;
    await deleteMuralPost(post.id);
    onChange();
  }

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-ink">{post.authorName}</p>
          <p className="text-xs text-ink-soft">
            {new Date(post.createdAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            aria-label="Apagar recado"
            className="text-ink-soft hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {post.text && <p className="whitespace-pre-wrap text-ink">{post.text}</p>}

      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt="Foto do recado"
          className="max-h-96 w-full rounded-xl object-cover"
        />
      )}

      <button
        onClick={handleLike}
        disabled={!guest || busy}
        className={cn(
          "flex w-fit items-center gap-1.5 text-sm transition-colors",
          liked ? "text-terracotta" : "text-ink-soft hover:text-terracotta"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-terracotta")} />
        {post.likes.length}
      </button>
    </article>
  );
}
