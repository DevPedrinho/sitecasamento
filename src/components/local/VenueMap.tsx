import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Venue } from "@/lib/wedding-config";

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function VenueMap({ venue }: { venue: Venue }) {
  const query = encodeURIComponent(venue.address);
  const embedSrc = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${query}`
    : `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
      <div className="aspect-video w-full bg-ink/5">
        <iframe
          title={`Mapa: ${venue.title}`}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-xl text-ink">{venue.title}</h3>
          <p className="text-sm text-ink-soft">{venue.time}</p>
        </div>
        <p className="text-sm text-ink">{venue.address}</p>
        {venue.notes && <p className="text-xs text-ink-soft">{venue.notes}</p>}
        <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="self-start">
          <Button variant="secondary" size="sm">
            <Navigation className="h-4 w-4" />
            Como chegar
          </Button>
        </a>
      </div>
    </div>
  );
}
