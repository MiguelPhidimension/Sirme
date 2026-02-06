/**
 * GraphQL Client for Qwik
 *
 * Lightweight GraphQL client using graphql-request
 * Compatible with Qwik's reactivity system and SSR
 */

import { GraphQLClient } from "graphql-request";

// GraphQL endpoint configuration
// Use the serverless proxy in production to avoid exposing secrets.
const GRAPHQL_ENDPOINT = import.meta.env.PROD
  ? "/api/graphql"
  : import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/api/graphql";

// Get admin secret for development/preview environments (direct connection)
// In production, the proxy adds this header, so we don't need it here.
const DEV_ADMIN_SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET;

/**
 * Create GraphQL client instance
 * Uses the proxy endpoint in production.
 * In development, injects admin secret if available for direct connection.
 */
export const createGraphQLClient = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Only add admin secret if we are NOT using the proxy (i.e., we have a dev secret)
  // or if we want to force it in dev.
  // In PROD, DEV_ADMIN_SECRET should be undefined/empty to avoid leaking.
  if (DEV_ADMIN_SECRET && !import.meta.env.PROD) {
    headers["x-hasura-admin-secret"] = DEV_ADMIN_SECRET;
  }

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers,
  });
};

/**
 * Create GraphQL client instance with JWT authentication
 * Used for user-authenticated operations
 */
export const createAuthenticatedClient = (token: string) => {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Default client instance (with admin secret for auth operations)
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
