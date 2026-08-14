import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Guest, GuestRsvp } from "@/types";

const guestsRef = collection(db, "guests");

/**
 * O ID do documento É o código de convite (ex.: "DEYSIANE-4F2A"). Isso permite que o
 * convidado, antes de fazer login, busque seu próprio registro com um `getDoc` direto
 * (permitido pelas regras de segurança) sem expor a lista completa de convidados
 * (que exige `list`, restrito ao admin).
 */
function codeToDocId(code: string): string {
  return code.trim().toUpperCase();
}

export function inviteCodeToEmail(code: string): string {
  return `${codeToDocId(code).toLowerCase()}@convite.casamento.deysiane-pedro.app`;
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 10);
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function emptyRsvp(): GuestRsvp {
  return {
    status: "pending",
    companions: 0,
    companionNames: [],
    dietaryNotes: "",
    message: "",
    respondedAt: null,
  };
}

export async function listGuests(): Promise<Guest[]> {
  const snap = await getDocs(query(guestsRef, orderBy("name")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Guest, "id">) }));
}

export async function getGuest(guestId: string): Promise<Guest | null> {
  const snap = await getDoc(doc(db, "guests", guestId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Guest, "id">) };
}

/** Busca por código de convite — usada na tela de login, antes da autenticação. */
export async function getGuestByCode(code: string): Promise<Guest | null> {
  return getGuest(codeToDocId(code));
}

export interface NewGuestInput {
  name: string;
  phone: string;
  maxCompanions: number;
}

export async function addGuest(input: NewGuestInput): Promise<string> {
  const base = slugify(input.name) || "CONVIDADO";
  let code = `${base}-${randomSuffix()}`;
  // Evita colisão de código (extremamente improvável, mas o ID precisa ser único).
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getGuest(code);
    if (!existing) break;
    code = `${base}-${randomSuffix()}`;
  }
  await setDoc(doc(db, "guests", code), {
    name: input.name,
    phone: input.phone,
    maxCompanions: input.maxCompanions,
    inviteCode: code,
    authUid: null,
    rsvp: emptyRsvp(),
    createdAt: new Date().toISOString(),
  });
  return code;
}

export async function updateGuest(
  guestId: string,
  data: Partial<Pick<Guest, "name" | "phone" | "maxCompanions">>
): Promise<void> {
  await updateDoc(doc(db, "guests", guestId), data);
}

export async function deleteGuest(guestId: string): Promise<void> {
  await deleteDoc(doc(db, "guests", guestId));
}

export async function linkGuestAccount(guestId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, "guests", guestId), { authUid: uid });
  await setDoc(doc(db, "users", uid), {
    role: "guest",
    guestId,
    displayName: "",
  });
}

export async function submitRsvp(guestId: string, rsvp: GuestRsvp): Promise<void> {
  await updateDoc(doc(db, "guests", guestId), {
    rsvp: { ...rsvp, respondedAt: new Date().toISOString() },
  });
}
