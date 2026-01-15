import { component$, type QRL } from "@builder.io/qwik";
import { TimeEntryCard } from "~/components/molecules";
import type { EmployeeRole } from "~/types";

interface ProjectData {
  id: string;
  clientName: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

interface TimeEntry {
  id: string;
  employeeName: string;
  date: string;
  role: EmployeeRole;
  projects: ProjectData[];
  totalHours: number;
  createdAt: string;
  updatedAt: string;
}

interface RecentEntriesListProps {
  entries: TimeEntry[];
  onViewEntry$: QRL<(id: string) => void>;
  onEditEntry$: QRL<(id: string) => void>;
}

/**
 * RecentEntriesList - Organism component for recent time entries list
 * Displays a list of recent time entries with empty state
 */
export const RecentEntriesList = component$<RecentEntriesListProps>(
  ({ entries, onViewEntry$, onEditEntry$ }) => {
    return (
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
          {entries.length > 0 ? (
            entries.map((entry) => (
              <TimeEntryCard
                key={entry.id}
                entry={entry}
                onView$={onViewEntry$}
                onEdit$={onEditEntry$}
              />
            ))
          ) : (
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
    );
  },
);
