/**
 * GraphQL Provider for React
 * 
 * Provides GraphQL client context to the React application
 * Integrates with React Query for state management
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { GraphQLClient } from 'graphql-request'

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = 'https://easy-bison-49.hasura.app/v1/graphql'
const ADMIN_SECRET = 'QeNCmNFN5d4PuAOhg6QLX5Hq0UfdTR48249BE6ivRPZmxrNAMWVP39yOvMYwvjr2'

// GraphQL Context interface
interface GraphQLContextType {
  client: GraphQLClient
  isConnected: boolean
}

// Create GraphQL context
const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined)

// GraphQL Provider Props
interface GraphQLProviderProps {
  children: ReactNode
}

/**
 * GraphQL Provider Component
 * Provides GraphQL client instance to all child components
 */
export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({ children }) => {
  // Create GraphQL client instance
  const client = React.useMemo(() => {
    return new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'x-hasura-admin-secret': ADMIN_SECRET,
        'Content-Type': 'application/json',
      },
    })
  }, [])

  // Connection status (for now always true, can be enhanced later)
  const isConnected = true

  const contextValue: GraphQLContextType = {
    client,
    isConnected,
  }

  return (
    <GraphQLContext.Provider value={contextValue}>
      {children}
    </GraphQLContext.Provider>
  )
}

/**
 * Hook to use GraphQL client
 * Provides access to the GraphQL client instance
 */
export const useGraphQLClient = (): GraphQLContextType => {
  const context = useContext(GraphQLContext)
  
  if (context === undefined) {
    throw new Error('useGraphQLClient must be used within a GraphQLProvider')
  }
  
  return context
}

/**
 * GraphQL request wrapper with error handling
 * Compatible with React Query
 */
export const makeGraphQLRequest = async <T = any>(
  client: GraphQLClient,
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  try {
    const data = await client.request<T>(query, variables)
    return data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
} 