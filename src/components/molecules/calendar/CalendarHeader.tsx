import { component$, type QRL } from "@builder.io/qwik";
import { LuPlus, LuClock, LuCalendar } from "@qwikest/icons/lucide";

interface CalendarHeaderProps {
  onAddEntry$: QRL<() => void>;
  onGoToToday$: QRL<() => void>;
}

export const CalendarHeader = component$<CalendarHeaderProps>(
  ({ onAddEntry$, onGoToToday$ }) => {
    return (
      <div class="space-y-6 py-8 text-center">
        <div class="space-y-4">
          <h1 class="flex items-center justify-center gap-4 text-5xl font-bold">
            <LuCalendar class="h-12 w-12 text-blue-500 dark:text-blue-400" />
            <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Time Calendar
            </span>
          </h1>
          <p class="mx-auto max-w-2xl text-xl text-slate-400 dark:text-slate-300">
            Track and visualize your time entries across different months
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-4 pt-6">
          <button
            class="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
            onClick$={onAddEntry$}
          >
            <LuPlus class="h-6 w-6 transition-transform group-hover:scale-110" />
            <span class="text-lg font-semibold">Add Time Entry</span>
          </button>

          <button
            class="group flex transform items-center space-x-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:text-blue-600 hover:shadow-xl dark:border-slate-700/20 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:text-blue-400"
            onClick$={onGoToToday$}
          >
            <LuClock class="h-6 w-6 transition-transform group-hover:scale-110" />
            <span class="text-lg font-semibold">Go to Today</span>
          </button>
        </div>
      </div>
    );
  },
);
