/** Gera um link wa.me com mensagem pré-preenchida (envio manual, sem custo). */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digits}?${params.toString()}`;
}

export function buildWhatsAppShareLink(message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/?${params.toString()}`;
}
