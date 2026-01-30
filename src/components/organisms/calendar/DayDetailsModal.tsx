import { component$, type QRL } from "@builder.io/qwik";
import { LuX, LuClipboard } from "@qwikest/icons/lucide";
import { DataUtils, DateUtils } from "~/utils";
import type { CalendarDayTypes } from "~/types";

interface DayDetailsModalProps {
  day: CalendarDayTypes | null;
  isOpen: boolean;
  onClose$: QRL<() => void>;
  onAddEntry$: QRL<(date: string) => void>;
  onEditEntry$: QRL<(entryId: string | string[]) => void>;
}

export const DayDetailsModal = component$<DayDetailsModalProps>(
  ({ day, isOpen, onClose$, onAddEntry$, onEditEntry$ }) => {
    if (!isOpen || !day) return null;

    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
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
                  <div class="mt-3 flex items-center gap-4">
                    <div class="rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-4 py-2">
                      <p class="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
                        Total Hours
                      </p>
                      <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {DataUtils.formatHours(day.totalHours)}
                      </p>
                    </div>
                  </div>
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
                <div class="group relative">
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm transition-all duration-300 group-hover:blur-md"></div>
                  <div class="relative rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 dark:border-slate-600/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40">
                    {/* Header with all projects */}
                    <div class="mb-6 flex items-start justify-between">
                      <div class="flex-1">
                        <div class="mb-3 flex flex-wrap items-center gap-3">
                          {Array.from(
                            new Set(day.entries.map((e) => e.employeeName)),
                          ).map((employeeName) => {
                            const entry = day?.entries?.find(
                              (e) => e.employeeName === employeeName,
                            );
                            return (
                              <div
                                key={employeeName}
                                class="flex items-center gap-3"
                              >
                                <span class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                  {employeeName}
                                </span>
                                <div class="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                  {entry?.role}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div class="flex items-center gap-4">
                          <div class="text-sm text-slate-600 dark:text-slate-400">
                            {day.entries.reduce(
                              (total, e) => total + e.projects.length,
                              0,
                            )}{" "}
                            total project
                            {day.entries.reduce(
                              (total, e) => total + e.projects.length,
                              0,
                            ) !== 1
                              ? "s"
                              : ""}
                          </div>
                        </div>
                      </div>
                      {day.entries.length > 0 && (
                        <button
                          class="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                          onClick$={() =>
                            onEditEntry$((day.entries ?? []).map((e) => e.id))
                          }
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {/* All projects consolidated */}
                    <div class="space-y-3">
                      {day.entries.map((entry) =>
                        entry.projects.map((project, index) => (
                          <div
                            key={`${entry.id}-${index}`}
                            class="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm dark:border-slate-500/20 dark:bg-slate-600/20"
                          >
                            <div class="mb-4 flex items-start justify-between">
                              <div class="flex-1">
                                <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200">
                                  {project.clientName}
                                </h4>
                                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                  {entry.employeeName}
                                </p>
                              </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                              {/* Hours */}
                              <div class="rounded-lg bg-blue-500/10 p-3">
                                <p class="text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
                                  Hours
                                </p>
                                <p class="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                                  {DataUtils.formatHours(project.hours)}
                                </p>
                              </div>

                              {/* MPS Badge */}
                              {project.isMPS && (
                                <div class="rounded-lg bg-emerald-500/10 p-3">
                                  <p class="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                                    Type
                                  </p>
                                  <p class="mt-1 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                    MPS
                                  </p>
                                </div>
                              )}

                              {/* Role */}
                              {project.role && (
                                <div class="rounded-lg bg-purple-500/10 p-3">
                                  <p class="text-xs font-semibold tracking-wide text-purple-700 uppercase dark:text-purple-300">
                                    Role
                                  </p>
                                  <p class="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                                    {project.role}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {project.notes && (
                              <div class="mt-3">
                                <p class="text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300">
                                  Notes
                                </p>
                                <p class="mt-2 rounded-lg border border-slate-400/30 bg-slate-500/20 p-3 text-sm text-slate-700 dark:border-slate-600/50 dark:bg-slate-700/50 dark:text-slate-200">
                                  {project.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )),
                      )}
                    </div>
                  </div>
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
