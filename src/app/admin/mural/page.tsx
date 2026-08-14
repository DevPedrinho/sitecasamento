"use client";

import { useCallback, useEffect, useState } from "react";
import { listMuralPosts } from "@/lib/firestore/mural";
import { PostCard } from "@/components/mural/PostCard";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { MuralPost } from "@/types";

export default function AdminMuralPage() {
  const [posts, setPosts] = useState<MuralPost[] | null>(null);

  const reload = useCallback(() => {
    listMuralPosts().then(setPosts);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-3xl text-ink">Moderação do mural</h1>
        <p className="mt-1 text-ink-soft">Remova recados inadequados, se necessário.</p>
      </header>

      {posts === null && <FullPageSpinner />}
      {posts !== null && posts.length === 0 && (
        <p className="text-ink-soft">Nenhum recado publicado ainda.</p>
      )}

      <div className="flex max-w-xl flex-col gap-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} onChange={reload} />
        ))}
      </div>
    </div>
  );
}
