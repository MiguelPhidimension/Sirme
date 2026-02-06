/**
 * GraphQL Client for Qwik
 *
 * Lightweight GraphQL client using graphql-request
 * Compatible with Qwik's reactivity system and SSR
 */

import { GraphQLClient } from "graphql-request";

/**
 * Determine the GraphQL endpoint:
 * - DEV: Connect directly to Hasura via VITE_ env var
 * - PROD (browser): Use /api/graphql proxy (Qwik City route)
 * - PROD (server/SSR): Also use Hasura directly if env var available
 */
const getEndpoint = () => {
  // In development, always use VITE_ var for direct Hasura connection
  if (!import.meta.env.PROD) {
    return import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/api/graphql";
  }

  // In production browser: use the proxy route
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/graphql`;
  }

  // In production server (SSR): try direct Hasura, fallback to proxy
  if (typeof process !== "undefined" && process.env?.HASURA_GRAPHQL_ENDPOINT) {
    return process.env.HASURA_GRAPHQL_ENDPOINT;
  }

  // Final fallback
  return "/api/graphql";
};

/**
 * Get admin secret (only in dev or server-side).
 * In production browser, the proxy handles auth — no secret needed here.
 */
const getAdminSecret = () => {
  // Dev: use VITE_ var
  if (!import.meta.env.PROD) {
    return import.meta.env.VITE_HASURA_ADMIN_SECRET;
  }

  // Production server (SSR): use server env var
  if (typeof window === "undefined" && typeof process !== "undefined") {
    return process.env?.HASURA_ADMIN_SECRET;
  }

  // Production browser: proxy handles it, no secret needed
  return undefined;
};

/**
 * Create GraphQL client instance
 * Uses the proxy endpoint in production client.
 * Uses direct connection in server/dev.
 */
export const createGraphQLClient = () => {
  const endpoint = getEndpoint();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = getAdminSecret();
  if (secret) {
    headers["x-hasura-admin-secret"] = secret;
  }

  return new GraphQLClient(endpoint, {
    headers,
  });
};

/**
 * Create GraphQL client instance with JWT authentication
 * Used for user-authenticated operations
 */
export const createAuthenticatedClient = (token: string) => {
  return new GraphQLClient(getEndpoint(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Default client instance (with admin secret context if available)
export const graphqlClient = createGraphQLClient();

/**
 * GraphQL request wrapper with error handling
 * Provides consistent error handling across the application
 */
export const graphqlRequest = async <T = any>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> => {
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};

/**
 * Batch GraphQL requests
 * Useful for fetching multiple queries at once
 */
export const graphqlBatchRequest = async <T = any>(
  queries: Array<{ query: string; variables?: Record<string, any> }>,
): Promise<T[]> => {
  try {
    const promises = queries.map(({ query, variables }) =>
      graphqlClient.request<T>(query, variables),
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error("GraphQL batch request failed:", error);
    throw error;
  }
};
