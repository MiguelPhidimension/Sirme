/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  component$,
  useSignal,
  $,
  useComputed$,
  Resource,
  useResource$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard, ReportHeader, ReportFilters } from "~/components/molecules";
import {
  ProjectBreakdownTable,
  RecentEntriesList,
} from "~/components/organisms";
import type { EmployeeRole } from "~/types";
import { useReportsData, type ReportFilter } from "~/graphql/hooks/useReports";
import { DateUtils } from "~/utils";
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

  // Fetch filter options (Employees & Projects)
  const filterOptionsResource = useResource$(async () => {
    try {
      const data = await graphqlClient.request<{
        users: any[];
        projects: any[];
      }>(`
            query GetOptions {
                users(order_by: {first_name: asc}) { user_id first_name last_name }
                projects(order_by: {name: asc}) { project_id name }
            }
        `);
      return {
        employees: data.users.map((u) => ({
          value: u.user_id,
          label: `${u.first_name} ${u.last_name}`,
        })),
        projects: data.projects.map((p) => ({
          value: p.project_id,
          label: p.name,
        })),
      };
    } catch (e) {
      console.error("Failed to load filter options", e);
      return { employees: [], projects: [] };
    }
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

  const reportsResource = useReportsData(filter);

  // Handler functions
  const handleExportPDF = $(async () => {
    isLoading.value = true;
    try {
      console.log("Exporting PDF report...");
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
    isLoading.value = true;
    try {
      console.log("Exporting CSV report...");
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual CSV export
      alert("CSV export would download here");
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      isLoading.value = false;
    }
  });

  const handlePrintReport = $(() => {
    window.print();
  });

  const handleViewEntry = $((id: string) => {
    console.log("View entry:", id);
  });

  return (
    <div class="min-h-full p-6">
      {/* Page header */}
      <ReportHeader
        isLoading={isLoading.value}
        onPrint$={handlePrintReport}
        onExportPDF$={handleExportPDF}
        onExportCSV$={handleExportCSV}
      />

      {/* Main content */}
      <div class="mx-auto max-w-7xl space-y-6">
        {/* Filters */}
        <Resource
          value={filterOptionsResource}
          onPending={() => (
            <ReportFilters
              startDate={startDate}
              endDate={endDate}
              selectedEmployee={selectedEmployee}
              selectedProject={selectedProject}
              employeeOptions={[]}
              projectOptions={[]}
            />
          )}
          onRejected={() => (
            <ReportFilters
              startDate={startDate}
              endDate={endDate}
              selectedEmployee={selectedEmployee}
              selectedProject={selectedProject}
              employeeOptions={[]}
              projectOptions={[]}
            />
          )}
          onResolved={(options) => (
            <ReportFilters
              startDate={startDate}
              endDate={endDate}
              selectedEmployee={selectedEmployee}
              selectedProject={selectedProject}
              employeeOptions={options.employees}
              projectOptions={options.projects}
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
          onResolved={(reportData) => (
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
              <ProjectBreakdownTable projects={reportData.projectBreakdown} />

              {/* Recent Entries - Ensure types match */}
              <RecentEntriesList
                entries={reportData.timeEntries.map((e) => ({
                  ...e,
                  role: e.role as EmployeeRole, // Cast string to union type
                  // Projects already mapped?
                  projects: e.projects.map((p) => ({
                    ...p,
                    notes: p.notes || "",
                  })),
                }))}
                onViewEntry$={handleViewEntry}
              />
            </>
          )}
        />
      </div>
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
