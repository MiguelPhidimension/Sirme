import React, { useState } from 'react';
import { Dashboard } from '~/components/organisms';
import { useCreateTimeEntry, useDeleteTimeEntry } from '~/graphql/hooks/useTimeEntries';
import type { TimeEntryFormData, DashboardSummary, DailyTimeEntry, EmployeeRole } from '~/types';

/**
 * DashboardPage Component
 * Main dashboard page that integrates the Dashboard organism with static data.
 * Provides dashboard display, time entry management, and navigation.
 * 
 * Features:
 * - Static dashboard statistics (today, week, month hours)
 * - Mock recent time entries display
 * - Time entry creation and management
 * - Calendar integration
 * - Weekly progress tracking
 * 
 * This page serves as the main landing page for the time tracking application,
 * replacing the original Qwik dashboard route.
 * 
 * @example
 * // Used in router configuration
 * <Route path="/" element={<DashboardPage />} />
 */
const DashboardPage: React.FC = () => {
  // State for user feedback and notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Mock dashboard summary data - no GraphQL request needed
  const mockRecentEntries: DailyTimeEntry[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      date: (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
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
      totalHours: 8.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      employeeName: 'John Doe',
      date: (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
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
      createdAt: (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString();
      })(),
      updatedAt: (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString();
      })()
    },
    {
      id: '3',
      employeeName: 'John Doe',
      date: (() => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const year = twoDaysAgo.getFullYear();
        const month = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(twoDaysAgo.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      role: 'Data Engineer' as EmployeeRole,
      projects: [
        {
          id: 'proj-3-1',
          clientName: 'DataCorp Ltd',
          projectName: 'Data Pipeline Optimization',
          hours: 6.0,
          isMPS: false,
          notes: 'Performance optimization work'
        }
      ],
      totalHours: 6.0,
      createdAt: (() => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return twoDaysAgo.toISOString();
      })(),
      updatedAt: (() => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return twoDaysAgo.toISOString();
      })()
    }
  ];

  const mockDashboardSummary: DashboardSummary = {
    todayHours: 8.5,
    weekHours: 32.5,
    monthHours: 142.5,
    recentEntries: mockRecentEntries,
    weeklyProgress: 81.25 // 32.5 / 40 * 100
  };

  // GraphQL hooks for mutations only (no queries)
  const createTimeEntryMutation = useCreateTimeEntry();
  const deleteTimeEntryMutation = useDeleteTimeEntry();

  /**
   * Show notification to user
   * Auto-hides after 5 seconds
   */
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  /**
   * Handle time entry form submission
   * This is passed to the Dashboard component for form integration
   */
  const handleSubmitTimeEntry = async (formData: TimeEntryFormData) => {
    try {
      await createTimeEntryMutation.mutateAsync(formData);
      showNotification('success', 'Time entry created successfully! 🎉');
      
      // In a real app, this would refresh the dashboard data
      // For now, we just show the success message
    } catch (error) {
      console.error('Failed to create time entry:', error);
      showNotification('error', 'Failed to create time entry. Please try again.');
      // Re-throw error so Dashboard component knows submission failed
      throw error;
    }
  };

  /**
   * Handle new time entry creation
   * Integrates with the Dashboard component's time entry form
   */
  const handleNewEntry = async (formData?: TimeEntryFormData) => {
    if (!formData) {
      // If no form data provided, the Dashboard component will handle showing the form
      return;
    }

    // This is now handled by handleSubmitTimeEntry
    await handleSubmitTimeEntry(formData);
  };

  /**
   * Handle time entry editing
   * Navigates to edit form or shows edit modal
   */
  const handleEditEntry = async (entryId: string) => {
    try {
      // For now, we'll show a simple notification
      // In a full implementation, this would open an edit modal or navigate to edit page
      showNotification('info', `Edit functionality for entry ${entryId} coming soon!`);
      
      console.log('Edit entry requested:', entryId);
      // TODO: Implement edit functionality
      // This could involve:
      // 1. Fetching the specific entry data
      // 2. Opening an edit modal with pre-filled form
      // 3. Handling the update mutation
      
    } catch (error) {
      console.error('Failed to edit time entry:', error);
      showNotification('error', 'Failed to load entry for editing.');
    }
  };

  /**
   * Handle calendar view navigation
   * Could navigate to a dedicated calendar page or show calendar modal
   */
  const handleViewCalendar = () => {
    // For now, show notification - in full implementation, navigate to calendar
    showNotification('info', 'Calendar view coming soon! 📅');
    
    console.log('Calendar view requested');
    // TODO: Implement calendar navigation
    // This could involve:
    // 1. Navigating to /calendar route
    // 2. Opening a calendar modal
    // 3. Showing expanded calendar view in dashboard
  };

  /**
   * Handle entry deletion (if needed)
   * This is typically called from entry management components
   */
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteTimeEntryMutation.mutateAsync(entryId);
      showNotification('success', 'Time entry deleted successfully.');
      
      // In a real app, this would refresh the dashboard data
      // For now, we just show the success message
    } catch (error) {
      console.error('Failed to delete time entry:', error);
      showNotification('error', 'Failed to delete time entry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Dashboard
          summary={mockDashboardSummary}
          recentEntries={mockRecentEntries}
          onNewEntry={() => handleNewEntry()}
          onViewCalendar={handleViewCalendar}
          onEditEntry={handleEditEntry}
          onSubmitTimeEntry={handleSubmitTimeEntry}
          isLoading={false}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${
            notification.type === 'success' ? 'alert-success' : 
            notification.type === 'error' ? 'alert-error' : 
            'alert-info'
          } shadow-lg`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {notification.type === 'success' ? '✅' : 
                 notification.type === 'error' ? '❌' : 
                 'ℹ️'}
              </span>
              <span>{notification.message}</span>
            </div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay for Mutations */}
      {(createTimeEntryMutation.isPending || deleteTimeEntryMutation.isPending) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-2xl p-6 shadow-2xl flex items-center space-x-4">
            <div className="loading loading-spinner loading-md text-primary"></div>
            <span className="text-base-content">
              {createTimeEntryMutation.isPending ? 'Creating time entry...' : 'Deleting time entry...'}
            </span>
          </div>
        </div>
      )}

      {/* Development Info (remove in production) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-40">
          <details className="dropdown dropdown-top">
            <summary className="btn btn-sm btn-ghost opacity-50 hover:opacity-100">
              🔧 Dev Info
            </summary>
            <div className="dropdown-content bg-base-100 rounded-box p-4 shadow-lg w-80 text-xs">
              <h4 className="font-bold mb-2">Dashboard Status</h4>
              <ul className="space-y-1">
                <li>Mode: Static Data (No GraphQL)</li>
                <li>Summary: ✅ Mock Data</li>
                <li>Entries: {mockRecentEntries.length}</li>
                <li>Today Hours: {mockDashboardSummary.todayHours}</li>
                <li>Week Hours: {mockDashboardSummary.weekHours}</li>
                <li>Progress: {mockDashboardSummary.weeklyProgress.toFixed(1)}%</li>
              </ul>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 