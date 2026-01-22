/**
 * Projects and Clients GraphQL Hooks for Qwik
 *
 * Custom hooks for project and client data operations using graphql-request with Qwik.
 * Integrates with Qwik's reactivity system using useResource$ for SSR compatibility.
 *
 * Features:
 * - Reactive data fetching with useResource$
 * - Error handling and loading states
 * - Simple and lightweight following GraphQL rules
 * - Matches actual database schema exactly
 */

import { useResource$, $ } from "@builder.io/qwik";
import {
  useGraphQLClient,
  makeGraphQLRequest,
} from "../../components/providers/GraphQLProvider";
import { graphqlClient } from "../client";

// ============================================================================
// TYPE DEFINITIONS - Match Database Schema Exactly
// ============================================================================

/**
 * Client interface matching the actual database schema
 * Fields match exactly with database column names
 */
export interface ClientData {
  client_id: string; // UUID field as string
  name: string; // Required client name
}

/**
 * Project interface matching the actual database schema
 * Fields match exactly with database column names
 */
export interface ProjectData {
  project_id: string; // UUID field as string
  name: string; // Required project name
  client_id?: string; // Optional client reference
  description?: string; // Optional project description
  start_date?: string; // Optional start date
  end_date?: string; // Optional end date
  created_at: string; // Creation timestamp
  updated_at: string; // Update timestamp
  client?: {
    // Nested client data
    client_id: string;
    name: string;
  };
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
  type: "client" | "project";
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
 * Note: client relation removed as it's not configured in Hasura
 */
const GET_PROJECTS_QUERY = `
  query GetProjects {
    projects(order_by: {created_at: desc}) {
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

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Mutation to create a new project with all fields
 */
const CREATE_PROJECT_MUTATION = `
  mutation CreateProject(
    $name: String!
    $client_id: uuid
    $description: String
    $start_date: date
    $end_date: date
  ) {
    insert_projects_one(object: {
      name: $name
      client_id: $client_id
      description: $description
      start_date: $start_date
      end_date: $end_date
    }) {
      project_id
      name
      client_id
      description
      start_date
      end_date
      created_at
      updated_at
    }
  }
`;

// ============================================================================
// QUERY HOOKS - Following GraphQL Rules Pattern
// ============================================================================

/**
 * Hook to get all clients
 * Returns reactive clients data using useResource$ for SSR compatibility
 *
 * @returns Resource containing clients array and total count
 */
export const useClients = () => {
  const { client } = useGraphQLClient();

  console.log(
    "🔧 useClients hook called, client:",
    client ? "available" : "not available",
  );

  return useResource$<{ clients: ClientData[]; total: number }>(
    async ({ track }) => {
      // Track the GraphQL client to make resource reactive to client changes
      const currentClient = track(() => client);

      console.log(
        "🚀 useClients resource executing, client:",
        currentClient ? "available" : "not available",
      );

      // Handle client unavailability gracefully with loading state
      if (!currentClient) {
        console.log("⏳ Waiting for GraphQL client to be initialized...");
        return { clients: [], total: 0 };
      }

      try {
        console.log("📝 Making GraphQL request to fetch all clients");

        // Make GraphQL request with proper typing
        const data = await makeGraphQLRequest<ClientsResponse>(
          currentClient,
          GET_CLIENTS_QUERY,
        );

        console.log(
          "✅ GraphQL request successful, clients count:",
          data.clients?.length || 0,
        );

        return {
          clients: data.clients || [],
          total: data.clients_aggregate?.aggregate?.count || 0,
        };
      } catch (error) {
        console.error("❌ Error fetching clients:", error);
        throw error;
      }
    },
  );
};

/**
 * Hook to get all projects
 * Returns reactive projects data using useResource$ for SSR compatibility
 *
 * @returns Resource containing projects array and total count
 */
export const useProjects = (trackSignal?: any) => {
  console.log("🔧 useProjects hook called");

  return useResource$<{ projects: ProjectData[]; total: number }>(async (ctx) => {
    if (trackSignal) {
        ctx.track(trackSignal);
    }
    console.log("🚀 useProjects resource executing with direct graphqlClient");

    try {
      console.log("📝 Making GraphQL request to fetch all projects");

      // Make direct GraphQL request
      const data =
        await graphqlClient.request<ProjectsResponse>(GET_PROJECTS_QUERY);

      console.log(
        "✅ GraphQL request successful, projects count:",
        data.projects?.length || 0,
      );
      console.log("📋 Projects data:", JSON.stringify(data.projects, null, 2));

      return {
        projects: data.projects || [],
        total: data.projects_aggregate?.aggregate?.count || 0,
      };
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      throw error;
    }
  });
};

/**
 * Hook to get combined clients and projects for dropdown
 * Returns a unified list suitable for client/project selection
 *
 * @returns Resource containing combined client/project options
 */
export const useClientProjectOptions = () => {
  const { client } = useGraphQLClient();

  console.log(
    "🔧 useClientProjectOptions hook called, client:",
    client ? "available" : "not available",
  );

  return useResource$<{ options: ClientProjectOption[]; total: number }>(
    async ({ track }) => {
      // Track the GraphQL client to make resource reactive to client changes
      const currentClient = track(() => client);

      console.log(
        "🚀 useClientProjectOptions resource executing, client:",
        currentClient ? "available" : "not available",
      );

      // Handle client unavailability gracefully with loading state
      if (!currentClient) {
        console.log("⏳ Waiting for GraphQL client to be initialized...");
        return { options: [], total: 0 };
      }

      try {
        console.log("📝 Making GraphQL request to fetch clients and projects");

        // Fetch both clients and projects in parallel for better performance
        const [clientsData, projectsData] = await Promise.all([
          makeGraphQLRequest<ClientsResponse>(currentClient, GET_CLIENTS_QUERY),
          makeGraphQLRequest<ProjectsResponse>(
            currentClient,
            GET_PROJECTS_QUERY,
          ),
        ]);

        console.log(
          "✅ GraphQL requests successful, clients:",
          clientsData.clients?.length || 0,
          "projects:",
          projectsData.projects?.length || 0,
        );

        // Combine clients and projects into a unified options array
        const options: ClientProjectOption[] = [];

        // Add clients as options
        if (clientsData.clients) {
          clientsData.clients.forEach((client) => {
            options.push({
              id: client.client_id,
              name: client.name,
              type: "client",
            });
          });
        }

        // Add projects as options
        if (projectsData.projects) {
          projectsData.projects.forEach((project) => {
            options.push({
              id: project.project_id,
              name: project.name,
              type: "project",
            });
          });
        }

        // Sort options alphabetically by name
        options.sort((a, b) => a.name.localeCompare(b.name));

        const totalCount =
          (clientsData.clients?.length || 0) +
          (projectsData.projects?.length || 0);

        return {
          options,
          total: totalCount,
        };
      } catch (error) {
        console.error("❌ Error fetching client/project options:", error);
        throw error;
      }
    },
  );
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new project
 *
 * @returns Function to create a project
 *
 * @example
 * ```tsx
 * const createProject = useCreateProject();
 *
 * await createProject({
 *   name: 'New Project',
 *   client_id: 'optional-client-uuid',
 *   description: 'Project description'
 * });
 * ```
 */
export const useCreateProject = () => {
  return $(
    async (projectData: {
      name: string;
      client_id?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      try {
        const variables = {
          name: projectData.name,
          client_id: projectData.client_id || null,
          description: projectData.description || null,
          start_date: projectData.start_date || null,
          end_date: projectData.end_date || null,
        };

        console.log("📝 Creating project with variables:", variables);

        const response: any = await graphqlClient.request(
          CREATE_PROJECT_MUTATION,
          variables,
        );

        console.log(
          "✅ Project created successfully:",
          response.insert_projects_one,
        );

        return response.insert_projects_one;
      } catch (error) {
        console.error("❌ Error creating project:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to create project",
        );
      }
    },
  );
};
