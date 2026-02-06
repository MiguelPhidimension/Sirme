/**
 * GraphQL Client for Qwik
 *
 * Lightweight GraphQL client using graphql-request
 * Compatible with Qwik's reactivity system and SSR
 */

import { GraphQLClient } from "graphql-request";

/**
 * Determine the GraphQL endpoint dynamically on each call.
 * - DEV: Direct Hasura connection via VITE_ env var
 * - PROD browser: /api/graphql proxy (Qwik City route handles secrets)
 * - PROD server (SSR): Direct Hasura if env var available, else VITE_ fallback
 */
const getEndpoint = (): string => {
  const isBrowser = typeof window !== "undefined";

  // DEV mode: always use VITE_ var
  if (!import.meta.env.PROD) {
    return import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/api/graphql";
  }

  // PROD browser: always go through proxy
  if (isBrowser) {
    return `${window.location.origin}/api/graphql`;
  }

  // PROD server (SSR / Edge): try server env, then VITE_ fallback
  // In Vercel Edge, import.meta.env.VITE_* may still be available from build time
  return (
    import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT ||
    (typeof process !== "undefined" && process.env?.HASURA_GRAPHQL_ENDPOINT) ||
    "/api/graphql"
  );
};

/**
 * Get admin secret. Only needed when NOT going through the proxy.
 * The proxy already injects the secret server-side.
 */
const getAdminSecret = (): string | undefined => {
  const isBrowser = typeof window !== "undefined";

  // DEV: use VITE_ var for direct Hasura connection
  if (!import.meta.env.PROD) {
    return import.meta.env.VITE_HASURA_ADMIN_SECRET;
  }

  // PROD browser: proxy handles auth, no secret needed
  if (isBrowser) {
    return undefined;
  }

  // PROD server (SSR): use build-time VITE_ var or process.env
  return (
    import.meta.env.VITE_HASURA_ADMIN_SECRET ||
    (typeof process !== "undefined"
      ? process.env?.HASURA_ADMIN_SECRET
      : undefined)
  );
};

/**
 * Create a fresh GraphQL client instance.
 * Called dynamically to ensure correct endpoint resolution.
 */
export const createGraphQLClient = (): GraphQLClient => {
  const endpoint = getEndpoint();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = getAdminSecret();
  if (secret) {
    headers["x-hasura-admin-secret"] = secret;
  }

  return new GraphQLClient(endpoint, { headers });
};

/**
 * Create GraphQL client with JWT authentication
 */
export const createAuthenticatedClient = (token: string): GraphQLClient => {
  return new GraphQLClient(getEndpoint(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * Dynamic client proxy — creates a fresh client on every `.request()` call.
 * This ensures the endpoint is always resolved in the correct context
 * (browser vs server), avoiding stale singleton issues in Edge Runtime.
 */
export const graphqlClient: GraphQLClient = new Proxy({} as GraphQLClient, {
  get(_target, prop) {
    const client = createGraphQLClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * GraphQL request wrapper with error handling
 */
export const graphqlRequest = async <T = any>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> => {
  try {
    return await graphqlClient.request<T>(query, variables);
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
};

/**
 * Batch GraphQL requests
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
