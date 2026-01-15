import { component$, type Signal, type QRL } from "@builder.io/qwik";

interface DateSelectorProps {
  selectedDate: Signal<string>;
  onDateChange: QRL<(date: string) => void>;
}

/**
 * DateSelector - Molecule component for date selection
 * Displays a date picker with modern styling
 */
export const DateSelector = component$<DateSelectorProps>(
  ({ selectedDate, onDateChange }) => {
    return (
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
            <svg
              class="h-5 w-5 text-blue-600 dark:text-blue-400"
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
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Select Date
          </h2>
        </div>
        <input
          type="date"
          value={selectedDate.value}
          onInput$={(e) => onDateChange((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>
    );
  },
);
