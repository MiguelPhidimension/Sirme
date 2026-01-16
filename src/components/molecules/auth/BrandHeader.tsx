import { component$ } from "@builder.io/qwik";
import { LuClock } from "@qwikest/icons/lucide";

/**
 * BrandHeader - Molecule component for application branding
 * Displays SIRME logo and tagline in the top corner
 */
export const BrandHeader = component$(() => {
  return (
    <div class="absolute top-4 right-4 left-4 z-1 sm:right-auto sm:left-8">
      <div class="flex items-center justify-center space-x-2 sm:justify-start sm:space-x-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg sm:h-10 sm:w-10 sm:rounded-xl">
          <LuClock class="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>
        <div>
          <h1 class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-blue-400 dark:to-purple-400">
            SIRME
          </h1>
          <p class="text-xs text-slate-600 dark:text-slate-400">
            Time Recording System
          </p>
        </div>
      </div>
    </div>
  );
});
