import { component$, Slot } from "@builder.io/qwik";

/**
 * Register Layout - Simple passthrough layout
 * Main layout already handles authentication checks
 */
export default component$(() => {
  return <Slot />;
});
