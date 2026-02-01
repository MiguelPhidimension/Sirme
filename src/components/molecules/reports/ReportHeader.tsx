import { component$, type QRL } from "@builder.io/qwik";
import { LuFileText } from "@qwikest/icons/lucide";

interface ReportHeaderProps {
  isLoading: boolean;
  onExportCSV$: QRL<() => Promise<void>>;
}

/**
 * ReportHeader - Molecule component for reports page header
 * Displays title, description and action buttons (Print, Export PDF, Export CSV)
 */
export const ReportHeader = component$<ReportHeaderProps>(
  ({ isLoading, onExportCSV$ }) => {
    return (
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Time Tracking Reports
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Analytics and insights for your time entries
          </p>
        </div>
        <div class="no-print flex gap-2">
          <button
            class="rounded-xl border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick$={onExportCSV$}
            disabled={isLoading}
          >
            <LuFileText class="mr-2 inline-block h-4 w-4" />
            {isLoading ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>
    );
  },
);
