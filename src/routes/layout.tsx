import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { MainLayout } from "~/components/templates";

/**
 * Route layout that uses MainLayout template
 * Routes should be simple and just render the appropriate template/page components
 */
export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
}); 