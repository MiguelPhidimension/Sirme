import { component$, type QRL } from "@builder.io/qwik";
import { LuClock, LuFileText } from "@qwikest/icons/lucide";
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
            <LuClock class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
              <LuFileText class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
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
