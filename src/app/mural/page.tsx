"use client";

import { useCallback, useEffect, useState } from "react";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { PostComposer } from "@/components/mural/PostComposer";
import { PostCard } from "@/components/mural/PostCard";
import { listMuralPosts } from "@/lib/firestore/mural";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { MuralPost } from "@/types";

function MuralFeed() {
  const [posts, setPosts] = useState<MuralPost[] | null>(null);

  const reload = useCallback(() => {
    listMuralPosts().then(setPosts);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-14 sm:px-6">
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-terracotta">Mural de recados</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Deixe seu recado</h1>
      </header>

      <PostComposer onPosted={reload} />

      {posts === null && <FullPageSpinner />}
      {posts !== null && posts.length === 0 && (
        <p className="text-center text-ink-soft">Seja o primeiro a deixar um recado!</p>
      )}
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} onChange={reload} />
      ))}
    </div>
  );
}

export default function MuralPage() {
  return (
    <GuestRoute>
      <MuralFeed />
    </GuestRoute>
  );
}
