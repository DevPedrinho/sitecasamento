interface BotanicalFlourishProps {
  variant: "branch" | "lavender";
  className?: string;
}

/**
 * Ilustrações vetoriais leves inspiradas nos elementos gráficos da identidade
 * visual (ramo de folhas em verde sálvia, ramo de lavanda em lilás) — usadas
 * como flourish decorativo, nunca como conteúdo principal.
 */
export function BotanicalFlourish({ variant, className }: BotanicalFlourishProps) {
  if (variant === "lavender") {
    return (
      <svg
        viewBox="0 0 120 200"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M60 195 C55 150 65 100 58 40"
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {[
          [150, 14, -18],
          [128, -13, 14],
          [108, 14, -14],
          [88, -13, 12],
          [68, 12, -10],
          [50, -11, 10],
        ].map(([budY, dx, rot], i) => {
          const budX = 58 + dx * 0.35;
          return (
            <ellipse
              key={i}
              cx={budX}
              cy={budY}
              rx="6"
              ry="10"
              transform={`rotate(${rot} ${budX} ${budY})`}
              fill="var(--color-lavender)"
              opacity={0.5 + (i % 3) * 0.12}
            />
          );
        })}
        <ellipse cx="58" cy="36" rx="4.5" ry="8" fill="var(--color-lilac)" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 200" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 195 C40 140 30 90 70 30"
        stroke="var(--color-sage)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      {[
        [30, 170, -26, -18],
        [38, 148, 24, 20],
        [42, 126, -24, -16],
        [50, 104, 24, 18],
        [56, 82, -22, -14],
        [64, 60, 20, 16],
      ].map(([x, y, dx, rot], i) => (
        <ellipse
          key={i}
          cx={x + dx * 0.5}
          cy={y}
          rx="16"
          ry="8"
          transform={`rotate(${rot} ${x + dx * 0.5} ${y})`}
          fill="var(--color-sage)"
          opacity={0.35 + (i % 3) * 0.12}
        />
      ))}
      <ellipse cx="72" cy="34" rx="4.5" ry="8" fill="var(--color-gold)" opacity="0.7" />
    </svg>
  );
}
