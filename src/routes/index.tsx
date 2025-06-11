import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Dashboard } from "~/components/organisms";
import { DataUtils } from "~/utils";
import type { EmployeeRole } from "~/types";

/**
 * Main dashboard page component
 * Displays modern time tracking overview and statistics
 * Clean, minimal layout focusing on the enhanced dashboard component
 */
export default component$(() => {
  // State for managing dashboard data
  const isLoading = useSignal(false);
  const refreshKey = useSignal(0);
  
  // Recent time entries for display - sample data for demonstration
  const recentEntries = useStore([
    {
      id: '1',
      employeeName: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      role: 'MuleSoft Developer' as EmployeeRole,
      projects: [
        {
          id: 'proj-1-1',
          clientName: 'Acme Corp',
          hours: 4.5,
          isMPS: true,
          notes: 'Frontend development and testing'
        },
        {
          id: 'proj-1-2',
          clientName: 'TechStart Inc',
          hours: 2.0,
          isMPS: false,
          notes: 'Project planning and requirements gathering'
        }
      ],
      totalHours: 6.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      employeeName: 'John Doe',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      role: 'MuleSoft Developer' as EmployeeRole,
      projects: [
        {
          id: 'proj-2-1',
          clientName: 'Acme Corp',
          hours: 7.5,
          isMPS: true,
          notes: 'Backend API development'
        }
      ],
      totalHours: 7.5,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Initialize mock summary data for development and testing
  const summary = useStore({
    todayHours: 6.5,
    weekHours: 32.5,
    monthHours: 142.5,
    recentEntries: recentEntries,
    weeklyProgress: 81.25 // 32.5 / 40 * 100
  });

  // Handler functions for dashboard interactions
  const handleNewEntry = $(() => {
    // Navigate to new entry page
    console.log('Navigate to new time entry');
    window.location.href = '/entry';
  });

  const handleEditEntry = $((entryId: string) => {
    // Navigate to edit entry page with specific entry
    console.log('Edit entry:', entryId);
    window.location.href = `/entry?edit=${entryId}`;
  });

  const handleViewCalendar = $(() => {
    // Navigate to calendar view
    console.log('Navigate to calendar');
    window.location.href = '/calendar';
  });

  const handleExportData = $(() => {
    // Export time tracking data functionality
    console.log('Export data requested');
    // TODO: Implement export functionality in future iteration
  });

  const handlePeriodChange = $((period: 'today' | 'week' | 'month') => {
    // Handle time period selection for data filtering
    console.log('Period changed to:', period);
    // TODO: Update data based on selected period in future iteration
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Main content container with modern dark styling */}
      <div class="container mx-auto px-6 py-8">
        {/* Enhanced Dashboard Component */}
        <Dashboard
          summary={summary}
          recentEntries={recentEntries}
          onNewEntry$={handleNewEntry}
          onEditEntry$={handleEditEntry}
          onViewCalendar$={handleViewCalendar}
          isLoading={isLoading.value}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard - TimeTracker Pro",
  meta: [
    {
      name: "description",
      content: "Modern time tracking dashboard for managing work hours and projects with enhanced UI/UX",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],
};
