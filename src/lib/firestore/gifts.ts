import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { GiftItem } from "@/types";

const giftsRef = collection(db, "giftCatalog");

export async function listGifts(): Promise<GiftItem[]> {
  const snap = await getDocs(query(giftsRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GiftItem, "id">) }));
}

export type NewGiftInput = Omit<
  GiftItem,
  "id" | "status" | "reservedByGuestId" | "reservedByName" | "createdAt"
>;

export async function addGift(input: NewGiftInput): Promise<string> {
  const docRef = await addDoc(giftsRef, {
    ...input,
    status: "available",
    reservedByGuestId: null,
    reservedByName: null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateGift(
  giftId: string,
  data: Partial<NewGiftInput>
): Promise<void> {
  await updateDoc(doc(db, "giftCatalog", giftId), data);
}

export async function deleteGift(giftId: string): Promise<void> {
  await deleteDoc(doc(db, "giftCatalog", giftId));
}

/** Reserva um presente de forma atômica, evitando duas pessoas reservarem o mesmo item. */
export async function reserveGift(
  giftId: string,
  guestId: string,
  guestName: string
): Promise<"ok" | "already-taken"> {
  const ref = doc(db, "giftCatalog", giftId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() as GiftItem | undefined;
    if (!data || data.status !== "available") return "already-taken" as const;
    tx.update(ref, {
      status: "reserved",
      reservedByGuestId: guestId,
      reservedByName: guestName,
    });
    return "ok" as const;
  });
}

export async function cancelReservation(giftId: string): Promise<void> {
  await updateDoc(doc(db, "giftCatalog", giftId), {
    status: "available",
    reservedByGuestId: null,
    reservedByName: null,
  });
}

export async function markAsGiven(giftId: string): Promise<void> {
  await updateDoc(doc(db, "giftCatalog", giftId), { status: "given" });
}
