import { component$, type QRL } from "@builder.io/qwik";
import { LuMenu } from "@qwikest/icons/lucide";

interface MobileTopBarProps {
  onToggleSidebar$: QRL<() => void>;
}

/**
 * MobileTopBar - Molecule component for mobile top navigation bar
 * Displays hamburger menu and app logo
 */
export const MobileTopBar = component$<MobileTopBarProps>(
  ({ onToggleSidebar$ }) => {
    return (
      <header class="flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-4 backdrop-blur-xl md:hidden dark:border-slate-700/20 dark:bg-slate-900/80">
        <button
          onClick$={onToggleSidebar$}
          class="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
        >
          <LuMenu class="h-6 w-6" />
        </button>
        <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300">
          SIRME
        </h1>
        <div class="w-10"></div>
      </header>
    );
  },
);
