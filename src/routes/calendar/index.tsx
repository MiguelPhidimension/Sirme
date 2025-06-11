import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Calendar } from "~/components/organisms";
import { DataUtils } from "~/utils";
import type { EmployeeRole } from "~/types";

/**
 * Calendar page component
 * Displays time entries in a calendar view with navigation
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const selectedDate = useSignal(new Date().toISOString().split('T')[0]);
  const currentMonth = useSignal(new Date());

  // Sample time entries data (would come from API in real app)
  const entries = useStore([
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
          notes: 'Project planning session'
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
    },
    {
      id: '3',
      employeeName: 'John Doe',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      role: 'Data Engineer' as EmployeeRole,
      projects: [
        {
          id: 'proj-3-1',
          clientName: 'BigData Solutions',
          hours: 6.0,
          isMPS: false,
          notes: 'Schema design and optimization'
        }
      ],
      totalHours: 6.0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Handler functions
  const handleDateSelect = $((date: string) => {
    selectedDate.value = date;
    console.log('Selected date:', date);
  });

  const handleNewEntry = $((date?: string) => {
    // Navigate to new entry page with selected date
    const targetDate = date || selectedDate.value;
    console.log('Creating new entry for date:', targetDate);
    window.location.href = `/entry?date=${targetDate}`;
  });

  const handleEditEntry = $((entryId: string) => {
    // Navigate to edit entry page
    console.log('Editing entry:', entryId);
    window.location.href = `/entry?edit=${entryId}`;
  });

  const handleMonthChange = $((direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth.value);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    currentMonth.value = newMonth;
    console.log('Month changed to:', newMonth);
  });

  const handleExportMonth = $(async () => {
    isLoading.value = true;
    try {
      // Simulate export functionality
      console.log('Exporting month data for:', currentMonth.value);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Implement actual export functionality
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      isLoading.value = false;
    }
  });

  const handleGoToToday = $(() => {
    const today = new Date();
    currentMonth.value = today;
    selectedDate.value = today.toISOString().split('T')[0];
  });

  return (
    <div class="min-h-screen bg-base-100">
      {/* Page header */}
      <div class="navbar bg-base-200 shadow-sm">
        <div class="navbar-start">
          <button 
            class="btn btn-ghost"
            onClick$={() => window.location.href = '/'}
          >
            ← Back to Dashboard
          </button>
        </div>
        <div class="navbar-center">
          <h1 class="text-xl font-bold">Time Calendar</h1>
        </div>
        <div class="navbar-end gap-2">
          <button 
            class="btn btn-outline btn-sm"
            onClick$={handleGoToToday}
          >
            Today
          </button>
          <button 
            class="btn btn-outline btn-sm"
            onClick$={handleExportMonth}
            disabled={isLoading.value}
          >
            {isLoading.value ? 'Exporting...' : 'Export'}
          </button>
          <button 
            class="btn btn-primary btn-sm"
            onClick$={() => handleNewEntry()}
          >
            + New Entry
          </button>
        </div>
      </div>

      {/* Main content */}
      <div class="container mx-auto p-4">
        {/* Calendar instructions */}
        <div class="alert alert-info mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <div>
            <h3 class="font-bold">Calendar View</h3>
            <div class="text-sm">
              View your time entries by month. Click on any day to see details or add new entries.
              Days with logged hours are highlighted.
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <Calendar
              entries={entries}
              selectedDate={selectedDate.value}
              onDateSelect$={handleDateSelect}
              onNewEntry$={handleNewEntry}
              onEditEntry$={handleEditEntry}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">This Month</div>
            <div class="stat-value text-primary">
              {entries.reduce((total, entry) => total + entry.totalHours, 0)}h
            </div>
            <div class="stat-desc">Total hours logged</div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Days Active</div>
            <div class="stat-value text-secondary">
              {new Set(entries.map(entry => entry.date)).size}
            </div>
            <div class="stat-desc">Days with entries</div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Average Daily</div>
            <div class="stat-value text-accent">
              {(entries.reduce((total, entry) => total + entry.totalHours, 0) / 
                Math.max(new Set(entries.map(entry => entry.date)).size, 1)).toFixed(1)}h
            </div>
            <div class="stat-desc">Hours per day</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Calendar - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Calendar view of time tracking entries with monthly navigation",
    },
  ],
}; 