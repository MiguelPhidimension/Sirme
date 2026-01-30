/**
 * Time Entries GraphQL Hooks for Qwik
 *
 * Custom hooks for time entry operations using graphql-request with Qwik.
 * Handles creation and management of time entries with projects.
 *
 * Features:
 * - Create time entries with multiple projects
 * - Fetch time entries by user and date
 * - Error handling and loading states
 */

import { $ } from "@builder.io/qwik";
import { graphqlClient } from "../client";

// ============================================================================
// TYPE DEFINITIONS - Match Database Schema
// ============================================================================

/**
 * Time entry project interface matching database schema
 */
export interface TimeEntryProject {
  project_id: string;
  hours_reported: number;
  is_mps: boolean;
  notes?: string;
  role?: string;
}

/**
 * Time entry interface matching database schema
 */
export interface TimeEntry {
  time_entry_id?: string;
  user_id: string;
  entry_date: string;
  is_pto?: boolean;
  projects: TimeEntryProject[];
}

/**
 * Response from create time entry mutation
 */
export interface CreateTimeEntryResponse {
  insert_time_entries_one: {
    time_entry_id: string;
    entry_date: string;
    user_id: string;
    is_pto?: boolean;
  };
}

// ============================================================================
// GRAPHQL MUTATIONS
// ============================================================================

/**
 * Mutation to create a time entry (without projects)
 */
const CREATE_TIME_ENTRY_MUTATION = `
  mutation CreateTimeEntry(
    $user_id: uuid!
    $entry_date: date!
    $is_pto: Boolean
  ) {
    insert_time_entries_one(
      object: {
        user_id: $user_id
        entry_date: $entry_date
        is_pto: $is_pto
      }
    ) {
      time_entry_id
      entry_date
      user_id
      is_pto
    }
  }
`;

/**
 * Mutation to create time entry projects
 */
const CREATE_TIME_ENTRY_PROJECTS_MUTATION = `
  mutation CreateTimeEntryProjects(
    $projects: [time_entry_projects_insert_input!]!
  ) {
    insert_time_entry_projects(
      objects: $projects
    ) {
      affected_rows
      returning {
        tep_id
        time_entry_id
        project_id
        hours_reported
        is_mps
        role
        notes
      }
    }
  }
`;

/**
 * Query to get time entries for a user and date range
 * Note: This query doesn't include the nested time_entry_projects relation
 * We fetch them separately in useGetTimeEntries
 */
const GET_TIME_ENTRIES_QUERY = `
  query GetTimeEntries($user_id: uuid!, $start_date: date!, $end_date: date!) {
    time_entries(
      where: {
        user_id: { _eq: $user_id }
        entry_date: { _gte: $start_date, _lte: $end_date }
      }
      order_by: { entry_date: desc }
    ) {
      time_entry_id
      entry_date
      user_id
      is_pto
      created_at
      updated_at
    }
  }
`;

/**
 * Query to get time entry projects
 */
const GET_TIME_ENTRY_PROJECTS_QUERY = `
  query GetTimeEntryProjects($time_entry_ids: [uuid!]!) {
    time_entry_projects(
      where: {
        time_entry_id: { _in: $time_entry_ids }
      }
    ) {
      tep_id
      time_entry_id
      project_id
      hours_reported
      is_mps
      role
      notes
    }
  }
`;

/**
 * Query to get projects details
 */
const GET_PROJECTS_BY_IDS_QUERY = `
  query GetProjectsByIds($project_ids: [uuid!]!) {
    projects(
      where: {
        project_id: { _in: $project_ids }
      }
    ) {
      project_id
      name
      client_id
    }
  }
`;

/**
 * Query to get clients details
 */
const GET_CLIENTS_BY_IDS_QUERY = `
  query GetClientsByIds($client_ids: [uuid!]!) {
    clients(
      where: {
        client_id: { _in: $client_ids }
      }
    ) {
      client_id
      name
    }
  }
`;

/**
 * Query to get a single time entry by ID
 */
