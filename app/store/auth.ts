import { create } from "zustand";
import { getCookie, setCookie, deleteCookie } from "~/utils/cookies";

export type ProfileStats = {
  requestsCompletedCount: number;
  requestsNegotiatingCount: number;
  requestsCancelledCount: number;
  requestsAcceptedCount: number;
  requestsRejectedCount: number;
  reviewsReceivedCount: number;
  reviewsGivenCount: number;
  demandsCount: number;
  travelsCount: number;
  bookMarkTravelCount: number;
  bookMarkDemandCount: number;
  transactionsCompletedCount: number;
};

export type UserRole = {
  id: number;
  name: string;
};

export type Currency = {
  id: number;
  code: string;
  name: string;
  symbol: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  user?: {
    id: string;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phone?: string;
    profilePictureUrl?: string;
    bio?: string;
    role?: UserRole;
    isPhoneVerified?: boolean;
    isVerified?: boolean;
    isAwaitingVerification?: boolean;
    recentCurrency?: Currency | null;
    createdAt?: Date;
    profileStats?: ProfileStats;
    stripeAccountId?: string | null;
    stripeAccountStatus?: "uninitiated" | "pending" | "active" | "restricted";
  } | null;
  token?: string | null;
  login: (
    accessToken: string,
    user?: AuthState["user"],
    refreshToken?: string
  ) => void;
  logout: () => void;
  hydrateFromCookies: () => void;
  showRegister: boolean;
  openRegister: () => void;
  closeRegister: () => void;
  toggleRegister: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  hydrateFromCookies: () => {
    const token = getCookie("auth_token");
    set({ isLoggedIn: Boolean(token), token });
  },
  login: (accessToken, user, refreshToken) => {
    setCookie("auth_token", accessToken, 7);
    if (refreshToken) setCookie("refresh_token", refreshToken, 30);
    set({ isLoggedIn: true, user: user ?? null, token: accessToken });
  },
  logout: () => {
    deleteCookie("auth_token");
    deleteCookie("refresh_token");
    set({ isLoggedIn: false, user: null, token: null });
  },
  showRegister: false,
  openRegister: () => set({ showRegister: true }),
  closeRegister: () => set({ showRegister: false }),
  toggleRegister: () => set((state) => ({ showRegister: !state.showRegister })),
}));
