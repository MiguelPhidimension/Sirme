/**
 * GraphQL Provider for Qwik
 * 
 * Provides GraphQL client context to the entire application
 * Compatible with Qwik's reactivity system and SSR
 */

import { 
  component$, 
  createContextId, 
  useContextProvider, 
  useContext, 
  Slot,
  useSignal,
  useStore,
  useVisibleTask$,
  useTask$,
  noSerialize,
  type NoSerialize
} from '@builder.io/qwik';
import { GraphQLClient } from 'graphql-request';

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

export interface GraphQLContextValue {
  client: NoSerialize<GraphQLClient> | undefined;
  endpoint: string;
  isConnected: boolean;
  connectionError: string | null;
}

export const GraphQLContext = createContextId<GraphQLContextValue>('graphql-context');

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * GraphQL Provider Component
 * 
 * Wraps the application with GraphQL client context
 * Provides client instance and helper functions to child components
 * 
 * @example
 * <GraphQLProvider>
 *   <App />
 * </GraphQLProvider>
 */
export const GraphQLProvider = component$(() => {
  // GraphQL endpoint configuration
  const endpoint = 'https://easy-bison-49.hasura.app/v1/graphql';
  const adminSecret = 'QeNCmNFN5d4PuAOhg6QLX5Hq0UfdTR48249BE6ivRPZmxrNAMWVP39yOvMYwvjr2';
  
  // Connection state
  const isConnected = useSignal(false);
  const connectionError = useSignal<string | null>(null);
  const client = useSignal<NoSerialize<GraphQLClient>>();

  // Context value store - make it reactive
  const contextValue = useStore<GraphQLContextValue>({
    client: undefined,
    endpoint,
    isConnected: false,
    connectionError: null
  });

  // Initialize client on mount
  useVisibleTask$(() => {
    // Create client instance with noSerialize to prevent serialization issues
    const graphqlClient = new GraphQLClient(endpoint, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
        'Content-Type': 'application/json',
      },
    });
    
    client.value = noSerialize(graphqlClient);
  });

  // Test connection when client is ready
  useVisibleTask$(async ({ track }) => {
    const currentClient = track(() => client.value);
    
    
    if (!currentClient) return;
    
    try {
      // Simple health check query
      await currentClient.request(`
        query HealthCheck {
          __typename
        }
      `);
      
      isConnected.value = true;
      connectionError.value = null;
    } catch (error) {
      isConnected.value = false;
      connectionError.value = error instanceof Error ? error.message : 'Connection failed';
      console.error('❌ GraphQL connection failed:', error);
    }
  });

  // Update context value when any dependency changes
  useTask$(({ track }) => {
    const currentClient = track(() => client.value);
    const currentConnected = track(() => isConnected.value);
    const currentError = track(() => connectionError.value);
    
  ;
    
    // Update the store properties directly
    contextValue.client = currentClient;
    contextValue.isConnected = currentConnected;
    contextValue.connectionError = currentError;
    
    
  });

  // Provide context to children
  useContextProvider(GraphQLContext, contextValue);

  return <Slot />;
});

// ============================================================================
// CONTEXT HOOK
// ============================================================================

/**
 * Hook to access GraphQL context
 * 
 * @returns GraphQL client and helper functions
 * @throws Error if used outside GraphQLProvider
 * 
 * @example
 * const { client, endpoint } = useGraphQLClient();
 */
export const useGraphQLClient = (): GraphQLContextValue => {
  const context = useContext(GraphQLContext);
  
  if (!context) {
    throw new Error('useGraphQLClient must be used within a GraphQLProvider');
  }
  
  // Add debugging to see what context consumers are getting

  
  return context;
};

/**
 * Helper function to make GraphQL requests
 * Handles the noSerialize client properly
 */
export const makeGraphQLRequest = async <T = any>(
  client: NoSerialize<GraphQLClient> | undefined,
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  if (!client) {
    throw new Error('GraphQL client not initialized');
  }
  
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
}; 