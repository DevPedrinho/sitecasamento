import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StoryEvent } from "@/types";

const storyRef = collection(db, "storyEvents");

export async function listStoryEvents(): Promise<StoryEvent[]> {
  const snap = await getDocs(query(storyRef, orderBy("order")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StoryEvent, "id">) }));
}

export type NewStoryEventInput = Omit<StoryEvent, "id">;

export async function addStoryEvent(input: NewStoryEventInput): Promise<string> {
  const docRef = await addDoc(storyRef, input);
  return docRef.id;
}

export async function updateStoryEvent(
  eventId: string,
  data: Partial<NewStoryEventInput>
): Promise<void> {
  await updateDoc(doc(db, "storyEvents", eventId), data);
}

export async function deleteStoryEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, "storyEvents", eventId));
}
