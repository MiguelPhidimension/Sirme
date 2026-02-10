import { component$, type QRL } from "@builder.io/qwik";
import { LuFileText, LuUsers } from "@qwikest/icons/lucide";

interface CollaboratorsHeaderProps {
  isLoading: boolean;
  onExportExcel$: QRL<() => Promise<void>>;
}

/**
 * CollaboratorsHeader - Molecule component for collaborators page header
 * Displays title, description and Export Excel button
 */
export const CollaboratorsHeader = component$<CollaboratorsHeaderProps>(
  ({ isLoading, onExportExcel$ }) => {
    return (
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <LuUsers class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Collaborators
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Team, statistics and detail per collaborator
            </p>
          </div>
        </div>
        <div class="no-print flex gap-2">
          <button
            class="rounded-xl border border-emerald-500 bg-transparent px-4 py-2 text-sm font-medium text-emerald-600 shadow-sm transition-all duration-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            onClick$={onExportExcel$}
            disabled={isLoading}
          >
            <LuFileText class="mr-2 inline-block h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>
    );
  },
);
