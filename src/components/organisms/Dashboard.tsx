import { component$, useSignal, $, QRL } from "@builder.io/qwik";
import {
  DashboardStats,
  WeeklyProgress,
  RecentEntries,
  CalendarView,
} from "../molecules";
import { Button } from "../atoms";
import { TimeEntryForm } from "../organisms";
import type {
  DashboardSummary,
  DailyTimeEntry,
} from "~/types";
import { LuPlus, LuX } from "@qwikest/icons/lucide";

/**
 * Props interface for Dashboard component
 */
interface DashboardProps {
  summary?: DashboardSummary;
  recentEntries?: DailyTimeEntry[];
  onViewCalendar$?: QRL<() => void>;
  onEditEntry$?: QRL<(entryId: string) => void>;
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
export const Dashboard = component$<DashboardProps>(
  ({
    summary,
    recentEntries = [],
    isLoading = false,
  }) => {
    // Time entry form state
    const showTimeEntryForm = useSignal(false);
    const timeEntryFormDate = useSignal("");
    const isSubmittingEntry = useSignal(false);
    const showAddProjectSignal = useSignal(false);

    // Default summary data if not provided
    const defaultSummary: DashboardSummary = {
      todayHours: 0,
      weekHours: 0,
      monthHours: 0,
      recentEntries: [],
      weeklyProgress: 0,
    };

    const displaySummary = summary || defaultSummary;

    // Utility functions for greeting and progress
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "🌅 Good morning";
      if (hour < 17) return "☀️ Good afternoon";
      return "🌙 Good evening";
    };

    const getProgressStatus = (progress: number) => {
      if (progress >= 100) return "Excellent work! 🎉";
      if (progress >= 80) return "Great progress! 💪";
      if (progress >= 60) return "Good momentum! 👍";
      return "Keep going! 🚀";
    };

    // Handler for creating new entries for specific dates
    const handleNewEntryForDate = $((date?: string) => {
      // Set the date for the time entry form and show it
      timeEntryFormDate.value = date || new Date().toISOString().split("T")[0];
      showTimeEntryForm.value = true;
    });

    // Handler for calendar day clicks
    const handleDayClick = $((day: any) => {
      // Handle calendar day click - could show day details or navigate to entry form
      if (day.date) {
        handleNewEntryForDate(day.date);
      }
    });

    // Handle time entry form submission
    const handleTimeEntrySubmit = $(async () => {
      isSubmittingEntry.value = true;

      try {
        // Simulate API call - replace with actual API integration

        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Close form and refresh data
        showTimeEntryForm.value = false;

        // Success feedback could be added here
      } catch (error) {
        console.error("Failed to submit time entry:", error);
        // TODO: Show error message to user
      } finally {
        isSubmittingEntry.value = false;
      }
    });

    // Loading state
    if (isLoading) {
      return (
        <div class="flex min-h-[400px] items-center justify-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="loading loading-spinner loading-lg text-primary"></div>
            <p class="text-base-content/60">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    // const progressStatus = getProgressStatus(displaySummary.weeklyProgress);

    return (
      <div class="space-y-8">
        {/* Welcome Section */}
        <div class="text-center">
          <h1 class="mb-2 text-4xl font-bold text-slate-800 dark:text-slate-200">
            {getGreeting()}, John! 👋
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400">
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
        />

        {/* Time Entry Form Modal */}
        {showTimeEntryForm.value && (
          <div class="fixed inset-0 z-1 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div class="group relative max-h-[90vh] w-full max-w-2xl overflow-auto">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
              <div class="relative rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
                <div class="rounded-t-3xl border-b border-white/20 bg-white/20 px-8 py-6 backdrop-blur-sm dark:border-slate-600/20 dark:bg-slate-700/30">
                  <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      Add Time Entry
                    </h3>
                    <div class="flex items-center space-x-3">
                      {/* Add Project Button */}
                      <button
                        class="group flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl"
                        onClick$={() => (showAddProjectSignal.value = true)}
                      >
                        <LuPlus class="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>Add Project</span>
                      </button>

                      {/* Close Button */}
                      <button
                        class="rounded-xl border border-white/20 bg-white/20 p-3 text-slate-600 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-red-500 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-400 dark:hover:bg-slate-600/40 dark:hover:text-red-400"
                        onClick$={() => (showTimeEntryForm.value = false)}
                      >
                        <LuX class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="p-8">
                  <TimeEntryForm
                    initialData={{ date: timeEntryFormDate.value }}
                    onSubmit$={handleTimeEntrySubmit}
                    onCancel$={() => (showTimeEntryForm.value = false)}
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
        <div class="fixed right-8 bottom-8 z-1">
          <Button
            variant="primary"
            size="lg"
            class="group hover:shadow-3xl relative h-16 w-16 transform rounded-full border-0 bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700"
            onClick$={() => handleNewEntryForDate()}
            disabled={isLoading}
          >
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
            <div class="relative flex items-center justify-center">
              <LuPlus class="h-8 w-8 text-white transition-transform group-hover:scale-110" />
            </div>
          </Button>
        </div>
      </div>
    );
  },
);
