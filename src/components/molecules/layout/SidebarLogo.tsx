import { component$ } from "@builder.io/qwik";

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
        <svg
          class="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
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
