import { component$, type QRL } from "@builder.io/qwik";

interface SidebarToggleButtonProps {
  isExpanded: boolean;
  onToggle$: QRL<() => void>;
}

/**
 * SidebarToggleButton - Molecule component for toggling sidebar expansion
 * Shows a button to collapse/expand the sidebar
 */
export const SidebarToggleButton = component$<SidebarToggleButtonProps>(
  ({ isExpanded, onToggle$ }) => {
    return (
      <button
        onClick$={onToggle$}
        class="flex w-full items-center justify-center rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
        title={isExpanded ? "Contraer sidebar" : "Expandir sidebar"}
      >
        <svg
          class={`h-6 w-6 transition-transform duration-300 ${
            isExpanded ? "" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
    );
  },
);
