import { venues } from "@/lib/wedding-config";
import { VenueMap } from "@/components/local/VenueMap";

export const metadata = { title: "Local e Rotas | Deysiane & Pedro" };

export default function LocalPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <header className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-lilac">Como chegar</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Local e Rotas</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Confira abaixo os endereços da cerimônia e da recepção. Toque em
          &quot;Como chegar&quot; para abrir a rota direto no Google Maps.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {venues.map((venue) => (
          <VenueMap key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
