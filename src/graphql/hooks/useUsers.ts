/**
 * Users GraphQL Hooks for Qwik
 *
 * Custom hooks for user data operations using graphql-request with Qwik.
 * Integrates with Qwik's reactivity system using useResource$ for SSR compatibility.
 */

import { useResource$ } from "@builder.io/qwik";
import { graphqlClient } from "../client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User interface matching the database schema
 */
export interface UserData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  created_at: string;
  updated_at?: string;
  role?: {
    role_id: string;
    role_name: string;
    description?: string;
  };
}

/**
 * Response type for users query
 */
export interface UsersResponse {
  users: UserData[];
  roles: {
    role_id: string;
    role_name: string;
    description?: string;
  }[];
  users_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

/**
 * Query to get all users and roles separately, then match by role_id
 */
const GET_USERS_QUERY = `
  query GetUsers {
    users(order_by: { first_name: asc, last_name: asc }) {
      user_id
      first_name
      last_name
      email
      role_id
      created_at
      updated_at
    }
    roles {
      role_id
      role_name
      description
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get all users
 * Returns reactive users data using useResource$ for SSR compatibility
 *
 * @returns Resource containing users array and total count
 */
export const useUsers = () => {
  return useResource$<{ users: UserData[]; total: number }>(async () => {
    try {

      const data = await graphqlClient.request<UsersResponse>(GET_USERS_QUERY);

      // Map users with their roles by matching role_id
      const usersWithRoles = data.users.map((user) => ({
        ...user,
        role: data.roles.find((role) => role.role_id === user.role_id),
      }));

     

      return {
        users: usersWithRoles || [],
        total: data.users_aggregate?.aggregate?.count || 0,
      };
    } catch (error) {
      console.error("❌ useUsers: Error fetching users:", error);
      throw error;
    }
  });
};
