import { component$, Slot } from "@builder.io/qwik";

/**
 * Public Layout
 * Used for authentication pages (login, register) without navigation
 */
export const PublicLayout = component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Slot />
    </div>
  );
});
