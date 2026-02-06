/**
 * GraphQL Client for Qwik
 *
 * Lightweight GraphQL client using graphql-request
 * Compatible with Qwik's reactivity system and SSR
 */

import { GraphQLClient } from "graphql-request";

// Determine if we are running on the server
const isServer = typeof window === "undefined";

// Helper to safely get server env vars
const getServerEnv = (key: string) => {
  if (isServer && typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Determine the endpoint dynamically
const getEndpoint = () => {
  if (isServer) {
    // SSR/Server: Connect directly to Hasura using server env vars
    // This avoids "Invalid URL" errors with relative paths in Node
    const serverUrl = getServerEnv("HASURA_GRAPHQL_ENDPOINT");
    if (serverUrl) return serverUrl;
  }

  // Client/Browser: Use proxy in PROD, or VITE var in DEV
  return import.meta.env.PROD
    ? "/api/graphql"
    : import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/api/graphql";
};

// Helper to get admin secret
const getAdminSecret = () => {
  if (isServer) {
    return (
      getServerEnv("HASURA_ADMIN_SECRET") ||
      import.meta.env.VITE_HASURA_ADMIN_SECRET
    );
  }
  // On client, only use VITE_ var (which should only work in dev)
  // In PROD client, this should return undefined (handled by proxy)
  return !import.meta.env.PROD
    ? import.meta.env.VITE_HASURA_ADMIN_SECRET
    : undefined;
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
