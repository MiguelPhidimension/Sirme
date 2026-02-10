/**
 * Collaborators GraphQL Hooks for Qwik
 *
 * Custom hooks to fetch and aggregate collaborator data with statistics.
 */

import { useResource$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { graphqlClient } from "../client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CollaboratorFilter {
  startDate: string;
  endDate: string;
}

export interface CollaboratorProject {
  projectId: string;
  projectName: string;
  clientName: string;
  hours: number;
  percentage: number;
}

export interface CollaboratorData {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  roleApplication: string;
  totalHours: number;
  billableHours: number;
  ptoHours: number;
  holidayHours: number;
  totalDaysWorked: number;
  avgDailyHours: number;
  projects: CollaboratorProject[];
  activeProjects: number;
}

export interface TopContributor {
  userId: string;
  fullName: string;
  totalHours: number;
  rank: number;
}

export interface CollaboratorsSummary {
  totalCollaborators: number;
  totalHours: number;
  avgHoursPerCollaborator: number;
  activeProjects: number;
  topContributors: TopContributor[];
}

export interface CollaboratorsData {
  summary: CollaboratorsSummary;
  collaborators: CollaboratorData[];
  loading: boolean;
}

// ============================================================================
// QUERIES
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
      is_holiday
    }
  }
`;

const GET_ALL_USERS_QUERY = `
  query GetAllUsers {
    users {
      user_id
      first_name
      last_name
      email
      role_id
      role_application
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
// HELPER FUNCTIONS
// ============================================================================

async function fetchCollaboratorsData(filter: CollaboratorFilter) {
  const whereClause: any = {
    entry_date: { _gte: filter.startDate, _lte: filter.endDate },
  };

  // 1. Fetch time entries
  const timeEntriesData = await graphqlClient.request<{
    time_entries: any[];
  }>(GET_TIME_ENTRIES_QUERY, { where: whereClause });

  const timeEntries = timeEntriesData.time_entries || [];

  // 2. Fetch all users and roles in parallel
  const [usersData, rolesData] = await Promise.all([
    graphqlClient.request<{ users: any[] }>(GET_ALL_USERS_QUERY),
    graphqlClient.request<{ roles: any[] }>(GET_ALL_ROLES_QUERY),
  ]);

  const users = usersData.users || [];
  const roles = rolesData.roles || [];

  if (timeEntries.length === 0) {
    return {
      timeEntries: [],
      users,
      roles,
      timeEntryProjects: [],
      projects: [],
      clients: [],
    };
  }

  const timeEntryIds = timeEntries.map((te) => te.time_entry_id);

  // 3. Fetch time entry projects
  const tepData = await graphqlClient.request<{ time_entry_projects: any[] }>(
    GET_TIME_ENTRY_PROJECTS_QUERY,
    { time_entry_ids: timeEntryIds },
  );

  const timeEntryProjects = tepData.time_entry_projects || [];

  // 4. Get unique project IDs and fetch projects
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

  const projectsData = await graphqlClient.request<{ projects: any[] }>(
    GET_PROJECTS_QUERY,
    { project_ids: projectIds },
  );

  const projects = projectsData.projects || [];

  // 5. Fetch clients
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

  return { timeEntries, users, roles, timeEntryProjects, projects, clients };
}

function buildCollaboratorsData(
  rawData: Awaited<ReturnType<typeof fetchCollaboratorsData>>,
): Omit<CollaboratorsData, "loading"> {
  const { timeEntries, users, roles, timeEntryProjects, projects, clients } =
    rawData;

  // Create lookup maps
  const roleMap = new Map(roles.map((r) => [r.role_id, r]));
  const clientMap = new Map(clients.map((c) => [c.client_id, c]));
  const projectMap = new Map(
    projects.map((p) => [
      p.project_id,
      { ...p, client: clientMap.get(p.client_id) },
    ]),
  );

  // Group time entries by user
  const userEntriesMap = new Map<string, any[]>();
  for (const entry of timeEntries) {
    if (!userEntriesMap.has(entry.user_id)) {
      userEntriesMap.set(entry.user_id, []);
    }
    userEntriesMap.get(entry.user_id)!.push(entry);
  }

  // Group TEPs by time_entry_id
  const tepByEntryMap = new Map<string, any[]>();
  for (const tep of timeEntryProjects) {
    if (!tepByEntryMap.has(tep.time_entry_id)) {
      tepByEntryMap.set(tep.time_entry_id, []);
    }
    tepByEntryMap.get(tep.time_entry_id)!.push(tep);
  }

  // Build collaborator data for each user
  const collaborators: CollaboratorData[] = [];
  let grandTotalHours = 0;

  for (const user of users) {
    const userEntries = userEntriesMap.get(user.user_id) || [];
    const role = roleMap.get(user.role_id);

    let totalHours = 0;
    let billableHours = 0;
    let ptoHours = 0;
    let holidayHours = 0;
    const datesWorked = new Set<string>();
    const projectStatsMap = new Map<
      string,
      { name: string; clientName: string; hours: number }
    >();

    for (const entry of userEntries) {
      const entryTeps = tepByEntryMap.get(entry.time_entry_id) || [];

      if (entry.is_pto) {
        ptoHours += 8; // PTO counts as 8h
      }
      if (entry.is_holiday) {
        holidayHours += 8;
      }

      for (const tep of entryTeps) {
        const hours = parseFloat(tep.hours_reported) || 0;
        totalHours += hours;
        billableHours += hours;
        datesWorked.add(entry.entry_date);

        const project = projectMap.get(tep.project_id);
        const projectId = tep.project_id;

        if (!projectStatsMap.has(projectId)) {
          projectStatsMap.set(projectId, {
            name: project?.name || "Unknown Project",
            clientName: project?.client?.name || "N/A",
            hours: 0,
          });
        }
        projectStatsMap.get(projectId)!.hours += hours;
      }
    }

    const totalDaysWorked = datesWorked.size;
    const avgDailyHours =
      totalDaysWorked > 0 ? totalHours / totalDaysWorked : 0;

    // Build project list with percentages
    const userProjects: CollaboratorProject[] = Array.from(
      projectStatsMap.entries(),
    )
      .map(([projectId, stats]) => ({
        projectId,
        projectName: stats.name,
        clientName: stats.clientName,
        hours: parseFloat(stats.hours.toFixed(1)),
        percentage:
          totalHours > 0
            ? parseFloat(((stats.hours / totalHours) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.hours - a.hours);

    grandTotalHours += totalHours;

    collaborators.push({
      userId: user.user_id,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email || "",
      role: role?.role_name || "N/A",
      roleApplication: user.role_application || "colaborador",
      totalHours: parseFloat(totalHours.toFixed(1)),
      billableHours: parseFloat(billableHours.toFixed(1)),
      ptoHours,
      holidayHours,
      totalDaysWorked,
      avgDailyHours: parseFloat(avgDailyHours.toFixed(1)),
      projects: userProjects,
      activeProjects: userProjects.length,
    });
  }

  // Sort collaborators by total hours (ascending — fewest hours first)
  collaborators.sort((a, b) => a.totalHours - b.totalHours);

  // Build top 3 contributors (most hours, from the filtered period)
  const sortedByHoursDesc = [...collaborators].sort(
    (a, b) => b.totalHours - a.totalHours,
  );
  const topContributors: TopContributor[] = sortedByHoursDesc
    .filter((c) => c.totalHours > 0)
    .slice(0, 3)
    .map((c, idx) => ({
      userId: c.userId,
      fullName: c.fullName,
      totalHours: c.totalHours,
      rank: idx + 1,
    }));

  // Build summary
  const allProjectIds = new Set(
    collaborators.flatMap((c) => c.projects.map((p) => p.projectId)),
  );

  const summary: CollaboratorsSummary = {
    totalCollaborators: collaborators.length,
    totalHours: parseFloat(grandTotalHours.toFixed(1)),
    avgHoursPerCollaborator:
      collaborators.length > 0
        ? parseFloat((grandTotalHours / collaborators.length).toFixed(1))
        : 0,
    activeProjects: allProjectIds.size,
    topContributors,
  };

  return { summary, collaborators };
}

// ============================================================================
// HOOK
// ============================================================================

export const useCollaboratorsData = (filterSignal: {
  value: CollaboratorFilter;
}) => {
  const clientReady = useSignal(false);

  useVisibleTask$(() => {
    clientReady.value = true;
  });

  return useResource$<CollaboratorsData>(async ({ track, cleanup }) => {
    const filter = track(() => filterSignal.value);
    const isClient = track(() => clientReady.value);

    const controller = new AbortController();
    cleanup(() => controller.abort());

    const defaultState: CollaboratorsData = {
      summary: {
        totalCollaborators: 0,
        totalHours: 0,
        avgHoursPerCollaborator: 0,
        activeProjects: 0,
        topContributors: [],
      },
      collaborators: [],
      loading: true,
    };

    try {
      if (!isClient) {
        return { ...defaultState, loading: true };
      }

      const rawData = await fetchCollaboratorsData(filter);
      const result = buildCollaboratorsData(rawData);

      return { ...result, loading: false };
    } catch (error) {
      console.error("Error fetching collaborators data:", error);
      return { ...defaultState, loading: false };
    }
  });
};
