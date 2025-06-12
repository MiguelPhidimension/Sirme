import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HomePage } from "~/components/pages";

/**
 * Main route component that renders the HomePage
 * Routes should be simple and just render the appropriate page component
 */
export default component$(() => {
  return <HomePage />;
});

export const head: DocumentHead = {
  title: "Dashboard - TimeTracker Pro",
  meta: [
    {
      name: "description",
      content: "Modern time tracking dashboard for managing work hours and projects with enhanced UI/UX",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],
};
