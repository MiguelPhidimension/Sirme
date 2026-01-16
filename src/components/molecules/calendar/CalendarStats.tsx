import { component$ } from "@builder.io/qwik";
import { LuClock, LuCalendar, LuBarChart3 } from "@qwikest/icons/lucide";
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
                <LuClock class="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
                <LuCalendar class="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
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
                <LuBarChart3 class="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
