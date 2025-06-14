import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from 'graphql-request';
import type { DashboardSummary, DailyTimeEntry, TimeEntryFormData } from '~/types';

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';

// GraphQL Queries
const GET_TIME_ENTRIES_QUERY = `
  query GetTimeEntries($limit: Int, $offset: Int, $where: time_entries_bool_exp) {
    time_entries(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { entry_date: desc }
    ) {
      time_entry_id
      employee_name
      entry_date
      role
      created_at
      updated_at
      time_entry_projects {
        project_id
        client_name
        hours
        is_mps
        notes
        project {
          project_name
          client {
            client_name
          }
        }
      }
    }
    time_entries_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

const GET_DASHBOARD_SUMMARY_QUERY = `
  query GetDashboardSummary($today: date!, $weekStart: date!, $monthStart: date!) {
    today_entries: time_entries(where: { entry_date: { _eq: $today } }) {
      time_entry_projects_aggregate {
        aggregate {
          sum {
            hours
          }
        }
      }
    }
    week_entries: time_entries(where: { entry_date: { _gte: $weekStart } }) {
      time_entry_projects_aggregate {
        aggregate {
          sum {
            hours
          }
        }
      }
    }
    month_entries: time_entries(where: { entry_date: { _gte: $monthStart } }) {
      time_entry_projects_aggregate {
        aggregate {
          sum {
            hours
          }
        }
      }
    }
    recent_entries: time_entries(
      limit: 10
      order_by: { entry_date: desc }
    ) {
      time_entry_id
      employee_name
      entry_date
      role
      time_entry_projects {
        project_id
        client_name
        hours
        is_mps
        notes
        project {
          project_name
          client {
            client_name
          }
        }
      }
    }
  }
`;

const CREATE_TIME_ENTRY_MUTATION = `
  mutation CreateTimeEntry($entry: time_entries_insert_input!) {
    insert_time_entries_one(object: $entry) {
      time_entry_id
      employee_name
      entry_date
      role
      created_at
    }
  }
`;

const UPDATE_TIME_ENTRY_MUTATION = `
  mutation UpdateTimeEntry($id: uuid!, $entry: time_entries_set_input!) {
    update_time_entries_by_pk(pk_columns: { time_entry_id: $id }, _set: $entry) {
      time_entry_id
      employee_name
      entry_date
      role
      updated_at
    }
  }
`;

const DELETE_TIME_ENTRY_MUTATION = `
  mutation DeleteTimeEntry($id: uuid!) {
    delete_time_entries_by_pk(time_entry_id: $id) {
      time_entry_id
    }
  }
