import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard } from "~/components/molecules";
import type { EmployeeRole } from "~/types";

/**
 * Reports page component
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

  return (
    <div class="min-h-full p-6">
      {/* Page header */}
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Time Tracking Reports
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Analytics and insights for your time entries
          </p>
        </div>
        <div class="no-print flex gap-2">
          <button
            class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            onClick$={handlePrintReport}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            onClick$={handleExportPDF}
            disabled={isLoading.value}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isLoading.value ? "Exporting..." : "Export PDF"}
          </button>
          <button
            class="rounded-xl border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick$={handleExportCSV}
            disabled={isLoading.value}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isLoading.value ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div class="mx-auto max-w-7xl space-y-6">
        {/* Filters */}
        <div class="no-print rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-4 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <svg
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Report Filters
            </h2>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Period selector */}
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Period
              </label>
              <select
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={selectedPeriod.value}
                onChange$={(e) => handlePeriodChange(e.target.value as any)}
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee selector */}
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee
              </label>
              <select
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={selectedEmployee.value}
                onChange$={(e) => (selectedEmployee.value = e.target.value)}
              >
                <option value="all">All Employees</option>
                <option value="emp-001">John Doe</option>
                <option value="emp-002">Jane Smith</option>
              </select>
            </div>

            {/* Project selector */}
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project
              </label>
              <select
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={selectedProject.value}
                onChange$={(e) => (selectedProject.value = e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="PROJ-001">Website Development</option>
                <option value="PROJ-002">Client Meetings</option>
                <option value="PROJ-003">Database Design</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Hours"
            value={`${reportData.summary.totalHours}h`}
            change={+12.5}
            period="vs last period"
            color="primary"
          />
          <StatCard
            title="Billable Hours"
            value={`${reportData.summary.billableHours}h`}
            change={+8.3}
            period="vs last period"
            color="success"
          />
          <StatCard
            title="Active Projects"
            value={reportData.summary.projects.toString()}
            change={+2}
            period="vs last period"
            color="info"
          />
          <StatCard
            title="Daily Average"
            value={`${reportData.summary.avgDaily}h`}
            change={-2.1}
            period="vs last period"
            color="warning"
          />
        </div>

        {/* Project Breakdown */}
        <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-6 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <svg
                class="h-5 w-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Project Breakdown
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-slate-700">
                  <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Project
                  </th>
                  <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Hours
                  </th>
                  <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Percentage
                  </th>
                  <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th class="no-print pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.projectBreakdown.map((project) => (
                  <tr
                    key={project.projectCode}
                    class="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50"
                  >
                    <td class="py-4">
                      <div>
                        <div class="font-semibold text-gray-900 dark:text-white">
                          {project.projectName}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {project.projectCode}
                        </div>
                      </div>
                    </td>
                    <td class="py-4 font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {project.totalHours}h
                    </td>
                    <td class="py-4">
                      <div class="flex items-center gap-3">
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                          <div
                            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                            style={`width: ${project.percentage}%`}
                          ></div>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {project.percentage}%
                        </span>
                      </div>
                    </td>
                    <td class="py-4">
                      <span
                        class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td class="no-print py-4">
                      <button class="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Entries */}
        <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-6 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <svg
                class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Recent Time Entries
            </h2>
          </div>
          <div class="space-y-4">
            {reportData.timeEntries.map((entry) => (
              <div
                key={entry.id}
                class="space-y-3 rounded-2xl border border-white/20 bg-gradient-to-br from-white/95 to-gray-50/95 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/20 dark:from-slate-800/95 dark:to-slate-700/95"
              >
                {/* Entry Header */}
                <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-slate-700">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {entry.employeeName}
                    </h3>
                    <div class="mt-1 flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span class="flex items-center">
                        <svg
                          class="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {entry.role}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {entry.totalHours}h
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Total Hours
                    </div>
                  </div>
                </div>

                {/* Projects List */}
                <div class="space-y-3">
                  {entry.projects.map((project) => (
                    <div
                      key={project.id}
                      class="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center space-x-2">
                            <h4 class="font-semibold text-gray-900 dark:text-white">
                              {project.clientName}
                            </h4>
                            {project.isMPS && (
                              <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                MPS
                              </span>
                            )}
                          </div>
                          {project.notes && (
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {project.notes}
                            </p>
                          )}
                        </div>
                        <div class="ml-4 text-right">
                          <div class="font-mono text-lg font-bold text-gray-900 dark:text-white">
                            {project.hours}h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div class="no-print mt-4 flex justify-end space-x-2 border-t border-gray-200 pt-4 dark:border-slate-700">
                  <button
                    class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                    onClick$={() => console.log("View entry:", entry.id)}
                  >
                    View Details
                  </button>
                  <button
                    class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600"
                    onClick$={() =>
                      (window.location.href = `/entry?edit=${entry.id}`)
                    }
                  >
                    Edit Entry
                  </button>
                </div>
              </div>
            ))}
            {reportData.timeEntries.length === 0 && (
              <div class="py-12 text-center text-gray-500 dark:text-gray-400">
                <svg
                  class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p class="text-sm font-medium">
                  No time entries found for the selected period.
                </p>
              </div>
            )}
          </div>
        </div>
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
