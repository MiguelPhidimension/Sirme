import { component$, type QRL } from "@builder.io/qwik";
import {
  LuX,
  LuCalendar,
  LuClock,
  LuUser,
  LuBriefcase,
} from "@qwikest/icons/lucide";

interface ProjectDetail {
  id: string;
  clientName: string;
  projectName?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

interface TimeEntryDetailsModalProps {
  isOpen: boolean;
  employeeName: string;
  date: string;
  role: string;
  projects: ProjectDetail[];
  totalHours: number;
  onClose: QRL<() => void>;
}

export const TimeEntryDetailsModal = component$<TimeEntryDetailsModalProps>(
  ({ isOpen, employeeName, date, role, projects, totalHours, onClose }) => {
    if (!isOpen) return null;

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-md"
        onClick$={onClose}
      >
        <div class="group relative max-h-[90vh] w-full max-w-4xl overflow-hidden">
          {/* Glow effect */}
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

          {/* Modal content */}
          <div
            class="relative flex max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-900"
            onClick$={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div class="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <LuBriefcase class="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                      Time Entry Details
                    </h2>
                    <div class="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center gap-1">
                        <LuUser class="h-4 w-4" />
                        <span>{employeeName}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <LuCalendar class="h-4 w-4" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick$={onClose}
                  class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <LuX class="h-6 w-6" />
                </button>
              </div>

              {/* Summary Stats */}
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <LuClock class="h-4 w-4" />
                    <span>Total Hours</span>
                  </div>
                  <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {totalHours.toFixed(1)}h
                  </p>
                </div>
                <div class="rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <LuBriefcase class="h-4 w-4" />
                    <span>Role</span>
                  </div>
                  <p class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* Projects List - Scrollable */}
            <div class="flex-1 overflow-y-auto p-6">
              <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Projects Worked ({projects.length})
              </h3>
              <div class="space-y-4">
                {projects.map((project, idx) => (
                  <div
                    key={project.id}
                    class="group/card relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50"
                    style={`animation: fadeInUp 0.3s ease-out ${idx * 0.1}s both`}
                  >
                    {/* Project Header */}
                    <div class="mb-4 flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-3">
                          <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                            {project.projectName || project.clientName}
                          </h4>
                          {project.isMPS && (
                            <span class="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                              MPS
                            </span>
                          )}
                        </div>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {project.clientName}
                        </p>
                      </div>
                      <div class="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-3 text-center dark:from-blue-900/20 dark:to-purple-900/20">
                        <p class="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {project.hours.toFixed(1)}
                        </p>
                        <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                          hours
                        </p>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {project.notes && (
                      <div class="rounded-xl border border-gray-200 bg-white/60 p-4 dark:border-slate-600 dark:bg-slate-700/30">
                        <div class="mb-2 flex items-center gap-2">
                          <svg
                            class="h-4 w-4 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Notes
                          </span>
                        </div>
                        <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {project.notes}
                        </p>
                      </div>
                    )}

                    {!project.notes && (
                      <div class="rounded-xl bg-gray-100 p-3 text-center dark:bg-slate-700/50">
                        <p class="text-sm text-gray-500 italic dark:text-gray-400">
                          No notes for this project
                        </p>
                      </div>
                    )}

                    {/* Accent border */}
                    <div class="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
              <button
                onClick$={onClose}
                class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
