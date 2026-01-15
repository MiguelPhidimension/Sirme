import { component$, type QRL } from "@builder.io/qwik";

interface ReportHeaderProps {
  isLoading: boolean;
  onPrint$: QRL<() => void>;
  onExportPDF$: QRL<() => Promise<void>>;
  onExportCSV$: QRL<() => Promise<void>>;
}

/**
 * ReportHeader - Molecule component for reports page header
 * Displays title, description and action buttons (Print, Export PDF, Export CSV)
 */
export const ReportHeader = component$<ReportHeaderProps>(
  ({ isLoading, onPrint$, onExportPDF$, onExportCSV$ }) => {
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
            class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            onClick$={onPrint$}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            onClick$={onExportPDF$}
            disabled={isLoading}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isLoading ? "Exporting..." : "Export PDF"}
          </button>
          <button
            class="rounded-xl border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick$={onExportCSV$}
            disabled={isLoading}
          >
            <svg
              class="mr-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isLoading ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>
    );
  },
);
