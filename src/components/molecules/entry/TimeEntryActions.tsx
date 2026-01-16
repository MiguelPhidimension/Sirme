import { component$, type QRL } from "@builder.io/qwik";

interface TimeEntryActionsProps {
  isLoading: boolean;
  isDisabled: boolean;
  onCancel$: QRL<() => void>;
  onSubmit$: QRL<() => void>;
}

/**
 * TimeEntryActions - Molecule component for action buttons
 * Displays Cancel and Save buttons with appropriate states
 */
export const TimeEntryActions = component$<TimeEntryActionsProps>(
  ({ isLoading, isDisabled, onCancel$, onSubmit$ }) => {
    return (
      <div class="flex items-center justify-between">
        <button
          type="button"
          onClick$={onCancel$}
          class="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick$={onSubmit$}
          disabled={isDisabled || isLoading}
          class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Time Entry"}
        </button>
      </div>
    );
  },
);
