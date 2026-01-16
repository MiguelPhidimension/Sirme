import { component$, type QRL } from "@builder.io/qwik";
import { LuPrinter, LuDownload, LuFileText } from "@qwikest/icons/lucide";

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
            <LuPrinter class="mr-2 inline-block h-4 w-4" />
            Print
          </button>
          <button
            class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            onClick$={onExportPDF$}
            disabled={isLoading}
          >
            <LuDownload class="mr-2 inline-block h-4 w-4" />
            {isLoading ? "Exporting..." : "Export PDF"}
          </button>
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
