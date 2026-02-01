/**
 * Reports GraphQL Hooks for Qwik
 *
 * Custom hooks to fetch and aggregate data for reports.
 */

import { useResource$ } from "@builder.io/qwik";
import { graphqlClient } from "../client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ReportFilter {
  startDate: string;
  endDate: string;
  userId?: string | null;
  projectId?: string | null;
}

export interface ReportTimeEntry {
  id: string;
  employeeName: string;
  date: string;
  role: string;
  projects: Array<{
    id: string;
    clientName: string;
    projectName: string;
    hours: number;
    isMPS: boolean;
    notes?: string;
  }>;
  totalHours: number;
  isPTO: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSummary {
  totalHours: number;
  billableHours: number; // Assuming non-MPS or some rule? Or purely based on hours?
  // Usually MPS = Managed Professional Services (Billable?) Let's assume all hours are billable unless stated otherwise or maybe is_mps distinguishes it.
  // For now, I'll count all hours as total. Billable logic might need clarification, but I will assume ALL project hours are billable for now, or maybe only is_mps?
  // Let's assume totalHours = sum of all hours.
  // Billable logic -> usually related to is_mps? Or maybe is_pto are non-billable.
  // I will treat PTO as non-billable (0 hours in projects usually, but 8h in daily total?)
  // Actually, PTO entries usually have no projects.

  activeProjects: number;
  avgDaily: number;
}

export interface ProjectBreakdown {
  projectCode: string;
  projectName: string;
  totalHours: number;
  percentage: number;
  status: string; // 'active' | 'completed'
}

export interface ReportData {
  summary: ReportSummary;
  projectBreakdown: ProjectBreakdown[];
  timeEntries: ReportTimeEntry[];
  loading: boolean;
}

// ============================================================================
// QUERIES - Independent queries for each table
// ============================================================================

const GET_TIME_ENTRIES_QUERY = `
  query GetTimeEntries($where: time_entries_bool_exp!) {
    time_entries(where: $where, order_by: {entry_date: desc}) {
      time_entry_id
      entry_date
      created_at
      updated_at
      user_id
      is_pto
    }
  }
`;

const GET_ALL_USERS_QUERY = `
  query GetAllUsers {
    users {
      user_id
      first_name
      last_name
      role_id
    }
  }
`;

const GET_ALL_ROLES_QUERY = `
  query GetAllRoles {
    roles {
      role_id
      role_name
      description
    }
  }
`;

const GET_TIME_ENTRY_PROJECTS_QUERY = `
  query GetTimeEntryProjects($time_entry_ids: [uuid!]!) {
    time_entry_projects(where: {time_entry_id: {_in: $time_entry_ids}}) {
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

const GET_PROJECTS_QUERY = `
  query GetProjects($project_ids: [uuid!]!) {
    projects(where: {project_id: {_in: $project_ids}}) {
      project_id
      name
      description
      start_date
      end_date
      client_id
    }
  }
`;

const GET_CLIENTS_QUERY = `
  query GetClients($client_ids: [uuid!]!) {
    clients(where: {client_id: {_in: $client_ids}}) {
      client_id
      name
    }
  }
`;

// ============================================================================
// HELPER FUNCTIONS - Functions to join and process data
// ============================================================================

/**
 * Fetch all required data from independent table queries
 */
async function fetchReportData(filter: ReportFilter) {
  // 1. Build where clause for time entries
  const whereClause: any = {
    entry_date: { _gte: filter.startDate, _lte: filter.endDate },
  };

  if (filter.userId && filter.userId !== "all") {
    whereClause.user_id = { _eq: filter.userId };
  }

  // 2. Fetch time entries first
  const timeEntriesData = await graphqlClient.request<{
    time_entries: any[];
  }>(GET_TIME_ENTRIES_QUERY, { where: whereClause });

  const timeEntries = timeEntriesData.time_entries || [];

  if (timeEntries.length === 0) {
    return {
      timeEntries: [],
      users: [],
      roles: [],
      timeEntryProjects: [],
      projects: [],
      clients: [],
    };
  }

  const timeEntryIds = timeEntries.map((te) => te.time_entry_id);

  // 3. Fetch all related data in parallel
  const [usersData, rolesData, tepData] = await Promise.all([
    graphqlClient.request<{ users: any[] }>(GET_ALL_USERS_QUERY),
    graphqlClient.request<{ roles: any[] }>(GET_ALL_ROLES_QUERY),
    graphqlClient.request<{ time_entry_projects: any[] }>(
      GET_TIME_ENTRY_PROJECTS_QUERY,
      { time_entry_ids: timeEntryIds },
    ),
  ]);

  const users = usersData.users || [];
  const roles = rolesData.roles || [];
  const timeEntryProjects = tepData.time_entry_projects || [];

  // 4. Get unique project and client IDs
  const projectIds = [
    ...new Set(timeEntryProjects.map((tep) => tep.project_id)),
  ];

  if (projectIds.length === 0) {
    return {
      timeEntries,
      users,
      roles,
      timeEntryProjects,
      projects: [],
      clients: [],
    };
  }

  // 5. Fetch projects
  const projectsData = await graphqlClient.request<{ projects: any[] }>(
    GET_PROJECTS_QUERY,
    { project_ids: projectIds },
  );

  const projects = projectsData.projects || [];

  // 6. Get unique client IDs and fetch clients
  const clientIds = [
    ...new Set(
      projects.map((p) => p.client_id).filter((id): id is string => id != null),
    ),
  ];

  let clients: any[] = [];
  if (clientIds.length > 0) {
    const clientsData = await graphqlClient.request<{ clients: any[] }>(
      GET_CLIENTS_QUERY,
      { client_ids: clientIds },
    );
    clients = clientsData.clients || [];
  }

  return {
    timeEntries,
    users,
    roles,
    timeEntryProjects,
    projects,
    clients,
  };
}

/**
 * Create lookup maps for efficient data joining
 */
function createLookupMaps(rawData: {
  users: any[];
  roles: any[];
  projects: any[];
  clients: any[];
}) {
  const roleMap = new Map(rawData.roles.map((r) => [r.role_id, r]));

  const clientMap = new Map(rawData.clients.map((c) => [c.client_id, c]));

  const projectMap = new Map(
    rawData.projects.map((p) => [
      p.project_id,
      {
        ...p,
        client: clientMap.get(p.client_id),
      },
    ]),
  );

  const userMap = new Map(
    rawData.users.map((u) => [
      u.user_id,
      {
        ...u,
        role: roleMap.get(u.role_id),
      },
    ]),
  );

  return { userMap, projectMap, roleMap, clientMap };
}

/**
 * Join time entry projects with project and client data
 */
function enrichTimeEntryProjects(
  timeEntryProjects: any[],
  projectMap: Map<string, any>,
) {
  return timeEntryProjects.map((tep) => ({
    ...tep,
    project: projectMap.get(tep.project_id) || null,
  }));
}

/**
 * Build the final report data structure
 */
function buildReportData(
  timeEntries: any[],
  enrichedTeps: any[],
  userMap: Map<string, any>,
  filter: ReportFilter,
): Omit<ReportData, "loading"> {
  // Filter TEPs by project if needed
  let filteredTeps = enrichedTeps;
  if (filter.projectId && filter.projectId !== "all") {
    filteredTeps = enrichedTeps.filter(
      (tep) => tep.project_id === filter.projectId,
    );
  }

  // Create map of time_entry_id to projects
  const tepMap = new Map<string, any[]>();
  filteredTeps.forEach((tep) => {
    if (!tepMap.has(tep.time_entry_id)) {
      tepMap.set(tep.time_entry_id, []);
    }
    tepMap.get(tep.time_entry_id)?.push(tep);
  });

  // Filter time entries if filtering by project
  const relevantTimeEntries =
    filter.projectId && filter.projectId !== "all"
      ? timeEntries.filter((te) => tepMap.has(te.time_entry_id))
      : timeEntries;

  // Process time entries
  const reportTimeEntries: ReportTimeEntry[] = [];
  let grandTotalHours = 0;
  let grandBillableHours = 0;

  const projectStats = new Map<
    string,
    { name: string; hours: number; status: string }
  >();

  for (const entry of relevantTimeEntries) {
    const entryProjects = tepMap.get(entry.time_entry_id) || [];

    let entryTotalHours = 0;
    const mappedProjects = entryProjects.map((tep) => {
      const hours = parseFloat(tep.hours_reported) || 0;
      entryTotalHours += hours;

      // Aggregate project stats
      const projectId = tep.project_id;
      if (!projectStats.has(projectId)) {
        let status = "active";
        if (tep.project?.end_date) {
          const endDate = new Date(tep.project.end_date);
          if (endDate < new Date()) status = "completed";
        }

        projectStats.set(projectId, {
          name: tep.project?.name || "Unknown Project",
          hours: 0,
          status,
        });
      }
      projectStats.get(projectId)!.hours += hours;

      return {
        id: tep.project_id,
        clientName: tep.project?.client?.name || "N/A",
        projectName: tep.project?.name || "Unknown Project",
        hours,
        isMPS: tep.is_mps,
        notes: tep.notes || "",
      };
    });

    grandTotalHours += entryTotalHours;
    grandBillableHours += entryTotalHours;

    const user = userMap.get(entry.user_id);

    reportTimeEntries.push({
      id: entry.time_entry_id,
      employeeName: user
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : "Unknown User",
      date: entry.entry_date,
      role: user?.role?.role_name || "N/A",
      projects: mappedProjects,
      totalHours: entryTotalHours,
      isPTO: entry.is_pto || false,
      createdAt: entry.created_at || new Date().toISOString(),
      updatedAt:
        entry.updated_at || entry.created_at || new Date().toISOString(),
    });
  }

  // Calculate summary
  const totalDays = new Set(relevantTimeEntries.map((e) => e.entry_date)).size;
  const avgDaily = totalDays > 0 ? grandTotalHours / totalDays : 0;

  // Calculate breakdown
  const breakdown: ProjectBreakdown[] = Array.from(projectStats.entries())
    .map(([code, stats]) => ({
      projectCode: code,
      projectName: stats.name,
      totalHours: stats.hours,
      percentage:
        grandTotalHours > 0 ? (stats.hours / grandTotalHours) * 100 : 0,
      status: stats.status,
    }))
    .sort((a, b) => b.totalHours - a.totalHours);

  return {
    summary: {
      totalHours: parseFloat(grandTotalHours.toFixed(1)),
      billableHours: parseFloat(grandBillableHours.toFixed(1)),
      activeProjects: projectStats.size,
      avgDaily: parseFloat(avgDaily.toFixed(1)),
    },
    projectBreakdown: breakdown,
    timeEntries: reportTimeEntries,
  };
}

// ============================================================================
// HOOK
// ============================================================================

export const useReportsData = (filterSignal: { value: ReportFilter }) => {
  return useResource$<ReportData>(async ({ track, cleanup }) => {
    // Track filter changes to re-run
    const filter = track(() => filterSignal.value);

    // Abort controller for cleanup
    const controller = new AbortController();
    cleanup(() => controller.abort());

    // Initialize Default State
    const defaultState: ReportData = {
      summary: {
        totalHours: 0,
        billableHours: 0,
        activeProjects: 0,
        avgDaily: 0,
      },
      projectBreakdown: [],
      timeEntries: [],
      loading: true,
    };

    try {
      // 1. Fetch all data from independent queries
      const rawData = await fetchReportData(filter);

      // Early return if no time entries
      if (rawData.timeEntries.length === 0) {
        return { ...defaultState, loading: false };
      }

      // 2. Create lookup maps for efficient joining
      const maps = createLookupMaps({
        users: rawData.users,
        roles: rawData.roles,
        projects: rawData.projects,
        clients: rawData.clients,
      });

      // 3. Enrich time entry projects with full project and client data
      const enrichedTeps = enrichTimeEntryProjects(
        rawData.timeEntryProjects,
        maps.projectMap,
      );

      // 4. Build final report structure
      const reportData = buildReportData(
        rawData.timeEntries,
        enrichedTeps,
        maps.userMap,
        filter,
      );

      return {
        ...reportData,
        loading: false,
      };
    } catch (error) {
      console.error("Error fetching report data:", error);
      return { ...defaultState, loading: false };
    }
  });
};
