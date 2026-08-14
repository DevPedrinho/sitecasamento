import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MuralPost } from "@/types";

const muralRef = collection(db, "muralPosts");

export async function listMuralPosts(): Promise<MuralPost[]> {
  const snap = await getDocs(query(muralRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MuralPost, "id">) }));
}

export interface NewMuralPostInput {
  authorGuestId: string;
  authorName: string;
  text: string;
  imageUrl?: string;
}

export async function addMuralPost(input: NewMuralPostInput): Promise<string> {
  const docRef = await addDoc(muralRef, {
    authorGuestId: input.authorGuestId,
    authorName: input.authorName,
    text: input.text,
    imageUrl: input.imageUrl ?? "",
    createdAt: new Date().toISOString(),
    likes: [],
  });
  return docRef.id;
}

export async function deleteMuralPost(postId: string): Promise<void> {
  await deleteDoc(doc(db, "muralPosts", postId));
}

export async function toggleLike(
  postId: string,
  guestId: string,
  liked: boolean
): Promise<void> {
  await updateDoc(doc(db, "muralPosts", postId), {
    likes: liked ? arrayRemove(guestId) : arrayUnion(guestId),
  });
}
