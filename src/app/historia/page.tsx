"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { listStoryEvents } from "@/lib/firestore/story";
import { buildWhatsAppShareLink } from "@/lib/whatsapp";
import { formatDatePtBr } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { StoryEvent } from "@/types";

export default function HistoriaPage() {
  const [events, setEvents] = useState<StoryEvent[] | null>(null);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    listStoryEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
    const setUrlFromLocation = () => setPageUrl(window.location.href);
    setUrlFromLocation();
  }, []);

  const shareMessage =
    "Vem ver a nossa história de amor! 💛 Deysiane & Pedro, 22/05/2027 — " + pageUrl;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <header className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-terracotta">Storyteller</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Nossa História</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Um pouquinho da nossa jornada até o grande dia.
        </p>
        <a
          href={buildWhatsAppShareLink(shareMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block"
        >
          <Button variant="secondary" size="sm">
            <MessageCircle className="h-4 w-4" />
            Compartilhar no WhatsApp
          </Button>
        </a>
      </header>

      {events === null && <FullPageSpinner />}

      {events !== null && events.length === 0 && (
        <p className="text-center text-ink-soft">
          A nossa história ainda está sendo escrita por aqui — volte em breve!
        </p>
      )}

      {events !== null && events.length > 0 && (
        <ol className="relative flex flex-col gap-10 border-l border-ink/10 pl-8">
          {events.map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-terracotta" />
              <p className="text-xs uppercase tracking-wide text-terracotta">
                {formatDatePtBr(event.date)}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-ink">{event.title}</h2>
              {event.imageUrl && (
                <div className="relative mt-3 h-56 w-full overflow-hidden rounded-xl bg-ink/5 sm:h-72">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 640px"
                  />
                </div>
              )}
              <p className="mt-3 text-ink-soft">{event.description}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
