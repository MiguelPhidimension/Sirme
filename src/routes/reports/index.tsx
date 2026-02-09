/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  component$,
  useSignal,
  $,
  useComputed$,
  Resource,
  useResource$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard, ReportHeader, ReportFilters } from "~/components/molecules";
import {
  ProjectBreakdownTable,
  RecentEntriesList,
} from "~/components/organisms";
import { UserCalendarModal } from "~/components/organisms/reports/UserCalendarModal";
import { TimeEntryDetailsModal } from "~/components/organisms/reports/TimeEntryDetailsModal";
import type { UserDetailsParams } from "~/components/organisms/reports/ProjectBreakdownTable";
import type { EmployeeRole } from "~/types";
import {
  useReportsData,
  type ReportFilter,
  type ReportData,
} from "~/graphql/hooks/useReports";
import {
  DateUtils,
  exportReportToExcel,
  generateReportFilename,
} from "~/utils";
import { graphqlClient } from "~/graphql/client";

/**
 * Reports page component - Refactored with modular components
 * Displays time tracking analytics and export functionality
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);

  // Initialize with current month in GMT
  const now = new Date();
  const startDate = useSignal(DateUtils.getMonthStart());
  const endDate = useSignal(DateUtils.getMonthEnd());

  const selectedEmployee = useSignal("all");
  const selectedProject = useSignal("all");

  // Modal state
  const modalOpen = useSignal(false);
  const modalUserDetails = useSignal<UserDetailsParams | null>(null);

  // Time Entry Details Modal state
  const entryDetailsModalOpen = useSignal(false);
  const selectedEntry = useSignal<any>(null);

  // Store current report data for export
  const currentReportData = useSignal<ReportData | null>(null);
  const clientReady = useSignal(false);

  useVisibleTask$(() => {
    clientReady.value = true;
  });

  // Computed filter for fetching data
  const filter = useComputed$(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
      userId:
        selectedEmployee.value === "all" ? undefined : selectedEmployee.value,
      projectId:
        selectedProject.value === "all" ? undefined : selectedProject.value,
    } as ReportFilter;
  });

  // Separate filter for getting employee projects (without project filter)
  const employeeProjectsFilter = useComputed$(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
      userId:
        selectedEmployee.value === "all" ? undefined : selectedEmployee.value,
      projectId: undefined, // Don't filter by project here
    } as ReportFilter;
  });

  const reportsResource = useReportsData(filter);
  const employeeProjectsResource = useReportsData(employeeProjectsFilter);

  // Fetch all employees (static list)
  const employeesResource = useResource$(async ({ track }) => {
    const isClient = track(() => clientReady.value);
    try {
      if (!isClient) {
        return [];
      }

      const data = await graphqlClient.request<{ users: any[] }>(`
        query GetEmployees {
          users(order_by: {first_name: asc}) { 
            user_id 
            first_name 
            last_name 
          }
        }
      `);
      return data.users.map((u) => ({
        value: u.user_id,
        label: `${u.first_name} ${u.last_name}`,
      }));
    } catch (e) {
      console.error("Failed to load employees", e);
      return [];
    }
  });

  // Fetch all projects (for when no employee is selected)
  const allProjectsResource = useResource$(async ({ track }) => {
    const isClient = track(() => clientReady.value);
    try {
      if (!isClient) {
        return [];
      }

      const data = await graphqlClient.request<{ projects: any[] }>(`
        query GetAllProjects {
          projects(order_by: {name: asc}) { project_id name }
        }
      `);
      return data.projects.map((p) => ({
        value: p.project_id,
        label: p.name,
      }));
    } catch (e) {
      console.error("Failed to load projects", e);
      return [];
    }
  });

  // Handler functions
  const handleExportPDF = $(async () => {
    isLoading.value = true;
    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // TODO: Implement actual PDF export
      alert("PDF export would download here");
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      isLoading.value = false;
    }
  });

  const handleExportCSV = $(async () => {
    // Access the current report data from signal
    const reportData = currentReportData.value;

    // Check if data is loaded
    if (!reportData) {
      alert(
        "No hay datos para exportar. Por favor, espera a que carguen los datos.",
      );
      return;
    }

    isLoading.value = true;
    try {
      // Generate filename with date range
      const filename = generateReportFilename(startDate.value, endDate.value);

      // Export to Excel
      exportReportToExcel(reportData, startDate.value, endDate.value, filename);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert(
        "Error al exportar el reporte a Excel. Por favor, intenta de nuevo.",
      );
    } finally {
      isLoading.value = false;
    }
  });

  const handleCloseEntryDetailsModal = $(() => {
    entryDetailsModalOpen.value = false;
    selectedEntry.value = null;
  });

  const handleUserDetailsClick = $((params: UserDetailsParams) => {
    modalUserDetails.value = params;
    modalOpen.value = true;
  });

  const handleCloseModal = $(() => {
    modalOpen.value = false;
    modalUserDetails.value = null;
  });

  const handleClearFilters = $(() => {
    startDate.value = DateUtils.getMonthStart();
    endDate.value = DateUtils.getMonthEnd();
    selectedEmployee.value = "all";
    selectedProject.value = "all";
  });

  return (
    <div class="min-h-full p-6">
      {/* Page header */}
      <ReportHeader
        isLoading={isLoading.value}
        onExportCSV$={handleExportCSV}
      />

      {/* Main content */}
      <div class="mx-auto max-w-7xl space-y-6">
        {/* Filters - Always visible */}
        <Resource
          value={employeesResource}
          onPending={() => (
            <div class="no-print rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
              <div class="flex h-20 items-center justify-center">
                <div class="border-t-brand-purple h-6 w-6 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600"></div>
                <span class="ml-3 text-gray-600 dark:text-gray-400">
                  Loading filters...
                </span>
              </div>
            </div>
          )}
          onRejected={(error) => (
            <div class="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              Error loading filters: {error.message}
            </div>
          )}
          onResolved={(employees) => (
            <Resource
              value={allProjectsResource}
              onPending={() => (
                <ReportFilters
                  startDate={startDate}
                  endDate={endDate}
                  selectedEmployee={selectedEmployee}
                  selectedProject={selectedProject}
                  employeeOptions={employees}
                  projectOptions={[]}
                  onClearFilters$={handleClearFilters}
                />
              )}
              onRejected={() => (
                <ReportFilters
                  startDate={startDate}
                  endDate={endDate}
                  selectedEmployee={selectedEmployee}
                  selectedProject={selectedProject}
                  employeeOptions={employees}
                  projectOptions={[]}
                  onClearFilters$={handleClearFilters}
                />
              )}
              onResolved={(allProjects) => (
                <Resource
                  value={employeeProjectsResource}
                  onPending={() => (
                    <ReportFilters
                      startDate={startDate}
                      endDate={endDate}
                      selectedEmployee={selectedEmployee}
                      selectedProject={selectedProject}
                      employeeOptions={employees}
                      projectOptions={allProjects}
                      onClearFilters$={handleClearFilters}
                    />
                  )}
                  onRejected={() => (
                    <ReportFilters
                      startDate={startDate}
                      endDate={endDate}
                      selectedEmployee={selectedEmployee}
                      selectedProject={selectedProject}
                      employeeOptions={employees}
                      projectOptions={allProjects}
                      onClearFilters$={handleClearFilters}
                    />
                  )}
                  onResolved={(employeeProjectsData) => {
                    // Filter projects based on selected employee
                    const projectOptions =
                      selectedEmployee.value === "all"
                        ? allProjects
                        : employeeProjectsData.projectBreakdown.map((p) => ({
                            value: p.projectCode,
                            label: p.projectName,
                          }));

                    return (
                      <ReportFilters
                        startDate={startDate}
                        endDate={endDate}
                        selectedEmployee={selectedEmployee}
                        selectedProject={selectedProject}
                        employeeOptions={employees}
                        projectOptions={projectOptions}
                        onClearFilters$={handleClearFilters}
                      />
                    );
                  }}
                />
              )}
            />
          )}
        />

        <Resource
          value={reportsResource}
          onPending={() => (
            <div class="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/50 p-12 text-center text-gray-400">
              <div class="flex flex-col items-center gap-4">
                <div class="border-t-brand-purple h-8 w-8 animate-spin rounded-full border-4 border-gray-600"></div>
                <p>Loading report data...</p>
              </div>
            </div>
          )}
          onRejected={(error) => (
            <div class="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              Error loading reports: {error.message}
            </div>
          )}
          onResolved={(reportData) => {
            // Store the report data for export
            currentReportData.value = reportData;

            // When an employee is selected, the backend already filters the data
            // So we just use the returned projects directly
            const filteredProjects = reportData.projectBreakdown;

            return (
              <>
                {/* Summary Statistics */}
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Hours"
                    value={`${reportData.summary.totalHours}h`}
                    color="primary"
                    icon="clock"
                  />
                  <StatCard
                    title="Billable Hours"
                    value={`${reportData.summary.billableHours}h`}
                    color="success"
                    icon="chart"
                  />
                  <StatCard
                    title="Active Projects"
                    value={reportData.summary.activeProjects.toString()}
                    color="info"
                    icon="calendar"
                  />
                  <StatCard
                    title="Daily Average"
                    value={`${reportData.summary.avgDaily}h`}
                    color="warning"
                    icon="clock"
                  />
                </div>

                {/* Project Breakdown - Ensure mapping is correct if needed but component expects matching keys */}
                <ProjectBreakdownTable
                  projects={filteredProjects}
                  onUserDetailsClick$={handleUserDetailsClick}
                />

                {/* Recent Entries - Ensure types match */}
                {/* <RecentEntriesList
                  entries={reportData.timeEntries.map((e) => ({
                    ...e,
                    role: e.role as EmployeeRole, // Cast string to union type
                    // Projects already mapped?
                    projects: e.projects.map((p) => ({
                      ...p,
                      notes: p.notes || "",
                    })),
                  }))}
                  onViewEntry$={$((id: string) => {
                    const entry = reportData.timeEntries.find(
                      (e: any) => e.id === id,
                    );
                    if (entry) {
                      selectedEntry.value = entry;
                      entryDetailsModalOpen.value = true;
                    }
                  })}
                /> */}
              </>
            );
          }}
        />
      </div>

      {/* User Calendar Modal - Rendered at root level */}
      <Resource
        value={reportsResource}
        onResolved={(reportData) => {
          if (!modalOpen.value || !modalUserDetails.value) return null;

          // Filter time entries for selected user and project
          const userEntries = reportData.timeEntries
            .filter(
              (entry: any) =>
                entry.id &&
                entry.employeeName === modalUserDetails.value?.userName,
            )
            .flatMap((entry: any) =>
              entry.projects
                ?.filter((p: any) => p.id === modalUserDetails.value?.projectId)
                .map((p: any) => ({
                  date: entry.date,
                  hours: p.hours,
                  notes: p.notes,
                })),
            )
            .filter(Boolean);

          return (
            <UserCalendarModal
              isOpen={modalOpen.value}
              userName={modalUserDetails.value?.userName || ""}
              projectName={modalUserDetails.value?.projectName || ""}
              timeEntries={userEntries}
              onClose={handleCloseModal}
            />
          );
        }}
      />

      {/* Time Entry Details Modal - Rendered at root level */}
      {entryDetailsModalOpen.value && selectedEntry.value && (
        <TimeEntryDetailsModal
          isOpen={entryDetailsModalOpen.value}
          employeeName={selectedEntry.value.employeeName}
          date={selectedEntry.value.date}
          role={selectedEntry.value.role}
          projects={selectedEntry.value.projects}
          totalHours={selectedEntry.value.totalHours}
          onClose={handleCloseEntryDetailsModal}
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reports - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Time tracking reports and analytics with export functionality",
    },
  ],
};
