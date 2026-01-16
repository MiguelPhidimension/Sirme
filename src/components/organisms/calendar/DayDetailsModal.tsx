import { component$, type QRL } from "@builder.io/qwik";
import { LuX, LuClipboard } from "@qwikest/icons/lucide";
import { DataUtils, DateUtils } from "~/utils";
import type { CalendarDayTypes } from "~/types";

interface DayDetailsModalProps {
  day: CalendarDayTypes | null;
  isOpen: boolean;
  onClose$: QRL<() => void>;
  onAddEntry$: QRL<(date: string) => void>;
  onEditEntry$: QRL<(entryId: string) => void>;
}

export const DayDetailsModal = component$<DayDetailsModalProps>(
  ({ day, isOpen, onClose$, onAddEntry$, onEditEntry$ }) => {
    if (!isOpen || !day) return null;

    return (
      <div class="fixed inset-0 z-1 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="group relative max-h-[85vh] w-full max-w-4xl overflow-auto">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
          <div class="relative rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
            {/* Modal header */}
            <div class="rounded-t-3xl border-b border-white/20 bg-white/20 px-8 py-6 backdrop-blur-sm dark:border-slate-600/20 dark:bg-slate-700/30">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {DateUtils.formatDisplayDate(day.date)}
                  </h3>
                  <p class="mt-1 text-slate-600 dark:text-slate-400">
                    Total: {DataUtils.formatHours(day.totalHours)}
                  </p>
                </div>
                <button
                  class="rounded-xl border border-white/20 bg-white/20 p-3 text-slate-600 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-red-500 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-400 dark:hover:bg-slate-600/40 dark:hover:text-red-400"
                  onClick$={onClose$}
                >
                  <LuX class="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal content */}
            <div class="p-8">
              {day.entries && day.entries.length > 0 ? (
                <div class="space-y-6">
                  {day.entries.map((entry) => (
                    <div key={entry.id} class="group relative">
                      <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm transition-all duration-300 group-hover:blur-md"></div>
                      <div class="relative rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 dark:border-slate-600/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40">
                        <div class="mb-4 flex items-start justify-between">
                          <div>
                            <div class="mb-2 flex items-center gap-3">
                              <span class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                {entry.employeeName}
                              </span>
                              <div class="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                {entry.role}
                              </div>
                            </div>
                            <div class="text-sm text-slate-600 dark:text-slate-400">
                              {entry.projects.length} project
                              {entry.projects.length !== 1 ? "s" : ""} • Total:{" "}
                              {DataUtils.formatHours(entry.totalHours)}
                            </div>
                          </div>
                          <button
                            class="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                            onClick$={() => onEditEntry$(entry.id)}
                          >
                            Edit
                          </button>
                        </div>

                        <div class="space-y-3">
                          {entry.projects.map((project, index) => (
                            <div
                              key={index}
                              class="rounded-xl border border-white/20 bg-white/20 p-4 backdrop-blur-sm dark:border-slate-500/20 dark:bg-slate-600/30"
                            >
                              <div class="flex items-start justify-between">
                                <div class="flex-1">
                                  <div class="font-medium text-slate-800 dark:text-slate-200">
                                    {project.clientName}
                                  </div>
                                  <div class="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <span class="font-bold text-blue-600 dark:text-blue-400">
                                      {DataUtils.formatHours(project.hours)}
                                    </span>
                                    {project.isMPS && (
                                      <div class="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                        MPS
                                      </div>
                                    )}
                                  </div>
                                  {project.notes && (
                                    <p class="mt-2 rounded-lg bg-white/10 p-2 text-sm text-slate-700 dark:bg-slate-700/20 dark:text-slate-300">
                                      {project.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="py-16 text-center">
                  <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20">
                    <LuClipboard class="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 class="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                    No time entries
                  </h4>
                  <p class="mb-6 text-slate-600 dark:text-slate-400">
                    You haven't logged any hours for this day yet.
                  </p>
                  <button
                    class="transform rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                    onClick$={() => {
                      onAddEntry$(day.date);
                      onClose$();
                    }}
                  >
                    Add Time Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
