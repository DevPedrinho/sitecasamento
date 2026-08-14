import { Shirt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { dressCode } from "@/lib/wedding-config";

export const metadata = { title: "Dress Code | Deysiane & Pedro" };

export default function DressCodePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <header className="mb-10 text-center">
        <Shirt className="mx-auto h-8 w-8 text-lilac" />
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-lilac">Dress code</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{dressCode.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{dressCode.description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {dressCode.guidelines.map((item) => (
          <Card key={item.label} className="p-6">
            <h3 className="font-serif text-lg text-ink">{item.label}</h3>
            <p className="mt-2 text-sm text-ink-soft">{item.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
