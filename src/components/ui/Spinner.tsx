import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-2 border-sage/30 border-t-sage",
        className
      )}
      role="status"
      aria-label="Carregando"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner />
    </div>
  );
}
