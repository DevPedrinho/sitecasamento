/**
 * Conteúdo editável do site. Deysiane e Pedro: alterem os valores abaixo com as
 * informações reais do casamento (endereços, horários, textos) sempre que precisar
 * — não é necessário mexer em nenhum outro arquivo do projeto para isso.
 */

export interface Venue {
  id: string;
  title: string;
  address: string;
  time: string;
  notes?: string;
}

export const venues: Venue[] = [
  {
    id: "ceremony",
    title: "Cerimônia",
    address: "Endereço da cerimônia (a definir)",
    time: "22/05/2027 às 16h",
    notes: "Chegue com 30 minutos de antecedência.",
  },
  {
    id: "reception",
    title: "Recepção",
    address: "Endereço da recepção (a definir)",
    time: "22/05/2027 às 19h",
  },
];

export const dressCode = {
  title: "Esporte Fino / Passeio Completo",
  description:
    "Pedimos um dress code de esporte fino para celebrar com a gente. Fique à vontade para caprichar — é festa!",
  guidelines: [
    { label: "Cores a evitar", detail: "Branco e tons de noiva (reservados para Deysiane)." },
    { label: "Convidadas", detail: "Vestido midi ou longo, macacão social." },
    { label: "Convidados", detail: "Camisa social, blazer opcional, calça social." },
    { label: "Cerimônia ao ar livre", detail: "Sapatos anabela são bem-vindos no gramado." },
  ],
};

export const coupleWhatsApp = process.env.NEXT_PUBLIC_COUPLE_WHATSAPP || "";
