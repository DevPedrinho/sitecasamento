export type RsvpStatus = "pending" | "yes" | "no";

export interface GuestRsvp {
  status: RsvpStatus;
  companions: number;
  companionNames: string[];
  dietaryNotes: string;
  message: string;
  respondedAt: string | null;
}

export interface Guest {
  id: string;
  name: string;
  inviteCode: string;
  phone: string;
  maxCompanions: number;
  authUid: string | null;
  rsvp: GuestRsvp;
  createdAt: string;
}

export type UserRole = "guest" | "admin";

export interface AppUser {
  uid: string;
  role: UserRole;
  guestId: string | null;
  displayName: string;
}

export type GiftType = "produto" | "cota";
export type GiftStatus = "available" | "reserved" | "given";

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  /** Emoji usado como ilustração do card quando não há foto (ideal para "cotas" divertidas). */
  icon: string;
  price: number;
  type: GiftType;
  purchaseLink: string;
  pixKey: string;
  status: GiftStatus;
  reservedByGuestId: string | null;
  reservedByName: string | null;
  category: string;
  createdAt: string;
}

export interface MuralPost {
  id: string;
  authorGuestId: string;
  authorName: string;
  text: string;
  imageUrl: string;
  createdAt: string;
  likes: string[];
}

export interface StoryEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  order: number;
}
