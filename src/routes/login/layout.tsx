import { component$, Slot } from "@builder.io/qwik";

/**
 * Auth Layout - No navigation or footer for auth pages
 */
export default component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Slot />
    </div>
  );
});
