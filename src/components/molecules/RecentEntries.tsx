import { component$, QRL, useSignal } from "@builder.io/qwik";
import { LuClipboard, LuUser, LuClock, LuPencil } from "@qwikest/icons/lucide";
import { Badge } from "../atoms";
import { DataUtils, DateUtils } from "~/utils";
import type { DailyTimeEntry } from "~/types";

/**
 * Props interface for RecentEntries component
 */
interface RecentEntriesProps {
  entries: DailyTimeEntry[];
  onEditEntry$?: QRL<(entryId: string) => void>;
  onNewEntry$?: QRL<() => void>;
}

/**
 * RecentEntries Molecule Component
 * Displays a list of recent time entries with modern styling.
 * Provides functionality to view, edit, and manage time entries.
 * Combines atoms to create a comprehensive entries display.
 *
 * Props:
 * - entries: Array of recent time entries to display
 * - onEditEntry$: Handler for editing existing entries
 * - onNewEntry$: Handler for creating new entries
 *
 * Example usage:
 * <RecentEntries
 *   entries={recentEntries}
 *   onEditEntry$={handleEdit}
 *   onNewEntry$={handleNew}
 * />
 */
export const RecentEntries = component$<RecentEntriesProps>(
  ({ entries, onEditEntry$, onNewEntry$ }) => {
    // Local state for showing all entries
    const showAllEntries = useSignal(false);

    // Determine which entries to display
    const displayEntries = showAllEntries.value ? entries : entries.slice(0, 3);

    return (
      <div class="group relative">
        {/* Background glow effect */}
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

        {/* Main content container */}
        <div class="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
          {/* Header section */}
          <div class="mb-8 flex items-center justify-between">
            <h3 class="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-200">
              <span class="text-3xl">📋</span>
              Recent Time Entries
            </h3>
            {entries.length > 3 && (
              <button
                class="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:text-blue-600 dark:border-slate-600/20 dark:bg-slate-700/30 dark:text-slate-300 dark:hover:text-blue-400"
                onClick$={() => (showAllEntries.value = !showAllEntries.value)}
              >
                {showAllEntries.value
                  ? "Show Less"
                  : `Show All (${entries.length})`}
              </button>
            )}
          </div>

          {/* Entries content */}
          {entries.length === 0 ? (
            /* Empty state */
            <div class="py-16 text-center">
              <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20">
                <LuClipboard class="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 class="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                No time entries yet
              </h4>
              <p class="mb-6 text-slate-600 dark:text-slate-400">
                Start tracking your time to see entries here
              </p>
              <button
                class="transform rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                onClick$={onNewEntry$}
              >
                Add Your First Entry
              </button>
            </div>
          ) : (
            /* Entries list */
            <div class="space-y-6">
              {displayEntries.map((entry) => (
                <div key={entry.id} class="group relative">
                  {/* Entry background glow */}
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm transition-all duration-300 group-hover:blur-md"></div>

                  {/* Entry content */}
                  <div class="relative rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 dark:border-slate-600/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        {/* Entry header */}
                        <div class="mb-4 flex items-center gap-4">
                          <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {DateUtils.formatDisplayDate(entry.date)}
                          </h4>
                          <Badge
                            variant="primary"
                            class="border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-300"
                          >
                            {entry.role}
                          </Badge>
                          {DateUtils.isToday(entry.date) && (
                            <Badge
                              variant="success"
                              class="animate-pulse border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            >
                              Today
                            </Badge>
                          )}
                        </div>

                        {/* Entry details */}
                        <div class="mb-4 flex items-center gap-6 text-slate-600 dark:text-slate-400">
                          <span class="flex items-center gap-2">
                            <LuUser class="h-5 w-5" />
                            <span class="font-medium">
                              {entry.employeeName}
                            </span>
                          </span>
                          <span class="flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                            <LuClock class="h-5 w-5" />
                            {DataUtils.formatHours(entry.totalHours)}
                          </span>
                        </div>

                        {/* Projects list */}
                        <div class="flex flex-wrap gap-3">
                          {entry.projects.map((project, index) => (
                            <div
                              key={index}
                              class="rounded-xl border border-white/20 bg-white/20 px-4 py-2 backdrop-blur-sm dark:border-slate-500/20 dark:bg-slate-600/30"
                            >
                              <div class="flex items-center gap-3 text-sm">
                                <span class="font-medium text-slate-700 dark:text-slate-300">
                                  {project.clientName}
                                </span>
                                <span class="font-bold text-blue-600 dark:text-blue-400">
                                  {DataUtils.formatHours(project.hours)}
                                </span>
                                {project.isMPS && (
                                  <Badge
                                    variant="success"
                                    class="badge-xs border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                  >
                                    MPS
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Edit button */}
                      <button
                        class="ml-6 rounded-xl border border-white/20 bg-white/20 p-3 text-slate-600 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-400 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                        onClick$={() => onEditEntry$ && onEditEntry$(entry.id)}
                      >
                        <LuPencil class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
