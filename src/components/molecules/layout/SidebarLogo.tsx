import { component$ } from "@builder.io/qwik";
import { LuClock } from "@qwikest/icons/lucide";

interface SidebarLogoProps {
  isExpanded: boolean;
}

/**
 * SidebarLogo - Molecule component for sidebar branding
 * Displays the SIRME logo and tagline
 */
export const SidebarLogo = component$<SidebarLogoProps>(({ isExpanded }) => {
  return (
    <a href="/" class="group flex items-center space-x-3">
      <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 group-hover:shadow-xl">
        <LuClock class="h-6 w-6 text-white" />
      </div>
      {isExpanded && (
        <div class="overflow-hidden">
          <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300">
            SIRME
          </h1>
          <p class="-mt-1 text-xs text-gray-500 dark:text-gray-400">
            Time Recording System
          </p>
        </div>
      )}
    </a>
  );
});