`;

// Type definitions for GraphQL responses
interface TimeEntryProject {
  project_id: string;
  client_name: string;
  hours: number;
  is_mps: boolean;
  notes?: string;
  project?: {
    project_name: string;
    client?: {
      client_name: string;
    };
  };
}

interface TimeEntryResponse {
  time_entry_id: string;
  employee_name: string;
  entry_date: string;
  role: string;
  created_at: string;
  updated_at: string;
  time_entry_projects: TimeEntryProject[];
}

interface DashboardSummaryResponse {
  today_entries: Array<{
    time_entry_projects_aggregate: {
      aggregate: {
        sum: {
          hours: number;
        };
      };
    };
  }>;
  week_entries: Array<{
    time_entry_projects_aggregate: {
      aggregate: {
        sum: {
          hours: number;
        };
      };
    };
  }>;
  month_entries: Array<{
    time_entry_projects_aggregate: {
      aggregate: {
        sum: {
          hours: number;
        };
      };
    };
  }>;
  recent_entries: TimeEntryResponse[];
}

interface CreateTimeEntryResponse {
  insert_time_entries_one: {
    time_entry_id: string;
    employee_name: string;
    entry_date: string;
    role: string;
    created_at: string;
  };
}

interface UpdateTimeEntryResponse {
  update_time_entries_by_pk: {
    time_entry_id: string;
    employee_name: string;
    entry_date: string;
    role: string;
    updated_at: string;
  };
}

interface DeleteTimeEntryResponse {
  delete_time_entries_by_pk: {
    time_entry_id: string;
  };
}

// Query variables interfaces
interface TimeEntriesQueryVariables {
  limit?: number;
  offset?: number;
  where?: any;
}

/**
 * Variables for dashboard summary query
 */
interface DashboardSummaryVariables {
  today: string;
  weekStart: string;
  monthStart: string;
}

/**
 * Hook to fetch time entries with pagination and filtering
 * Provides real-time data for time entry management
 * 
 * @param variables - Query variables for filtering and pagination
 * @returns Query result with time entries data
 * 
 * @example
 * const { data: timeEntries, isLoading } = useTimeEntries({ limit: 10 });
 */
export const useTimeEntries = (variables: TimeEntriesQueryVariables = {}) => {
  return useQuery({
    queryKey: ['timeEntries', variables],
    queryFn: async () => {
      const response = await request(GRAPHQL_ENDPOINT, GET_TIME_ENTRIES_QUERY, variables) as {
        time_entries: TimeEntryResponse[];
        time_entries_aggregate: {
          aggregate: {
            count: number;
          };
        };
      };
      
      // Transform response to match our types
      const timeEntries: DailyTimeEntry[] = response.time_entries?.map((entry: TimeEntryResponse) => ({
        id: entry.time_entry_id,
        employeeName: entry.employee_name,
        date: entry.entry_date,
        role: entry.role as any, // Cast to EmployeeRole
        projects: entry.time_entry_projects?.map((project: TimeEntryProject) => ({
          id: project.project_id || `temp-${Math.random()}`,
          clientName: project.client_name || project.project?.client?.client_name || 'Unknown Client',
          projectName: project.project?.project_name || 'Unknown Project',
          hours: project.hours,
          isMPS: project.is_mps,
          notes: project.notes || '',
        })) || [],
        totalHours: entry.time_entry_projects?.reduce((sum, p) => sum + (p.hours || 0), 0) || 0,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      })) || [];

      return {
        timeEntries,
        totalCount: response.time_entries_aggregate?.aggregate?.count || 0,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch dashboard summary data
 * Provides aggregated statistics for today, week, and month
 * 
 * @returns Query result with dashboard summary
 * 
 * @example
 * const { data: summary, isLoading } = useDashboardSummary();
 */
export const useDashboardSummary = () => {
  // Calculate date ranges for the query
  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of current week (Sunday)
  const monthStart = new Date();
  monthStart.setDate(1); // Start of current month

  const variables: DashboardSummaryVariables = {
    today,
    weekStart: weekStart.toISOString().split('T')[0],
    monthStart: monthStart.toISOString().split('T')[0],
  };

  return useQuery({
    queryKey: ['dashboardSummary', variables],
    queryFn: async () => {
      const response = await request(GRAPHQL_ENDPOINT, GET_DASHBOARD_SUMMARY_QUERY, variables) as DashboardSummaryResponse;
      
      // Transform the response into DashboardSummary format
      const todayHours = response.today_entries?.[0]?.time_entry_projects_aggregate?.aggregate?.sum?.hours || 0;
      const weekHours = response.week_entries?.[0]?.time_entry_projects_aggregate?.aggregate?.sum?.hours || 0;
      const monthHours = response.month_entries?.[0]?.time_entry_projects_aggregate?.aggregate?.sum?.hours || 0;
      
      // Transform recent entries to match DailyTimeEntry interface
      const recentEntries: DailyTimeEntry[] = response.recent_entries?.map((entry: TimeEntryResponse) => ({
        id: entry.time_entry_id,
        employeeName: entry.employee_name,
        date: entry.entry_date,
        role: entry.role as any, // Cast to EmployeeRole
        projects: entry.time_entry_projects?.map((project: TimeEntryProject) => ({
          id: project.project_id || `temp-${Math.random()}`,
          clientName: project.client_name || project.project?.client?.client_name || 'Unknown Client',
          projectName: project.project?.project_name || 'Unknown Project',
          hours: project.hours,
          isMPS: project.is_mps,
          notes: project.notes || '',
        })) || [],
        totalHours: entry.time_entry_projects?.reduce((sum, p) => sum + (p.hours || 0), 0) || 0,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      })) || [];

      // Calculate weekly progress (assuming 40 hours target)
      const weeklyTarget = 40;
      const weeklyProgress = Math.min((weekHours / weeklyTarget) * 100, 100);

      const summary: DashboardSummary = {
        todayHours,
        weekHours,
        monthHours,
        recentEntries,
        weeklyProgress,
      };

      return summary;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new time entry
 * Provides mutation for creating time entries with optimistic updates
 * 
 * @returns Mutation object with create function
 * 
 * @example
 * const createTimeEntry = useCreateTimeEntry();
 * await createTimeEntry.mutateAsync(timeEntryData);
 */
export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: TimeEntryFormData) => {
      // Transform form data to GraphQL format
      const timeEntryData = {
        employee_name: formData.employeeName,
        entry_date: formData.date,
        role: formData.role,
        time_entry_projects: {
          data: formData.projects.map(project => ({
            client_name: project.clientName,
            hours: project.hours,
            is_mps: project.isMPS,
            notes: project.notes,
            // Create project relationship if we have a project name
            ...(project.projectName && project.projectName !== 'Unknown Project' ? {
              project: {
                data: {
                  project_name: project.projectName,
                  client: {
                    data: {
                      client_name: project.clientName
                    },
                    on_conflict: {
                      constraint: 'clients_client_name_key',
                      update_columns: ['client_name']
                    }
                  }
                },
                on_conflict: {
                  constraint: 'projects_project_name_key',
                  update_columns: ['project_name']
                }
              }
            } : {})
          }))
        }
      };

      const response = await request(GRAPHQL_ENDPOINT, CREATE_TIME_ENTRY_MUTATION, {
        entry: timeEntryData
      }) as CreateTimeEntryResponse;
      
      return response.insert_time_entries_one;
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
};

/**
 * Hook to update an existing time entry
 * Provides mutation for updating time entries
 * 
 * @returns Mutation object with update function
 * 
 * @example
 * const updateTimeEntry = useUpdateTimeEntry();
 * await updateTimeEntry.mutateAsync({ id: 'uuid', data: updatedData });
 */
export const useUpdateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TimeEntryFormData> }) => {
      const updateData = {
        ...(data.employeeName && { employee_name: data.employeeName }),
        ...(data.date && { entry_date: data.date }),
        ...(data.role && { role: data.role }),
      };

      const response = await request(GRAPHQL_ENDPOINT, UPDATE_TIME_ENTRY_MUTATION, {
        id,
        entry: updateData
      }) as UpdateTimeEntryResponse;
      
      return response.update_time_entries_by_pk;
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
};

/**
 * Hook to delete a time entry
 * Provides mutation for deleting time entries
 * 
 * @returns Mutation object with delete function
 * 
 * @example
 * const deleteTimeEntry = useDeleteTimeEntry();
 * await deleteTimeEntry.mutateAsync('time-entry-id');
 */
export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await request(GRAPHQL_ENDPOINT, DELETE_TIME_ENTRY_MUTATION, { id }) as DeleteTimeEntryResponse;
      return response.delete_time_entries_by_pk;
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
};

/**
 * Export types for external use
 */
export type { TimeEntriesQueryVariables, DashboardSummaryVariables }; 