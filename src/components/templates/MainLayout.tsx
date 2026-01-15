import {
  component$,
  Slot,
  useSignal,
  $,
  useVisibleTask$,
  useStore,
  useContextProvider,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { SidebarContext } from "~/contexts/sidebar-context";
import { MobileTopBar } from "~/components/molecules";
import { DesktopSidebar, MobileSidebar } from "~/components/organisms";

/**
 * MainLayout Template Component
 * Provides the main application layout structure with sidebar navigation.
 * This template arranges organisms and provides the overall page layout.
 *
 * Props: None (templates typically handle layout structure)
 *
 * Example usage:
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 */
export const MainLayout = component$(() => {
  // Use store instead of multiple signals for better performance
  const sidebarState = useStore({
    isExpanded: true,
    isMobileOpen: false,
    isAuthenticated: false,
    userData: null as any,
  });

  const location = useLocation();
  const currentPath = useSignal("");

  // Provide context to children
  useContextProvider(SidebarContext, sidebarState);

  // Update current path reactively and check authentication on every route change
  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);

    // Normalize path: remove trailing slash except for root
    const path = location.url.pathname;
    currentPath.value = path === "/" ? path : path.replace(/\/$/, "");

    // Check authentication status every time the route changes
    const token = sessionStorage.getItem("auth_token");
    const user = sessionStorage.getItem("auth_user");

    sidebarState.isAuthenticated = !!(token && user);

    if (user) {
      try {
        sidebarState.userData = JSON.parse(user);
      } catch {
        sidebarState.userData = null;
      }
    }
  });

  // Load sidebar state from localStorage - only once on mount
  useVisibleTask$(() => {
    const savedSidebarState = localStorage.getItem("sidebar_expanded");
    if (savedSidebarState !== null) {
      sidebarState.isExpanded = savedSidebarState === "true";
    }
  });

  // Navigation items with modern icons
  const navItems = [
    {
      path: "/reports",
      label: "Reports",
      icon: (
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      description: "Analytics and exports",
    },
    {
      path: "/calendar",
      label: "Calendar",
      icon: (
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      description: "View calendar",
    },
    {
      path: "/entry",
      label: "Time Entry",
      icon: (
        <svg
          class="h-6 w-6"
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
      ),
      description: "Time entries",
    },
  ];

  const toggleSidebar = $(() => {
    sidebarState.isExpanded = !sidebarState.isExpanded;
    localStorage.setItem("sidebar_expanded", String(sidebarState.isExpanded));
  });

  const toggleMobileSidebar = $(() => {
    sidebarState.isMobileOpen = !sidebarState.isMobileOpen;
  });

  const handleLogout = $(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
    }
  });

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {sidebarState.isAuthenticated && (
        <>
          <DesktopSidebar
            isExpanded={sidebarState.isExpanded}
            currentPath={currentPath.value}
            navItems={navItems}
            userData={sidebarState.userData}
            onToggle$={toggleSidebar}
            onLogout$={handleLogout}
          />

          <MobileSidebar
            isOpen={sidebarState.isMobileOpen}
            currentPath={currentPath.value}
            navItems={navItems}
            userData={sidebarState.userData}
            onClose$={toggleMobileSidebar}
            onLogout$={handleLogout}
          />
        </>
      )}

      {/* Main Content Area */}
      <div class="flex flex-1 flex-col overflow-hidden">
        {sidebarState.isAuthenticated && (
          <MobileTopBar onToggleSidebar$={toggleMobileSidebar} />
        )}

        {/* Page Content */}
        <main class="flex-1 overflow-y-auto">
          <Slot />
        </main>
      </div>
    </div>
  );
});
