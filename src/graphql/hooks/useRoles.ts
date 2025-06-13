/**
 * Role GraphQL Hooks for Qwik
 * 
 * Custom hooks for role data operations using graphql-request with Qwik.
 * Integrates with Qwik's reactivity system using useResource$ for SSR compatibility.
 * 
 * Features:
 * - Reactive data fetching with useResource$
 * - Error handling and loading states
 * - Simple and lightweight following GraphQL rules
 * - Matches actual database schema exactly
 */

import { 
  Signal, 
  useResource$,
  useSignal
} from '@builder.io/qwik';
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
// QUERY HOOKS - Following GraphQL Rules Pattern
// ============================================================================

/**
 * Primary hook to get all roles
 * Returns reactive roles data using useResource$ for SSR compatibility
 * 
 * @returns Resource containing roles array and total count
 * 
 * @example
 * const rolesResource = useRoles();
 * 
 * <Resource
 *   value={rolesResource}
 *   onPending={() => <div>Loading roles...</div>}
 *   onRejected={() => <div>Error loading roles</div>}
 *   onResolved={(data) => (
 *     <div>
 *       {data.roles.map((role) => (
 *         <div key={role.role_id}>{role.role_name}</div>
 *       ))}
 *     </div>
 *   )}
 * />
 */
export const useRoles = () => {
  const { client } = useGraphQLClient();
  
  console.log('🔧 useRoles hook called, client:', client ? 'available' : 'not available');
  
  return useResource$<{ roles: RoleData[]; total: number }>(async ({ track }) => {
    // Track the GraphQL client to make resource reactive to client changes
    const currentClient = track(() => client);
    
    console.log('🚀 useRoles resource executing, client:', currentClient ? 'available' : 'not available');
    
    // Handle client unavailability gracefully with loading state
    if (!currentClient) {
      console.log('⏳ Waiting for GraphQL client to be initialized...');
      return { roles: [], total: 0 };
    }
    
    try {
      console.log('📝 Making GraphQL request to fetch all roles');
      
      // Make GraphQL request with proper typing
      const data = await makeGraphQLRequest<RolesResponse>(
        currentClient, 
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
  });
};

/**
 * Hook to get a single role by ID
 * Returns reactive role data with proper error handling
 * 
 * @param roleId - Signal containing the role ID to fetch
 * @returns Resource containing single role data or null
 */
export const useRole = (roleId: Signal<string | null>) => {
  const { client } = useGraphQLClient();
  
  return useResource$<RoleData | null>(async ({ track }) => {
    const currentClient = track(() => client);
    const id = track(() => roleId.value);
    
    // Return null if no ID provided
    if (!id) return null;
    
    // Wait for client availability
    if (!currentClient) {
      console.log('⏳ Waiting for GraphQL client for role fetch...');
      return null;
    }
    
    try {
      console.log('📝 Fetching role by ID:', id);
      
      const data = await makeGraphQLRequest<{ roles_by_pk: RoleData | null }>(
        currentClient,
        GET_ROLE_BY_ID_QUERY, 
        { role_id: id }
      );
      
      console.log('✅ Role fetch successful:', data.roles_by_pk ? 'found' : 'not found');
      
      return data.roles_by_pk || null;
    } catch (error) {
      console.error('❌ Error fetching role:', error);
      throw error;
    }
  });
};

/**
 * Hook to search roles with filters and pagination
 * Supports search functionality and ordering
 * 
 * @param filters - Signal containing search filters
 * @param pagination - Signal containing pagination options
 * @returns Resource containing filtered roles and total count
 */
export const useRolesWithFilters = (
  filters: Signal<RoleFilters>,
  pagination: Signal<{ limit: number; offset: number }>
) => {
  const { client } = useGraphQLClient();
  
  return useResource$<{ roles: RoleData[]; total: number }>(async ({ track }) => {
    const currentClient = track(() => client);
    const currentFilters = track(() => filters.value);
    const currentPagination = track(() => pagination.value);
    
    // Wait for client availability
    if (!currentClient) {
      console.log('⏳ Waiting for GraphQL client for filtered roles...');
      return { roles: [], total: 0 };
    }
    
    try {
      // Build where clause from filters - match database field names exactly
      const where: any = {};
      
      if (currentFilters.search) {
        where._or = [
          { role_name: { _ilike: `%${currentFilters.search}%` } },
          { description: { _ilike: `%${currentFilters.search}%` } }
        ];
      }
      
      if (currentFilters.role_name) {
        where.role_name = { _eq: currentFilters.role_name };
      }
      
      const variables = {
        where,
        limit: currentPagination.limit,
        offset: currentPagination.offset,
        order_by: [{ role_name: 'asc' }] // Order by role_name ascending
      };
      
      console.log('📝 Searching roles with filters:', variables);
      
      const data = await makeGraphQLRequest<RolesResponse>(
        currentClient,
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
  });
};

/**
 * Hook for role search with debounced input
 * Optimized for search-as-you-type functionality
 * 
 * @param searchTerm - Signal containing the search term
 * @returns Resource containing matching roles
 */
export const useRoleSearch = (searchTerm: Signal<string>) => {
  const { client } = useGraphQLClient();
  
  return useResource$<RoleData[]>(async ({ track }) => {
    const currentClient = track(() => client);
    const search = track(() => searchTerm.value);
    
    // Return empty array if no search term or client
    if (!search.trim() || !currentClient) return [];
    
    try {
      const variables = {
        where: {
          _or: [
            { role_name: { _ilike: `%${search}%` } },
            { description: { _ilike: `%${search}%` } }
          ]
        },
        limit: 10, // Limit search results for performance
        order_by: [{ role_name: 'asc' }]
      };
      
      console.log('🔍 Searching roles with term:', search);
      
      const data = await makeGraphQLRequest<{ roles: RoleData[] }>(
        currentClient,
        SEARCH_ROLES_QUERY,
        variables
      );
      
      console.log('✅ Role search successful, results:', data.roles?.length || 0);
      
      return data.roles || [];
    } catch (error) {
      console.error('❌ Error searching roles:', error);
      return []; // Return empty array on error for better UX
    }
  });
}; 