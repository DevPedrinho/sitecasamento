"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getGuestByCode, inviteCodeToEmail, linkGuestAccount } from "@/lib/firestore/guests";
import type { AppUser, Guest } from "@/types";

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  guest: Guest | null;
  loading: boolean;
  isAdmin: boolean;
  refreshGuest: () => Promise<void>;
  signupWithInviteCode: (
    code: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  loginWithInviteCode: (code: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (user: User) => {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) {
      setProfile(null);
      setGuest(null);
      return;
    }
    const data = userSnap.data() as Omit<AppUser, "uid">;
    const appUser: AppUser = { uid: user.uid, ...data };
    setProfile(appUser);
    if (appUser.role === "guest" && appUser.guestId) {
      const guestSnap = await getDoc(doc(db, "guests", appUser.guestId));
      setGuest(guestSnap.exists() ? ({ id: guestSnap.id, ...guestSnap.data() } as Guest) : null);
    } else {
      setGuest(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await loadProfile(user);
      } else {
        setProfile(null);
        setGuest(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [loadProfile]);

  const refreshGuest = useCallback(async () => {
    if (firebaseUser) await loadProfile(firebaseUser);
  }, [firebaseUser, loadProfile]);

  const signupWithInviteCode = useCallback(
    async (code: string, password: string, displayName: string) => {
      const guestRecord = await getGuestByCode(code);
      if (!guestRecord) {
        throw new Error("Código de convite não encontrado. Confira o código e tente novamente.");
      }
      if (guestRecord.authUid) {
        throw new Error("Este convite já tem uma conta. Use a opção \"Já tenho conta\".");
      }
      const email = inviteCodeToEmail(guestRecord.inviteCode);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      await linkGuestAccount(guestRecord.id, credential.user.uid);
      await loadProfile(credential.user);
    },
    [loadProfile]
  );

  async function loginWithInviteCode(code: string, password: string) {
    const email = inviteCodeToEmail(code);
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginAdmin(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      guest,
      loading,
      isAdmin: profile?.role === "admin",
      refreshGuest,
      signupWithInviteCode,
      loginWithInviteCode,
      loginAdmin,
      logout,
    }),
    [firebaseUser, profile, guest, loading, refreshGuest, signupWithInviteCode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
