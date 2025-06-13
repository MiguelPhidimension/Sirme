/**
 * GraphQL Client for Qwik
 * 
 * Lightweight GraphQL client using graphql-request
 * Compatible with Qwik's reactivity system and SSR
 */

import { GraphQLClient } from 'graphql-request';

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = 'https://easy-bison-49.hasura.app/v1/graphql';
const ADMIN_SECRET = 'QeNCmNFN5d4PuAOhg6QLX5Hq0UfdTR48249BE6ivRPZmxrNAMWVP39yOvMYwvjr2';

/**
 * Create GraphQL client instance
 * Configured with Hasura endpoint and admin secret
 */
export const createGraphQLClient = () => {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      'x-hasura-admin-secret': ADMIN_SECRET,
      'Content-Type': 'application/json',
    },
  });
};

// Default client instance
export const graphqlClient = createGraphQLClient();

/**
 * GraphQL request wrapper with error handling
 * Provides consistent error handling across the application
 */
export const graphqlRequest = async <T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

/**
 * Batch GraphQL requests
 * Useful for fetching multiple queries at once
 */
export const graphqlBatchRequest = async <T = any>(
  queries: Array<{ query: string; variables?: Record<string, any> }>
): Promise<T[]> => {
  try {
    const promises = queries.map(({ query, variables }) =>
      graphqlClient.request<T>(query, variables)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error('GraphQL batch request failed:', error);
    throw error;
  }
}; 