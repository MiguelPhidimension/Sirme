import { component$ } from "@builder.io/qwik";

/**
 * AnimatedBackground - Molecule component for animated background elements
 * Displays animated gradient circles for visual appeal
 */
export const AnimatedBackground = component$(() => {
  return (
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
      <div class="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl delay-1000 dark:bg-purple-500/10"></div>
    </div>
  );
});
