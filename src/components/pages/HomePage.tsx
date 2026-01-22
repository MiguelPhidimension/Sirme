import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { Dashboard } from "../organisms";
import type { EmployeeRole } from "~/types";

/**
 * HomePage Component
 * Main dashboard page that displays time tracking overview and statistics.
 * This page component manages data and passes it to the Dashboard organism.
 *
 * Props: None (page components typically don't take props)
 *
 * Example usage:
 * <HomePage />
 */
export const HomePage = component$(() => {
  // State for managing dashboard data
  const isLoading = useSignal(false);

  // Recent time entries for display - sample data for demonstration
  const recentEntries = useStore([
    {
      id: "1",
      employeeName: "John Doe",
      date: new Date().toISOString().split("T")[0],
      role: "MuleSoft Developer" as EmployeeRole,
      projects: [
        {
          id: "proj-1-1",
          clientName: "Acme Corp",
          hours: 4.5,
          isMPS: true,
          notes: "Frontend development and testing",
        },
        {
          id: "proj-1-2",
          clientName: "TechStart Inc",
          hours: 2.0,
          isMPS: false,
          notes: "Project planning and requirements gathering",
        },
      ],
      totalHours: 6.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      employeeName: "John Doe",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      role: "MuleSoft Developer" as EmployeeRole,
      projects: [
        {
          id: "proj-2-1",
          clientName: "Acme Corp",
          hours: 7.5,
          isMPS: true,
          notes: "Backend API development",
        },
      ],
      totalHours: 7.5,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // Initialize mock summary data for development and testing
  const summary = useStore({
    todayHours: 6.5,
    weekHours: 32.5,
    monthHours: 142.5,
    recentEntries: recentEntries,
    weeklyProgress: 81.25, // 32.5 / 40 * 100
  });

  // Handler functions for dashboard interactions

  const handleViewCalendar = $(() => {
    // Navigate to calendar view
    console.log("Navigate to calendar");
    window.location.href = "/calendar";
  });

  // const handleExportData = $(() => {
  //   // Export time tracking data functionality
  //   console.log("Export data requested");
  //   // TODO: Implement export functionality in future iteration
  // });

  // const handlePeriodChange = $((period: "today" | "week" | "month") => {
  //   // Handle time period selection for data filtering
  //   console.log("Period changed to:", period);
  //   // TODO: Update data based on selected period in future iteration
  // });

  return (
    <div class="container mx-auto px-6 py-8">
      {/* Enhanced Dashboard Component */}
      <Dashboard
        summary={summary}
        recentEntries={recentEntries}
        onViewCalendar$={handleViewCalendar}
        isLoading={isLoading.value}
      />
    </div>
  );
});
