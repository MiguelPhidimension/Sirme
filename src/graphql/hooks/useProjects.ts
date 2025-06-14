/**
 * Projects and Clients GraphQL Hooks for React
 * 
 * Custom hooks for project and client data operations using graphql-request with React Query.
 * Provides efficient caching, background updates, and error handling.
 * 
 * Features:
 * - React Query integration for caching and synchronization
 * - Error handling and loading states
 * - Simple and lightweight following GraphQL rules
 * - Matches actual database schema exactly
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useGraphQLClient, makeGraphQLRequest } from '../../components/providers/GraphQLProvider';

// ============================================================================
// TYPE DEFINITIONS - Match Database Schema Exactly
// ============================================================================

/**
 * Client interface matching the actual database schema
 * Fields match exactly with database column names
 */
export interface ClientData {
  client_id: string;  // UUID field as string
  name: string;       // Required client name
}

/**
 * Project interface matching the actual database schema
 * Fields match exactly with database column names
 */
export interface ProjectData {
  project_id: string;   // UUID field as string
  name: string;         // Required project name
  client_id?: string;   // Optional client reference
  description?: string; // Optional project description
  start_date?: string;  // Optional start date
  end_date?: string;    // Optional end date
  created_at: string;   // Creation timestamp
  updated_at: string;   // Update timestamp
}

/**
 * Response type for clients query with aggregate data
 */
export interface ClientsResponse {
  clients: ClientData[];
  clients_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

/**
 * Response type for projects query with aggregate data
 */
export interface ProjectsResponse {
  projects: ProjectData[];
  projects_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

/**
 * Combined client/project data for dropdown display
 */
export interface ClientProjectOption {
  id: string;
  name: string;
  type: 'client' | 'project';
  client_name?: string; // For projects, include client name
}

// ============================================================================
// GRAPHQL QUERIES - Match Actual Schema
// ============================================================================

/**
 * Query to get all clients with aggregate count
 * Fields match exactly with database schema
 */
const GET_CLIENTS_QUERY = `
  query GetClients {
    clients {
      client_id
      name
    }
    clients_aggregate {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Query to get all projects with aggregate count
 * Fields match exactly with database schema
 */
const GET_PROJECTS_QUERY = `
  query GetProjects {
    projects {
      project_id
      name
      client_id
      description
      start_date
      end_date
      created_at
      updated_at
    }
    projects_aggregate {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Query to get projects with their client information
 * Since client relationship field doesn't exist, we'll fetch clients separately
 */
const GET_PROJECTS_WITH_CLIENTS_QUERY = `
  query GetProjectsWithClients {
    projects {
      project_id
      name
      description
      client_id
    }
    clients {
      client_id
      name
    }
    projects_aggregate {
      aggregate {
        count
      }
    }
  }
`;

// ============================================================================
// QUERY HOOKS - Following React Query Pattern
// ============================================================================

/**
 * Hook to get all clients
 * Returns React Query result with clients data, loading states, and error handling
 * 
 * @returns UseQueryResult containing clients array and total count
 */
export const useClients = (): UseQueryResult<{ clients: ClientData[]; total: number }> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('🚀 useClients query executing, client:', client ? 'available' : 'not available');
      
      // Handle client unavailability
      if (!client) {
        console.log('⏳ GraphQL client not available');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Making GraphQL request to fetch all clients');
        
        // Make GraphQL request with proper typing
        const data = await makeGraphQLRequest<ClientsResponse>(
          client, 
          GET_CLIENTS_QUERY
        );
        
        console.log('✅ GraphQL request successful, clients count:', data.clients?.length || 0);
        
        return {
          clients: data.clients || [],
          total: data.clients_aggregate?.aggregate?.count || 0
        };
      } catch (error) {
        console.error('❌ Error fetching clients:', error);
        throw error;
      }
    },
    enabled: !!client, // Only run query when client is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get all projects
 * Returns React Query result with projects data, loading states, and error handling
 * 
 * @returns UseQueryResult containing projects array and total count
 */
export const useProjects = (): UseQueryResult<{ projects: ProjectData[]; total: number }> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('🚀 useProjects query executing, client:', client ? 'available' : 'not available');
      
      // Handle client unavailability
      if (!client) {
        console.log('⏳ GraphQL client not available');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Making GraphQL request to fetch all projects');
        
        // Make GraphQL request with proper typing
        const data = await makeGraphQLRequest<ProjectsResponse>(
          client, 
          GET_PROJECTS_QUERY
        );
        
        console.log('✅ GraphQL request successful, projects count:', data.projects?.length || 0);
        
        return {
          projects: data.projects || [],
          total: data.projects_aggregate?.aggregate?.count || 0
        };
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        throw error;
      }
    },
    enabled: !!client, // Only run query when client is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get combined client and project options for dropdown/select components
 * Returns React Query result with formatted options for display
 * 
 * @returns UseQueryResult containing formatted client/project options
 */
export const useClientProjectOptions = (): UseQueryResult<{ options: ClientProjectOption[]; total: number }> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['client-project-options'],
    queryFn: async () => {
      console.log('🚀 useClientProjectOptions query executing, client:', client ? 'available' : 'not available');
      
      // Handle client unavailability
      if (!client) {
        console.log('⏳ GraphQL client not available');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Making GraphQL request to fetch projects with clients');
        
        // Make GraphQL request with proper typing
        const data = await makeGraphQLRequest<{
          projects: ProjectData[];
          clients: ClientData[];
          projects_aggregate: { aggregate: { count: number }};
        }>(
          client, 
          GET_PROJECTS_WITH_CLIENTS_QUERY
        );
        
        console.log('✅ GraphQL request successful, projects count:', data.projects?.length || 0);
        console.log('✅ GraphQL request successful, clients count:', data.clients?.length || 0);
        
        // Create a map of clients for quick lookup
        const clientsMap = new Map<string, string>();
        if (data.clients) {
          data.clients.forEach(clientData => {
            clientsMap.set(clientData.client_id, clientData.name);
          });
        }
        
        // Format data for dropdown/select components
        const options: ClientProjectOption[] = [];
        
        // Add projects with client information
        if (data.projects) {
          data.projects.forEach(project => {
            const clientName = project.client_id ? clientsMap.get(project.client_id) : undefined;
            options.push({
              id: project.project_id,
              name: clientName 
                ? `${clientName} - ${project.name}`
                : project.name,
              type: 'project',
              client_name: clientName
            });
          });
        }
        
        console.log('✅ Formatted options count:', options.length);
        
        return {
          options,
          total: data.projects_aggregate?.aggregate?.count || 0
        };
      } catch (error) {
        console.error('❌ Error fetching client/project options:', error);
        throw error;
      }
    },
    enabled: !!client, // Only run query when client is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}; 