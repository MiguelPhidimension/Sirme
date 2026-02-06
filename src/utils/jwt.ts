/**
 * JWT Utilities for Hasura Authentication
 * Generates and validates JWT tokens with Hasura-specific claims
 */

import { SignJWT, jwtVerify } from "jose";
import type { User } from "~/types";

/**
 * JWT Secret - should be stored in environment variables
 * Must be at least 32 characters for HS256
 */
const JWT_SECRET =
  import.meta.env.PUBLIC_JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production-minimum-32-chars";

/**
 * Get JWT secret as Uint8Array for jose library
 */
const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET);
};

/**
 * Generate JWT token with Hasura claims
 * This token will be recognized by Hasura for authorization
 */
export const generateHasuraToken = async (
  user: User,
  roleName: string = "user",
): Promise<string> => {
  const secret = getSecretKey();

  // Create JWT with Hasura-specific claims
  const token = await new SignJWT({
    // Hasura JWT claims structure
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [
        "user",
        "admin",
        "colaborador",
        "administrador",
      ],
      "x-hasura-default-role": roleName,
      "x-hasura-user-id": user.user_id,
      "x-hasura-role-id": user.role_id,
    },
    // Standard JWT claims
    sub: user.user_id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);

  return token;
};

/**
 * Verify and decode JWT token
 * Returns the payload if valid, null if invalid or expired
 */
export const verifyHasuraToken = async (
  token: string,
): Promise<{
  payload: any;
  hasuraClaims: {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
    "x-hasura-user-id": string;
    "x-hasura-role-id": string;
  };
} | null> => {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);

    const hasuraClaims = payload["https://hasura.io/jwt/claims"] as any;

    if (!hasuraClaims) {
      return null;
    }

    return {
      payload,
      hasuraClaims,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode without verification to check expiration
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return true;

    // Check if expired (exp is in seconds, Date.now() is in milliseconds)
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Refresh token if expired or about to expire
 * Returns new token or null if refresh not needed
 */
export const refreshTokenIfNeeded = async (
  token: string,
  user: User,
  roleName: string = "user",
): Promise<string | null> => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return await generateHasuraToken(user, roleName);

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return await generateHasuraToken(user, roleName);

    // Refresh if token expires in less than 1 day
    const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000;
    if (exp * 1000 < oneDayFromNow) {
      return await generateHasuraToken(user, roleName);
    }

    return null; // No refresh needed
  } catch {
    return await generateHasuraToken(user, roleName);
  }
};
