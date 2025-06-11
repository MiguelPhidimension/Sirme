import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard, ProjectEntryCard } from "~/components/molecules";
import { DataUtils } from "~/utils";
import type { EmployeeRole } from "~/types";

/**
 * Reports page component
 * Displays time tracking analytics and export functionality
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const selectedPeriod = useSignal<'week' | 'month' | 'quarter' | 'year'>('month');
  const selectedEmployee = useSignal('all');
  const selectedProject = useSignal('all');

  // Sample reports data (would come from API in real app)
  const reportData = useStore({
    summary: {
      totalHours: 184.5,
      billableHours: 156.0,
      projects: 8,
      avgDaily: 7.4
    },
    projectBreakdown: [
      {
        projectCode: 'PROJ-001',
        projectName: 'Website Development',
        totalHours: 85.5,
        percentage: 46.3,
        status: 'active'
      },
      {
        projectCode: 'PROJ-002',
        projectName: 'Client Meetings',
        totalHours: 42.0,
        percentage: 22.8,
        status: 'active'
      },
      {
        projectCode: 'PROJ-003',
        projectName: 'Database Design',
        totalHours: 35.0,
        percentage: 19.0,
        status: 'completed'
      },
      {
        projectCode: 'PROJ-004',
        projectName: 'Documentation',
        totalHours: 22.0,
        percentage: 11.9,
        status: 'active'
      }
    ],
    timeEntries: [
      {
        id: '1',
        employeeName: 'John Doe',
        date: new Date().toISOString().split('T')[0],
        role: 'MuleSoft Developer' as EmployeeRole,
        projects: [
          {
            id: 'proj-r-1',
            clientName: 'Acme Corp',
            hours: 6.5,
            isMPS: true,
            notes: 'Frontend component development'
          }
        ],
        totalHours: 6.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });

  // Filter options
  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Handler functions
  const handlePeriodChange = $((period: 'week' | 'month' | 'quarter' | 'year') => {
    selectedPeriod.value = period;
    console.log('Period changed to:', period);
    // TODO: Fetch data for selected period
  });

  const handleExportPDF = $(async () => {
    isLoading.value = true;
    try {
      console.log('Exporting PDF report...');
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // TODO: Implement actual PDF export
      alert('PDF export would download here');
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      isLoading.value = false;
    }
  });

  const handleExportCSV = $(async () => {
    isLoading.value = true;
    try {
      console.log('Exporting CSV report...');
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Implement actual CSV export
      alert('CSV export would download here');
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      isLoading.value = false;
    }
  });

  const handlePrintReport = $(() => {
    window.print();
  });

  return (
    <div class="min-h-screen bg-base-100">
      {/* Page header */}
      <div class="navbar bg-base-200 shadow-sm no-print">
        <div class="navbar-start">
          <button 
            class="btn btn-ghost"
            onClick$={() => window.location.href = '/'}
          >
            ← Back to Dashboard
          </button>
        </div>
        <div class="navbar-center">
          <h1 class="text-xl font-bold">Time Tracking Reports</h1>
        </div>
        <div class="navbar-end gap-2">
          <button 
            class="btn btn-outline btn-sm"
            onClick$={handlePrintReport}
          >
            🖨️ Print
          </button>
          <div class="dropdown dropdown-end">
            <label tabIndex={0} class="btn btn-primary btn-sm">
              📊 Export
            </label>
            <ul tabIndex={0} class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button onClick$={handleExportPDF} disabled={isLoading.value}>
                  {isLoading.value ? 'Exporting...' : '📄 Export PDF'}
                </button>
              </li>
              <li>
                <button onClick$={handleExportCSV} disabled={isLoading.value}>
                  {isLoading.value ? 'Exporting...' : '📊 Export CSV'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div class="container mx-auto p-4">
        {/* Filters */}
        <div class="card bg-base-200 shadow-sm mb-6 no-print">
          <div class="card-body">
            <h2 class="card-title text-lg">Report Filters</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Period selector */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Time Period</span>
                </label>
                <select 
                  class="select select-bordered"
                  value={selectedPeriod.value}
                  onChange$={(e) => handlePeriodChange(e.target.value as any)}
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee selector */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Employee</span>
                </label>
                <select 
                  class="select select-bordered"
                  value={selectedEmployee.value}
                  onChange$={(e) => selectedEmployee.value = e.target.value}
                >
                  <option value="all">All Employees</option>
                  <option value="emp-001">John Doe</option>
                  <option value="emp-002">Jane Smith</option>
                </select>
              </div>

              {/* Project selector */}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Project</span>
                </label>
                <select 
                  class="select select-bordered"
                  value={selectedProject.value}
                  onChange$={(e) => selectedProject.value = e.target.value}
                >
                  <option value="all">All Projects</option>
                  <option value="PROJ-001">Website Development</option>
                  <option value="PROJ-002">Client Meetings</option>
                  <option value="PROJ-003">Database Design</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div class="card bg-base-200 shadow-lg mb-8">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">Project Breakdown</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Hours</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th class="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.projectBreakdown.map((project) => (
                    <tr key={project.projectCode}>
                      <td>
                        <div>
                          <div class="font-bold">{project.projectName}</div>
                          <div class="text-sm opacity-50">{project.projectCode}</div>
                        </div>
                      </td>
                      <td class="font-mono">{project.totalHours}h</td>
                      <td>
                        <div class="flex items-center gap-2">
                          <progress 
                            class="progress progress-primary w-20" 
                            value={project.percentage} 
                            max="100"
                          ></progress>
                          <span class="text-sm">{project.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <div class={`badge ${project.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                          {project.status}
                        </div>
                      </td>
                      <td class="no-print">
                        <button class="btn btn-ghost btn-xs">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">Recent Time Entries</h2>
            <div class="space-y-4">
              {reportData.timeEntries.map((entry) => (
                <ProjectEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit$={() => window.location.href = `/entry?edit=${entry.id}`}
                  onView$={() => console.log('View entry:', entry.id)}
                />
              ))}
              {reportData.timeEntries.length === 0 && (
                <div class="text-center py-8 text-base-content/50">
                  No time entries found for the selected period.
                </div>
              )}
            </div>
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