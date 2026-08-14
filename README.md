# Site do Casamento — Deysiane & Pedro Gledson

Site do casamento de Deysiane Sobrinho e Pedro Gledson, 22 de maio de 2027.
Construído com **Next.js (App Router) + TypeScript + Tailwind CSS + Firebase**
(Auth, Firestore e Storage).

## Funcionalidades

- Contagem regressiva e página inicial
- Local e rotas (mapa do Google + botão "Como chegar")
- Dress code
- Storyteller: linha do tempo da história do casal, com compartilhamento via WhatsApp
- Login de convidados por código de convite (sem exigir e-mail real)
- Confirmação de presença (RSVP) com acompanhantes
- Mural de recados estilo rede social (posts com foto + curtidas)
- Catálogo de presentes com reserva (evita duplicidade) — produtos com link de loja
  ou cotas via Pix
- Painel administrativo (Pedro e Deysiane): gestão de convidados (CRUD + import CSV
  + envio de convite/lembrete via WhatsApp), catálogo de presentes, moderação do
  mural e edição da linha do tempo

## Rodando localmente (com emuladores do Firebase — recomendado antes de ter um projeto real)

```bash
npm install
cp .env.local.example .env.local   # já vem configurado para usar os emuladores
npm run emulators                  # em um terminal (Auth, Firestore, Storage, UI em :4000)
npm run dev                        # em outro terminal
```

Acesse http://localhost:3000. Os dados ficam salvos em `./emulator-data` entre reinícios.

Para testar o painel admin nos emuladores, crie um usuário manualmente pela UI dos
emuladores (http://localhost:4000/auth) e depois crie, na aba Firestore, o documento
`users/<uid-do-usuario>` com `{ role: "admin", guestId: null, displayName: "Admin" }`.

## Configurando um projeto Firebase real (produção)

1. Crie um projeto em https://console.firebase.google.com.
2. Ative **Authentication** (método E-mail/senha), **Firestore Database** e **Storage**.
3. Em Configurações do projeto > Seus apps, crie um app Web e copie as chaves para
   o seu `.env.local` (baseado em `.env.local.example`), e defina
   `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false`.
4. Publique as regras de segurança:
   ```bash
   npx firebase login
   npx firebase use --add        # selecione o projeto criado
   npx firebase deploy --only firestore:rules,storage:rules
   ```
5. Crie as contas de admin (Pedro e Deysiane):
   - Gere uma chave de service account em Configurações do projeto > Contas de
     serviço > Gerar nova chave privada, salve como `service-account.json` na raiz
     do projeto (já está no `.gitignore`).
   - Edite `scripts/seed-admins.ts` com os e-mails/senhas reais.
   - Rode `npm run seed:admins`.
   - Troquem as senhas padrão assim que possível.

## Google Maps

A página `/local` funciona sem nenhuma configuração (usa o embed público do Google
Maps). Para uma exibição mais robusta, crie uma chave em
https://console.cloud.google.com/google/maps-apis (ative "Maps Embed API") e
preencha `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` no `.env.local`.

## Editando o conteúdo do site

- **Local, dress code**: edite `src/lib/wedding-config.ts`.
- **Convidados, presentes e linha do tempo ("Nossa História")**: gerenciados pelo
  painel `/admin` (login como administrador).
- **Cores e fontes**: `src/app/globals.css`.

## Notificações via WhatsApp

Por padrão o projeto usa links `wa.me` (gratuitos, sem necessidade de aprovação ou
custo por mensagem): o painel admin gera, para cada convidado, um link que abre o
WhatsApp com uma mensagem pronta (convite ou lembrete de RSVP) para o admin revisar
e enviar manualmente. A página "Nossa História" também tem um botão de compartilhar
via WhatsApp. Caso no futuro vocês queiram envio automático em massa, será
necessário contratar a API do WhatsApp Business (Meta Cloud API ou Twilio), o que
tem custo por mensagem e não foi incluído neste projeto.

## Build de produção

```bash
npm run build
npm run start
```

Deploy recomendado: [Vercel](https://vercel.com) (configure as mesmas variáveis de
ambiente do `.env.local` no painel do projeto).
