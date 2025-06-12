import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { DashboardStats, WeeklyProgress, RecentEntries, CalendarView } from '../molecules';
import { Button, Badge } from '../atoms';
import { TimeEntryForm } from '../organisms';
import { DataUtils, DateUtils } from '~/utils';
import type { DashboardSummary, DailyTimeEntry, TimeEntryFormData } from '~/types';

/**
 * Calendar day interface for calendar functionality
 */
interface CalendarDay {
  date: string;
  totalHours: number;
  hasEntries: boolean;
  entries?: DailyTimeEntry[];
}

/**
 * Props interface for Dashboard component
 */
interface DashboardProps {
  summary?: DashboardSummary;
  recentEntries?: DailyTimeEntry[];
  onNewEntry$?: () => void;
  onViewCalendar$?: () => void;
  onEditEntry$?: (entryId: string) => void;
  isLoading?: boolean;
}

/**
 * Dashboard Organism Component
 * Main dashboard that displays time tracking overview and statistics.
 * Composes multiple molecules and atoms to create a comprehensive dashboard view.
 * Manages time entry form interactions and provides quick actions.
 * 
 * Props:
 * - summary: Dashboard summary data
 * - recentEntries: Recent time entries for display
 * - onNewEntry$: Handler for creating new entries
 * - onViewCalendar$: Handler for viewing calendar
 * - onEditEntry$: Handler for editing existing entries
 * - isLoading: Loading state
 * 
 * Example usage:
 * <Dashboard 
 *   summary={summary} 
 *   recentEntries={entries} 
 *   onNewEntry$={handleNewEntry}
 *   onEditEntry$={handleEdit}
 *   isLoading={false}
 * />
 */
export const Dashboard = component$<DashboardProps>(({
  summary,
  recentEntries = [],
  onNewEntry$,
  onViewCalendar$,
  onEditEntry$,
  isLoading = false
}) => {
  // Time entry form state
  const showTimeEntryForm = useSignal(false);
  const timeEntryFormDate = useSignal('');
  const isSubmittingEntry = useSignal(false);
  const showAddProjectSignal = useSignal(false);

  // Default summary data if not provided
  const defaultSummary: DashboardSummary = {
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    recentEntries: [],
    weeklyProgress: 0
  };

  const displaySummary = summary || defaultSummary;

  // Utility functions for greeting and progress
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return 'Excellent work! 🎉';
    if (progress >= 80) return 'Great progress! 💪';
    if (progress >= 60) return 'Good momentum! 👍';
    return 'Keep going! 🚀';
  };

  // Handler for calendar day clicks
  const handleDayClick = $((day: any) => {
    // Handle calendar day click - could show day details or navigate to entry form
    console.log('Day clicked:', day);
    if (day.date) {
      handleNewEntryForDate(day.date);
    }
  });

  // Handler for creating new entries for specific dates
  const handleNewEntryForDate = $((date?: string) => {
    // Set the date for the time entry form and show it
    timeEntryFormDate.value = date || new Date().toISOString().split('T')[0];
    showTimeEntryForm.value = true;
  });

  // Handle time entry form submission
  const handleTimeEntrySubmit = $(async (formData: TimeEntryFormData) => {
    isSubmittingEntry.value = true;
    
    try {
      // Simulate API call - replace with actual API integration
      console.log('Submitting time entry:', formData);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close form and refresh data
      showTimeEntryForm.value = false;
      
      // Success feedback could be added here
      console.log('Time entry submitted successfully');
      
    } catch (error) {
      console.error('Failed to submit time entry:', error);
      // TODO: Show error message to user
    } finally {
      isSubmittingEntry.value = false;
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="flex flex-col items-center space-y-4">
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const progressStatus = getProgressStatus(displaySummary.weeklyProgress);

  return (
    <div class="space-y-8">
      {/* Welcome Section */}
      <div class="text-center">
        <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {getGreeting()}, John! 👋
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg">
          {getProgressStatus(displaySummary.weeklyProgress)}
        </p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats summary={displaySummary} />

      {/* Weekly Progress */}
      <WeeklyProgress summary={displaySummary} />

      {/* Calendar View */}
      <CalendarView 
        entries={recentEntries}
        onDayClick$={handleDayClick}
        onNewEntryForDate$={handleNewEntryForDate}
      />

      {/* Recent Entries */}
      <RecentEntries 
        entries={recentEntries}
        onEditEntry$={onEditEntry$}
        onNewEntry$={onNewEntry$}
      />

      {/* Time Entry Form Modal */}
      {showTimeEntryForm.value && (
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="relative group max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              <div class="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20 rounded-t-3xl">
                <div class="flex justify-between items-center">
                  <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">Add Time Entry</h3>
                  <div class="flex items-center space-x-3">
                    {/* Add Project Button */}
                    <button
                      class="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick$={() => showAddProjectSignal.value = true}
                    >
                      <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Project</span>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      class="p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                      onClick$={() => showTimeEntryForm.value = false}
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-8">
                <TimeEntryForm
                  initialData={{ date: timeEntryFormDate.value }}
                  onSubmit$={handleTimeEntrySubmit}
                  onCancel$={() => showTimeEntryForm.value = false}
                  isLoading={isSubmittingEntry.value}
                  simplified={true}
                  showAddProjectSignal={showAddProjectSignal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Quick Time Entry */}
      <div class="fixed bottom-8 right-8 z-40">
        <Button
          variant="primary"
          size="lg"
          class="group relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-0"
        onClick$={() => handleNewEntryForDate()}
          disabled={isLoading}
      >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative flex items-center justify-center">
            <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
          </div>
        </Button>
      </div>
    </div>
  );
}); 