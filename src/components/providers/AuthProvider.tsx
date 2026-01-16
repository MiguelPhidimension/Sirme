import { createContextId } from "@builder.io/qwik";
import type { User } from "~/types";

/**
 * Auth Context
 * Provides user authentication state throughout the application
 */
export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContextId<AuthContextState>("auth-context");
