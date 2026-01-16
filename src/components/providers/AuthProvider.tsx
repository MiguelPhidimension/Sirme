import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
  useVisibleTask$,
  $,
  type QRL,
} from "@builder.io/qwik";
import type { User } from "~/types";

/**
 * Auth Context
 * Provides user authentication state throughout the application
 */
export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: QRL<(user: User, token: string) => void>;
  logout: QRL<() => void>;
}

export const AuthContext = createContextId<AuthContextState>("auth-context");

/**
 * AuthProvider Component
 * Provides authentication context to child components
 */
export const AuthProvider = component$(() => {
  const authState = useStore<{
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Create QRL functions
  const login = $((user: User, token: string) => {
    authState.user = user;
    authState.token = token;
    authState.isAuthenticated = true;

    // Save to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_user", JSON.stringify(user));
      sessionStorage.setItem("auth_token", token);
    }
  });

  const logout = $(() => {
    authState.user = null;
    authState.token = null;
    authState.isAuthenticated = false;

    // Clear storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
    }
  });

  // Create context value with QRLs
  const contextValue: AuthContextState = {
    get user() {
      return authState.user;
    },
    get token() {
      return authState.token;
    },
    get isAuthenticated() {
      return authState.isAuthenticated;
    },
    login,
    logout,
  };

  // Load auth state from sessionStorage on mount
  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      const userStr = sessionStorage.getItem("auth_user");
      const token = sessionStorage.getItem("auth_token");

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr) as User;
          authState.user = user;
          authState.token = token;
          authState.isAuthenticated = true;
        } catch (error) {
          console.error("Error parsing user data:", error);
          sessionStorage.clear();
        }
      }
    }
  });

  // Provide the context
  useContextProvider(AuthContext, contextValue);

  return <Slot />;
});