const GET_TIME_ENTRY_BY_ID_QUERY = `
  query GetTimeEntryById($time_entry_id: uuid!) {
    time_entries_by_pk(time_entry_id: $time_entry_id) {
      time_entry_id
      user_id
      entry_date
      is_pto
      created_at
      updated_at
    }
  }
`;

/**
 * Query to get user details by ID
 */
const GET_USER_BY_ID_QUERY = `
  query GetUserById($user_id: uuid!) {
    users_by_pk(user_id: $user_id) {
      first_name
      last_name
      role_id
    }
  }
`;

/**
 * Query to get role details by ID
 */
const GET_ROLE_BY_ID_QUERY = `
  query GetRoleById($role_id: uuid!) {
    roles_by_pk(role_id: $role_id) {
      role_name
    }
  }
`;

/**
 * Query to get time entry projects by time entry ID
 */
const GET_TIME_ENTRY_PROJECTS_BY_ID_QUERY = `
  query GetTimeEntryProjectsById($time_entry_id: uuid!) {
    time_entry_projects(
      where: {
        time_entry_id: { _eq: $time_entry_id }
      }
    ) {
      tep_id
      time_entry_id
      project_id
      hours_reported
      is_mps
      role
      notes
    }
  }
`;

/**
 * Mutation to delete time entry projects
 */
const DELETE_TIME_ENTRY_PROJECTS_MUTATION = `
  mutation DeleteTimeEntryProjects($time_entry_id: uuid!) {
    delete_time_entry_projects(where: {time_entry_id: {_eq: $time_entry_id}}) {
      affected_rows
    }
  }
`;

/**
 * Mutation to update time entry date and is_pto
 */
const UPDATE_TIME_ENTRY_DATE_MUTATION = `
  mutation UpdateTimeEntry($time_entry_id: uuid!, $entry_date: date!, $is_pto: Boolean) {
    update_time_entries_by_pk(
      pk_columns: {time_entry_id: $time_entry_id}, 
      _set: {entry_date: $entry_date, is_pto: $is_pto}
    ) {
      time_entry_id
      is_pto
    }
  }
`;

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to create a time entry with projects
 *
 * @returns Function to create a time entry
 *
 * @example
 * ```tsx
 * const createTimeEntry = useCreateTimeEntry();
 *
 * await createTimeEntry({
 *   user_id: userId,
 *   entry_date: '2024-01-15',
 *   projects: [
 *     { project_id: 'uuid', hours_reported: 8, is_mps: false, notes: 'Work done' }
 *   ]
 * });
 * ```
 */
export const useCreateTimeEntry = () => {
  return $(async (timeEntry: TimeEntry) => {
    try {
      // Step 1: Create the time entry
      const timeEntryResponse =
        await graphqlClient.request<CreateTimeEntryResponse>(
          CREATE_TIME_ENTRY_MUTATION,
          {
            user_id: timeEntry.user_id,
            entry_date: timeEntry.entry_date,
            is_pto: timeEntry.is_pto || false,
          },
        );

      const createdTimeEntry = timeEntryResponse.insert_time_entries_one;

      // Step 2: Create the associated projects (only if not PTO)
      if (!timeEntry.is_pto && timeEntry.projects.length > 0) {
        const projects = timeEntry.projects.map((project) => ({
          time_entry_id: createdTimeEntry.time_entry_id,
          project_id: project.project_id,
          hours_reported: project.hours_reported,
          is_mps: project.is_mps,
          notes: project.notes || null,
          role: project.role || null,
        }));

        await graphqlClient.request(CREATE_TIME_ENTRY_PROJECTS_MUTATION, {
          projects,
        });
      }

      return createdTimeEntry;
    } catch (error) {
      console.error("Error creating time entry:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create time entry",
      );
    }
  });
};

/**
 * Hook to update a time entry with projects
 *
 * @returns Function to update a time entry
 */
