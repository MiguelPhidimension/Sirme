/**
 * Authentication utility functions
 * Handles client-side authentication checks
 */

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = sessionStorage.getItem("auth_token");
  const user = sessionStorage.getItem("auth_user");

  return !!(token && user);
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
