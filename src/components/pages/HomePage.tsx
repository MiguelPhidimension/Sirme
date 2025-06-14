import React, { useState } from "react";
import { Dashboard } from "../organisms";
import { DataUtils } from "~/utils";
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
export const HomePage = () => {
  // State for managing dashboard data
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Recent time entries for display - sample data for demonstration
  const [recentEntries] = useState([
    {
      id: '1',
      employeeName: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      role: 'MuleSoft Developer' as EmployeeRole,
      projects: [
        {
          id: 'proj-1',
          clientName: 'Acme Corp',
          projectName: 'E-commerce Platform',
          hours: 6.5,
          isMPS: true,
          notes: 'Frontend development work'
        },
        {
          id: 'proj-2',
          clientName: 'TechStart Inc',
          projectName: 'Mobile App Development',
          hours: 2.0,
          isMPS: false,
          notes: 'UI/UX improvements'
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
          projectName: 'Backend API Development',
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
  const [summary] = useState({
    todayHours: 6.5,
    weekHours: 32.5,
    monthHours: 142.5,
    recentEntries: recentEntries,
    weeklyProgress: 81.25 // 32.5 / 40 * 100
  });

  // Handler functions for dashboard interactions
  const handleNewEntry = () => {
    // Navigate to new entry page
    console.log('Navigate to new time entry');
    window.location.href = '/entry';
  };

  const handleEditEntry = (entryId: string) => {
    // Navigate to edit entry page with specific entry
    console.log('Edit entry:', entryId);
    window.location.href = `/entry?edit=${entryId}`;
  };

  const handleViewCalendar = () => {
    // Navigate to calendar view
    console.log('Navigate to calendar');
    window.location.href = '/calendar';
  };

  const handleExportData = () => {
    // Export time tracking data functionality
    console.log('Export data requested');
    // TODO: Implement export functionality in future iteration
  };

  const handlePeriodChange = (period: 'today' | 'week' | 'month') => {
    // Handle time period selection for data filtering
    console.log('Period changed to:', period);
    // TODO: Update data based on selected period in future iteration
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Enhanced Dashboard Component */}
      <Dashboard
        summary={summary}
        recentEntries={recentEntries}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
        onViewCalendar={handleViewCalendar}
        isLoading={isLoading}
      />
    </div>
  );
}; 