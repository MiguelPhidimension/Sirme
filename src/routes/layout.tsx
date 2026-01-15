import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { MainLayout } from "~/components/templates";

/**
 * Route layout that uses MainLayout template
 * Protects all routes - requires authentication
 */
export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  // Check authentication on client side
  useVisibleTask$(() => {
    // Skip auth check for public routes (login and register)
    if (loc.url.pathname === "/" || loc.url.pathname.startsWith("/register")) {
      return;
    }

    // Check if user is authenticated
    const token = sessionStorage.getItem("auth_token");
    const user = sessionStorage.getItem("auth_user");

    if (!token || !user) {
      // Not authenticated, redirect to login
      nav("/");
    }
  });

  // Always render with MainLayout - it handles showing/hiding sidebar
  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
});
