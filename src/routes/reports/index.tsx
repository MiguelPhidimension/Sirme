import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard, ReportHeader, ReportFilters } from "~/components/molecules";
import {
  ProjectBreakdownTable,
  RecentEntriesList,
} from "~/components/organisms";
import type { EmployeeRole } from "~/types";

/**
 * Reports page component - Refactored with modular components
 * Displays time tracking analytics and export functionality
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const selectedPeriod = useSignal<"week" | "month" | "quarter" | "year">(
    "month",
  );
  const selectedEmployee = useSignal("all");
  const selectedProject = useSignal("all");

  // Sample reports data (would come from API in real app)
  const reportData = useStore({
    summary: {
      totalHours: 184.5,
      billableHours: 156.0,
      projects: 8,
      avgDaily: 7.4,
    },
    projectBreakdown: [
      {
        projectCode: "PROJ-001",
        projectName: "Website Development",
        totalHours: 85.5,
        percentage: 46.3,
        status: "active",
      },
      {
        projectCode: "PROJ-002",
        projectName: "Client Meetings",
        totalHours: 42.0,
        percentage: 22.8,
        status: "active",
      },
      {
        projectCode: "PROJ-003",
        projectName: "Database Design",
        totalHours: 35.0,
        percentage: 19.0,
        status: "completed",
      },
      {
        projectCode: "PROJ-004",
        projectName: "Documentation",
        totalHours: 22.0,
        percentage: 11.9,
        status: "active",
      },
    ],
    timeEntries: [
      {
        id: "1",
        employeeName: "John Doe",
        date: new Date().toISOString().split("T")[0],
        role: "MuleSoft Developer" as EmployeeRole,
        projects: [
          {
            id: "proj-r-1",
            clientName: "Acme Corp",
            hours: 6.5,
            isMPS: true,
            notes: "Frontend component development",
          },
        ],
        totalHours: 6.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  });

  // Filter options
  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  // Handler functions
  const handlePeriodChange = $(
    (period: "week" | "month" | "quarter" | "year") => {
      selectedPeriod.value = period;
      console.log("Period changed to:", period);
      // TODO: Fetch data for selected period
    },
  );

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

  const handleEditEntry = $((id: string) => {
    window.location.href = `/entry?edit=${id}`;
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
        <ReportFilters
          selectedPeriod={selectedPeriod}
          selectedEmployee={selectedEmployee}
          selectedProject={selectedProject}
          periodOptions={periodOptions}
          onPeriodChange$={handlePeriodChange}
        />

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
            value={reportData.summary.projects.toString()}
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

        {/* Project Breakdown */}
        <ProjectBreakdownTable projects={reportData.projectBreakdown} />

        {/* Recent Entries */}
        <RecentEntriesList
          entries={reportData.timeEntries}
          onViewEntry$={handleViewEntry}
          onEditEntry$={handleEditEntry}
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
