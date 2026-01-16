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
}

/**
 * Time entry interface matching database schema
 */
export interface TimeEntry {
  time_entry_id?: string;
  user_id: string;
  entry_date: string;
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
  ) {
    insert_time_entries_one(
      object: {
        user_id: $user_id
        entry_date: $entry_date
      }
    ) {
      time_entry_id
      entry_date
      user_id
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
        notes
      }
    }
  }
`;

/**
 * Query to get time entries for a user and date range
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
      created_at
      time_entry_projects {
        tep_id
        project_id
        hours_reported
        is_mps
        notes
        project {
          project_id
          name
          client {
            name
          }
        }
      }
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
      created_at
      updated_at
      time_entry_projects {
        tep_id
        project_id
        hours_reported
        is_mps
        notes
        project {
          project_id
          name
          client {
            name
          }
        }
      }
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
          },
        );

      const createdTimeEntry = timeEntryResponse.insert_time_entries_one;

      // Step 2: Create the associated projects
      const projects = timeEntry.projects.map((project) => ({
        time_entry_id: createdTimeEntry.time_entry_id,
        project_id: project.project_id,
        hours_reported: project.hours_reported,
        is_mps: project.is_mps,
        notes: project.notes || null,
      }));

      await graphqlClient.request(CREATE_TIME_ENTRY_PROJECTS_MUTATION, {
        projects,
      });

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
 * Hook to fetch time entries for a user within a date range
 *
 * @returns Function to fetch time entries
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
        const response: any = await graphqlClient.request(
          GET_TIME_ENTRIES_QUERY,
          params,
        );

        return response.time_entries;
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

      return response.time_entries_by_pk;
    } catch (error) {
      console.error("Error fetching time entry:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch time entry",
      );
    }
  });
};