export const useUpdateTimeEntry = () => {
  return $(async (timeEntry: TimeEntry) => {
    try {
      if (!timeEntry.time_entry_id) {
        throw new Error("Time entry ID is required for update");
      }

      // Step 1: Update the time entry date and is_pto
      await graphqlClient.request(UPDATE_TIME_ENTRY_DATE_MUTATION, {
        time_entry_id: timeEntry.time_entry_id,
        entry_date: timeEntry.entry_date,
        is_pto: timeEntry.is_pto || false,
      });

      // Step 2: Delete existing projects
      await graphqlClient.request(DELETE_TIME_ENTRY_PROJECTS_MUTATION, {
        time_entry_id: timeEntry.time_entry_id,
      });

      // Step 3: Create the new projects (only if not PTO)
      if (!timeEntry.is_pto) {
        const projects = timeEntry.projects.map((project) => ({
          time_entry_id: timeEntry.time_entry_id,
          project_id: project.project_id,
          hours_reported: project.hours_reported,
          is_mps: project.is_mps,
          notes: project.notes || null,
          role: project.role || null,
        }));

        if (projects.length > 0) {
          await graphqlClient.request(CREATE_TIME_ENTRY_PROJECTS_MUTATION, {
            projects,
          });
        }
      }

      return { time_entry_id: timeEntry.time_entry_id };
    } catch (error) {
      console.error("Error updating time entry:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update time entry",
      );
    }
  });
};

/**
 * Hook to fetch time entries for a user within a date range
 * This fetches entries and then enriches them with project details
 *
 * @returns Function to fetch time entries with projects
 *
 * @example
 * ```tsx
 * const getTimeEntries = useGetTimeEntries();
 *
 * const entries = await getTimeEntries({
 *   user_id: userId,
 *   start_date: '2024-01-01',
 *   end_date: '2024-01-31'
 * });
 * ```
 */
export const useGetTimeEntries = () => {
  return $(
    async (params: {
      user_id: string;
      start_date: string;
      end_date: string;
    }) => {
      try {
        console.log("📝 Fetching time entries...");

        // First: Get the time entries
        const entriesResponse: any = await graphqlClient.request(
          GET_TIME_ENTRIES_QUERY,
          params,
        );

        const timeEntries = entriesResponse.time_entries || [];
        console.log(`✅ Found ${timeEntries.length} time entries`);

        if (timeEntries.length === 0) {
          return [];
        }

        // Second: Get the projects for these entries
        const timeEntryIds = timeEntries.map(
          (entry: any) => entry.time_entry_id,
        );

        console.log(
          `📝 Fetching projects for ${timeEntryIds.length} entries...`,
        );

        const projectsResponse: any = await graphqlClient.request(
          GET_TIME_ENTRY_PROJECTS_QUERY,
          {
            time_entry_ids: timeEntryIds,
          },
        );

        const allProjects = projectsResponse.time_entry_projects || [];
        console.log(`✅ Found ${allProjects.length} project entries`);

        // Get unique project IDs
        const uniqueProjectIds = [
          ...new Set(allProjects.map((p: any) => p.project_id)),
        ];

        if (uniqueProjectIds.length === 0) {
          // No projects found, return entries as is
          return timeEntries.map((entry: any) => ({
            ...entry,
            time_entry_projects: [],
          }));
        }

        // Third: Get project details
        console.log(
          `📝 Fetching details for ${uniqueProjectIds.length} projects...`,
        );

        const projectDetailsResponse: any = await graphqlClient.request(
          GET_PROJECTS_BY_IDS_QUERY,
          {
            project_ids: uniqueProjectIds,
          },
        );

        const projectsDetails = projectDetailsResponse.projects || [];
        console.log(`✅ Found ${projectsDetails.length} project details`);

        // Get unique client IDs
        const uniqueClientIds = [
          ...new Set(
            projectsDetails.map((p: any) => p.client_id).filter(Boolean),
          ),
        ];

        // Fourth: Get client details
        let clientsMap = new Map();
        if (uniqueClientIds.length > 0) {
          console.log(
            `📝 Fetching details for ${uniqueClientIds.length} clients...`,
          );

          const clientsResponse: any = await graphqlClient.request(
            GET_CLIENTS_BY_IDS_QUERY,
            {
              client_ids: uniqueClientIds,
            },
          );

          const clients = clientsResponse.clients || [];
          clientsMap = new Map(clients.map((c: any) => [c.client_id, c]));
        }

        // Create a map of project details for quick lookup
        const projectDetailsMap = new Map(
          projectsDetails.map((p: any) => [
            p.project_id,
            {
              ...p,
              client: p.client_id ? clientsMap.get(p.client_id) : null,
            },
          ]),
        );

        // Combine: Add projects to their respective time entries with details
        const enrichedEntries = timeEntries.map((entry: any) => ({
          ...entry,
          time_entry_projects: allProjects
            .filter((p: any) => p.time_entry_id === entry.time_entry_id)
            .map((p: any) => ({
              ...p,
              project: projectDetailsMap.get(p.project_id),
            })),
        }));

        return enrichedEntries;
      } catch (error) {
        console.error("Error fetching time entries:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to fetch time entries",
        );
      }
    },
  );
};

