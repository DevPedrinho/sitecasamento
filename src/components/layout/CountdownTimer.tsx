"use client";

import { useEffect, useState } from "react";
import { WEDDING_DATE } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "dias" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
];

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {units.map((unit) => {
        const value = timeLeft ? String(timeLeft[unit.key]).padStart(2, "0") : "--";
        return (
          <div
            key={unit.key}
            className="flex flex-col items-center overflow-hidden rounded-2xl border border-ink/10 bg-white/70 px-3 py-4 shadow-sm backdrop-blur-sm sm:px-5 sm:py-6"
          >
            <span
              key={value}
              className="tick font-serif text-2xl font-semibold tabular-nums text-lilac sm:text-4xl"
            >
              {value}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-wide text-ink-soft sm:text-xs">
              {unit.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
