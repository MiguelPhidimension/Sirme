import { component$, type Signal, type QRL } from "@builder.io/qwik";
import { LuCalendar, LuFilter, LuX } from "@qwikest/icons/lucide";

interface CollaboratorsFiltersProps {
  startDate: Signal<string>;
  endDate: Signal<string>;
  searchQuery: Signal<string>;
  onClearFilters$: QRL<() => void>;
}

/**
 * CollaboratorsFilters - Molecule component for collaborators page filter bar
 */
export const CollaboratorsFilters = component$<CollaboratorsFiltersProps>(
  ({ startDate, endDate, searchQuery, onClearFilters$ }) => {
    return (
      <div class="no-print rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center gap-2">
          <LuFilter class="h-5 w-5 text-purple-500" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>
        <div class="flex flex-wrap items-end gap-4">
          {/* Date Range */}
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
              Start date
            </label>
            <div class="relative">
              <LuCalendar class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                class="rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={startDate.value}
                onInput$={(e) => {
                  startDate.value = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
              End date
            </label>
            <div class="relative">
              <LuCalendar class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                class="rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={endDate.value}
                onInput$={(e) => {
                  endDate.value = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
          </div>

          {/* Search */}
          <div class="flex flex-1 flex-col gap-1">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
              Search collaborator
            </label>
            <input
              type="text"
              placeholder="Name, email..."
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
              value={searchQuery.value}
              onInput$={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
              }}
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick$={onClearFilters$}
            class="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700"
          >
            <LuX class="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>
    );
  },
);
