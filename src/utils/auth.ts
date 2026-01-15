/**
 * Authentication utility functions
 * Handles client-side authentication checks
 */

import { isTokenExpired, verifyHasuraToken } from "./jwt";

/**
 * Check if user is authenticated
 * Validates both token existence and expiration
 */
export const isAuthenticated = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  const token = sessionStorage.getItem("auth_token");
  const user = sessionStorage.getItem("auth_user");

  if (!token || !user) return false;

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear expired session
    clearAuth();
    return false;
  }

  // Verify token signature
  const verified = await verifyHasuraToken(token);
  if (!verified) {
    clearAuth();
    return false;
  }

  return true;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = sessionStorage.getItem("auth_user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_token");
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_user");
};
