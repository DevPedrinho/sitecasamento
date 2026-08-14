import Link from "next/link";
import { MapPin, Shirt, Gift, BookHeart, NotebookPen } from "lucide-react";
import { CountdownTimer } from "@/components/layout/CountdownTimer";
import { BotanicalFlourish } from "@/components/brand/BotanicalFlourish";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const quickLinks = [
  {
    href: "/historia",
    icon: BookHeart,
    title: "Nossa História",
    description: "Como tudo começou, até o pedido de casamento.",
  },
  {
    href: "/local",
    icon: MapPin,
    title: "Local e Rotas",
    description: "Endereço da cerimônia e da festa, com rota pelo Google Maps.",
  },
  {
    href: "/dress-code",
    icon: Shirt,
    title: "Dress Code",
    description: "O que vestir para celebrar com a gente.",
  },
  {
    href: "/presentes",
    icon: Gift,
    title: "Lista de Presentes",
    description: "Escolha um mimo para o novo lar do casal.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative isolate flex flex-col items-center gap-8 overflow-hidden px-4 py-24 text-center sm:py-32">
        {/* Fundo do hero: gradiente na paleta da marca + flourishes botânicos nos cantos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_-10%,rgba(141,121,168,0.20),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(168,179,159,0.25),transparent_50%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-cream" />
        <BotanicalFlourish
          variant="branch"
          className="pointer-events-none absolute -left-4 -top-6 -z-10 h-56 w-44 opacity-70 sm:h-72 sm:w-56"
        />
        <BotanicalFlourish
          variant="lavender"
          className="pointer-events-none absolute -bottom-8 -right-2 -z-10 h-56 w-36 rotate-[8deg] opacity-70 sm:h-72 sm:w-44"
        />

        <p className="text-sm uppercase tracking-[0.3em] text-lilac">
          Vamos nos casar
        </p>
        <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Deysiane &amp; Pedro Gledson
        </h1>
        <p className="font-script text-3xl leading-none text-sage-dark sm:text-4xl">
          Um amor que cuida, se adapta e escolhe caminhar junto.
        </p>
        <p className="max-w-xl text-lg text-ink-soft">
          22 de maio de 2027 · Com muito carinho, convidamos você para celebrar
          o início da nossa nova história.
        </p>

        <CountdownTimer />

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link href="/rsvp">
            <Button size="lg">Confirmar presença</Button>
          </Link>
          <Link href="/local">
            <Button size="lg" variant="outline">
              Ver local e rotas
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl text-ink">Tudo o que você precisa saber</h2>
          <p className="mt-2 text-ink-soft">Navegue pelas seções do nosso grande dia.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href}>
              <Card className="flex h-full flex-col gap-3 p-6 transition-transform hover:-translate-y-1 hover:shadow-md">
                <Icon className="h-7 w-7 text-sage-dark" />
                <h3 className="font-serif text-lg text-ink">{title}</h3>
                <p className="text-sm text-ink-soft">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6">
        <Card className="flex flex-col items-center gap-4 p-10">
          <NotebookPen className="h-8 w-8 text-lilac" />
          <h2 className="font-serif text-2xl text-ink">Deixe um recado para os noivos</h2>
          <p className="max-w-md text-ink-soft">
            Faça login com o código do seu convite e escreva uma mensagem no
            nosso mural, como num feed de rede social.
          </p>
          <Link href="/mural">
            <Button variant="secondary">Ir para o Mural</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
