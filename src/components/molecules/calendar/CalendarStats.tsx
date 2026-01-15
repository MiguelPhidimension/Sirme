import { component$ } from "@builder.io/qwik";
import { DataUtils } from "~/utils";

interface CalendarStatsProps {
  monthTotal: number;
  workingDays: number;
  averageDaily: number;
}

export const CalendarStats = component$<CalendarStatsProps>(
  ({ monthTotal, workingDays, averageDaily }) => {
    return (
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Month Total */}
        <div class="group relative">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
          <div class="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:border-slate-700/20 dark:bg-slate-800/30 dark:hover:bg-slate-800/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Month Total
                </p>
                <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {DataUtils.formatHours(monthTotal)}
                </p>
              </div>
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                <svg
                  class="h-8 w-8 text-blue-600 dark:text-blue-400"
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
            </div>
          </div>
        </div>

        {/* Working Days */}
        <div class="group relative">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
          <div class="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:border-slate-700/20 dark:bg-slate-800/30 dark:hover:bg-slate-800/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Working Days
                </p>
                <p class="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  {workingDays}
                </p>
              </div>
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                <svg
                  class="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Average */}
        <div class="group relative">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
          <div class="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:border-slate-700/20 dark:bg-slate-800/30 dark:hover:bg-slate-800/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Daily Average
                </p>
                <p class="text-4xl font-bold text-amber-600 dark:text-amber-400">
                  {DataUtils.formatHours(averageDaily)}
                </p>
              </div>
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
                <svg
                  class="h-8 w-8 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
