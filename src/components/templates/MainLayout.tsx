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
import { LuBarChart3, LuCalendar, LuClock } from "@qwikest/icons/lucide";

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
  // Load sidebar state from localStorage immediately to prevent flickering
  const getInitialSidebarState = () => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("sidebar_expanded");
    return saved === null ? true : saved === "true";
  };

  // Use store instead of multiple signals for better performance
  const sidebarState = useStore({
    isExpanded: getInitialSidebarState(),
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

  // Navigation items with modern icons
  const navItems = [
    {
      path: "/reports",
      label: "Reports",
      icon: <LuBarChart3 class="h-6 w-6" />,
      description: "Analytics and exports",
    },
    {
      path: "/calendar",
      label: "Calendar",
      icon: <LuCalendar class="h-6 w-6" />,
      description: "View calendar",
    },
    {
      path: "/entry",
      label: "Time Entry",
      icon: <LuClock class="h-6 w-6" />,
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
