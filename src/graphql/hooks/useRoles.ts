/**
 * Role GraphQL Hooks for React
 * 
 * Custom hooks for role data operations using graphql-request with React Query.
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
 * Role interface matching the actual database schema
 * Fields match exactly with database column names
 */
export interface RoleData {
  role_id: string;      // UUID field as string
  role_name: string;    // Required role name
  description?: string; // Optional description field
}

/**
 * Response type for roles query with aggregate data
 */
export interface RolesResponse {
  roles: RoleData[];
  roles_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

/**
 * Filter options for role queries
 */
export interface RoleFilters {
  search?: string;
  role_name?: string;
}

// ============================================================================
// GRAPHQL QUERIES - Match Actual Schema
// ============================================================================

/**
 * Query to get all roles with aggregate count
 * Fields match exactly with database schema
 */
const GET_ROLES_QUERY = `
  query GetRoles {
    roles {
      role_id
      role_name
      description
    }
    roles_aggregate {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Query to get a single role by role_id
 * Uses the correct primary key field name
 */
const GET_ROLE_BY_ID_QUERY = `
  query GetRoleById($role_id: uuid!) {
    roles_by_pk(role_id: $role_id) {
      role_id
      role_name
      description
    }
  }
`;

/**
 * Query to search roles with filters
 * Supports search and ordering
 */
const SEARCH_ROLES_QUERY = `
  query SearchRoles($where: roles_bool_exp, $limit: Int, $offset: Int, $order_by: [roles_order_by!]) {
    roles(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
      role_id
      role_name
      description
    }
    roles_aggregate(where: $where) {
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
 * Primary hook to get all roles
 * Returns React Query result with roles data, loading states, and error handling
 * 
 * @returns UseQueryResult containing roles array and total count
 * 
 * @example
 * const { data, isLoading, error } = useRoles();
 * 
 * if (isLoading) return <div>Loading roles...</div>;
 * if (error) return <div>Error loading roles</div>;
 * 
 * return (
 *   <div>
 *     {data?.roles.map((role) => (
 *       <div key={role.role_id}>{role.role_name}</div>
 *     ))}
 *   </div>
 * );
 */
export const useRoles = (): UseQueryResult<{ roles: RoleData[]; total: number }> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      console.log('🚀 useRoles query executing, client:', client ? 'available' : 'not available');
      
      // Handle client unavailability
      if (!client) {
        console.log('⏳ GraphQL client not available');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Making GraphQL request to fetch all roles');
        
        // Make GraphQL request with proper typing
        const data = await makeGraphQLRequest<RolesResponse>(
          client, 
          GET_ROLES_QUERY
        );
        
        console.log('✅ GraphQL request successful, roles count:', data.roles?.length || 0);
        
        return {
          roles: data.roles || [],
          total: data.roles_aggregate?.aggregate?.count || 0
        };
      } catch (error) {
        console.error('❌ Error fetching roles:', error);
        throw error;
      }
    },
    enabled: !!client, // Only run query when client is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get a single role by ID
 * Returns React Query result with role data and proper error handling
 * 
 * @param roleId - The role ID to fetch
 * @returns UseQueryResult containing single role data or null
 */
export const useRole = (roleId: string | null): UseQueryResult<RoleData | null> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: async () => {
      // Return null if no ID provided
      if (!roleId) return null;
      
      // Handle client unavailability
      if (!client) {
        console.log('⏳ GraphQL client not available for role fetch');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Fetching role by ID:', roleId);
        
        const data = await makeGraphQLRequest<{ roles_by_pk: RoleData | null }>(
          client,
          GET_ROLE_BY_ID_QUERY,
          { role_id: roleId }
        );
        
        console.log('✅ Role fetch successful:', data.roles_by_pk ? 'found' : 'not found');
        
        return data.roles_by_pk;
      } catch (error) {
        console.error('❌ Error fetching role:', error);
        throw error;
      }
    },
    enabled: !!client && !!roleId, // Only run when client and ID are available
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to search and filter roles
 * Returns React Query result with filtered roles data
 * 
 * @param filters - Filter options for role search
 * @param pagination - Pagination settings
 * @returns UseQueryResult with filtered roles and total count
 */
export const useRolesWithFilters = (
  filters: RoleFilters,
  pagination: { limit: number; offset: number }
): UseQueryResult<{ roles: RoleData[]; total: number }> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['roles', 'filtered', filters, pagination],
    queryFn: async () => {
      if (!client) {
        console.log('⏳ GraphQL client not available for filtered roles');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Fetching filtered roles with filters:', filters);
        
        // Build where clause based on filters
        const where: any = {};
        if (filters.search) {
          where._or = [
            { role_name: { _ilike: `%${filters.search}%` } },
            { description: { _ilike: `%${filters.search}%` } }
          ];
        }
        if (filters.role_name) {
          where.role_name = { _eq: filters.role_name };
        }
        
        const variables = {
          where: Object.keys(where).length > 0 ? where : undefined,
          limit: pagination.limit,
          offset: pagination.offset,
          order_by: [{ role_name: 'asc' }]
        };
        
        const data = await makeGraphQLRequest<RolesResponse>(
          client,
          SEARCH_ROLES_QUERY,
          variables
        );
        
        console.log('✅ Filtered roles fetch successful, count:', data.roles?.length || 0);
        
        return {
          roles: data.roles || [],
          total: data.roles_aggregate?.aggregate?.count || 0
        };
      } catch (error) {
        console.error('❌ Error fetching filtered roles:', error);
        throw error;
      }
    },
    enabled: !!client,
    staleTime: 2 * 60 * 1000, // 2 minutes for filtered results
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to search roles by term
 * Returns React Query result with search results
 * 
 * @param searchTerm - Search term to filter roles
 * @returns UseQueryResult with matching roles
 */
export const useRoleSearch = (searchTerm: string): UseQueryResult<RoleData[]> => {
  const { client } = useGraphQLClient();
  
  return useQuery({
    queryKey: ['roles', 'search', searchTerm],
    queryFn: async () => {
      if (!client) {
        console.log('⏳ GraphQL client not available for role search');
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        console.log('📝 Searching roles with term:', searchTerm);
        
        const where = searchTerm ? {
          _or: [
            { role_name: { _ilike: `%${searchTerm}%` } },
            { description: { _ilike: `%${searchTerm}%` } }
          ]
        } : undefined;
        
        const variables = {
          where,
          limit: 20, // Reasonable limit for search results
          order_by: [{ role_name: 'asc' }]
        };
        
        const data = await makeGraphQLRequest<RolesResponse>(
          client,
          SEARCH_ROLES_QUERY,
          variables
        );
        
        console.log('✅ Role search successful, results:', data.roles?.length || 0);
        
        return data.roles || [];
      } catch (error) {
        console.error('❌ Error searching roles:', error);
        throw error;
      }
    },
    enabled: !!client && searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    refetchOnWindowFocus: false,
  });
}; 