/**
 * Hook to fetch a single time entry by ID
 *
 * @returns Function to fetch a time entry
 */
export const useGetTimeEntryById = () => {
  return $(async (time_entry_id: string) => {
    try {
      const response: any = await graphqlClient.request(
        GET_TIME_ENTRY_BY_ID_QUERY,
        {
          time_entry_id,
        },
      );

      const timeEntry = response.time_entries_by_pk;
      if (!timeEntry) {
        return null;
      }

      // Get user details
      let userDetails: any = null;
      if (timeEntry.user_id) {
        try {
          const userResponse: any = await graphqlClient.request(
            GET_USER_BY_ID_QUERY,
            { user_id: timeEntry.user_id },
          );
          const rawUser = userResponse.users_by_pk;

          if (rawUser) {
            userDetails = { ...rawUser };
            // Get Role if role_id exists
            if (rawUser.role_id) {
              try {
                const roleResponse: any = await graphqlClient.request(
                  GET_ROLE_BY_ID_QUERY,
                  { role_id: rawUser.role_id },
                );
                if (roleResponse.roles_by_pk) {
                  userDetails.role = {
                    role_name: roleResponse.roles_by_pk.role_name,
                  };
                }
              } catch (roleErr) {
                console.error("Failed to fetch role details", roleErr);
              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch user details", e);
        }
      }

      // Get projects for this time entry
      const projectsResponse: any = await graphqlClient.request(
        GET_TIME_ENTRY_PROJECTS_BY_ID_QUERY,
        {
          time_entry_id,
        },
      );

      const allProjects = projectsResponse.time_entry_projects || [];

      // Get unique project IDs
      const uniqueProjectIds = [
        ...new Set(allProjects.map((p: any) => p.project_id)),
      ];

      if (uniqueProjectIds.length === 0) {
        return {
          ...timeEntry,
          user: userDetails,
          time_entry_projects: [],
        };
      }

      // Get project details
      const projectDetailsResponse: any = await graphqlClient.request(
        GET_PROJECTS_BY_IDS_QUERY,
        {
          project_ids: uniqueProjectIds,
        },
      );

      const projectsDetails = projectDetailsResponse.projects || [];

      // Get unique client IDs
      const uniqueClientIds = [
        ...new Set(
          projectsDetails.map((p: any) => p.client_id).filter(Boolean),
        ),
      ];

      // Get client details
      let clientsMap = new Map();
      if (uniqueClientIds.length > 0) {
        const clientsResponse: any = await graphqlClient.request(
          GET_CLIENTS_BY_IDS_QUERY,
          {
            client_ids: uniqueClientIds,
          },
        );

        const clients = clientsResponse.clients || [];
        clientsMap = new Map(clients.map((c: any) => [c.client_id, c]));
      }

      // Create a map of project details for quick lookup
      const projectDetailsMap = new Map(
        projectsDetails.map((p: any) => [
          p.project_id,
          {
            ...p,
            client: p.client_id ? clientsMap.get(p.client_id) : null,
          },
        ]),
      );

      // Combine projects with their details
      return {
        ...timeEntry,
        user: userDetails,
        time_entry_projects: allProjects.map((p: any) => ({
          ...p,
          project: projectDetailsMap.get(p.project_id),
        })),
      };
    } catch (error) {
      console.error("Error fetching time entry:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch time entry",
      );
    }
  });
};
