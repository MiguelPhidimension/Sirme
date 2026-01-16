import { component$, type QRL } from "@builder.io/qwik";
import { LuCalendar } from "@qwikest/icons/lucide";
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

interface TimeEntryCardProps {
  entry: TimeEntry;
  onView$: QRL<(id: string) => void>;
  onEdit$: QRL<(id: string) => void>;
}

/**
 * TimeEntryCard - Molecule component for displaying a single time entry
 * Shows employee info, date, projects, and action buttons
 */
export const TimeEntryCard = component$<TimeEntryCardProps>(
  ({ entry, onView$, onEdit$ }) => {
    return (
      <div class="space-y-3 rounded-2xl border border-white/20 bg-gradient-to-br from-white/95 to-gray-50/95 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/20 dark:from-slate-800/95 dark:to-slate-700/95">
        {/* Entry Header */}
        <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-slate-700">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {entry.employeeName}
            </h3>
            <div class="mt-1 flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center">
                <LuCalendar class="mr-1 h-4 w-4" />
                {new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {entry.role}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {entry.totalHours}h
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Total Hours
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div class="space-y-3">
          {entry.projects.map((project) => (
            <div
              key={project.id}
              class="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">
                      {project.clientName}
                    </h4>
                    {project.isMPS && (
                      <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        MPS
                      </span>
                    )}
                  </div>
                  {project.notes && (
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {project.notes}
                    </p>
                  )}
                </div>
                <div class="ml-4 text-right">
                  <div class="font-mono text-lg font-bold text-gray-900 dark:text-white">
                    {project.hours}h
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div class="no-print mt-4 flex justify-end space-x-2 border-t border-gray-200 pt-4 dark:border-slate-700">
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
            onClick$={() => onView$(entry.id)}
          >
            View Details
          </button>
          <button
            class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600"
            onClick$={() => onEdit$(entry.id)}
          >
            Edit Entry
          </button>
        </div>
      </div>
    );
  },
);
