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

  // Update current path reactively
  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    // Normalize path: remove trailing slash except for root
    const path = location.url.pathname;
    currentPath.value = path === "/" ? path : path.replace(/\/$/, "");
  });

  // Check authentication status - only once on mount
  useVisibleTask$(({ cleanup }) => {
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

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebar_expanded");
    if (savedSidebarState !== null) {
      sidebarState.isExpanded = savedSidebarState === "true";
    }

    // Cleanup function (optional, but good practice)
    cleanup(() => {
      // Nothing to cleanup
    });
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

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar - Desktop */}
      {sidebarState.isAuthenticated && (
        <>
          <aside
            class={`hidden flex-col border-r border-white/20 bg-white/80 backdrop-blur-xl transition-all duration-300 md:flex dark:border-slate-700/20 dark:bg-slate-900/80 ${
              sidebarState.isExpanded ? "w-64" : "w-20"
            }`}
          >
            {/* Logo/Brand */}
            <div class="flex h-16 items-center border-b border-white/20 px-4 dark:border-slate-700/20">
              <a href="/" class="group flex items-center space-x-3">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                  <svg
                    class="h-6 w-6 text-white"
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
                </div>
                {sidebarState.isExpanded && (
                  <div class="overflow-hidden">
                    <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300">
                      SIRME
                    </h1>
                    <p class="-mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Time Recording System
                    </p>
                  </div>
                )}
              </a>
            </div>

            {/* Navigation */}
            <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  class={`group relative flex items-center rounded-xl px-3 py-3 font-medium transition-all duration-200 ${
                    currentPath.value === item.path
                      ? "border-l-4 border-blue-400 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                  }`}
                  title={
                    !sidebarState.isExpanded ? item.label : item.description
                  }
                >
                  <span
                    class={`flex-shrink-0 transition-colors duration-200 ${
                      currentPath.value === item.path
                        ? "text-white"
                        : "text-gray-500 group-hover:text-blue-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {sidebarState.isExpanded && (
                    <span class="ml-3 text-sm font-semibold">{item.label}</span>
                  )}
                  {/* Active indicator */}
                  {currentPath.value === item.path &&
                    !sidebarState.isExpanded && (
                      <div class="absolute top-1/2 -right-1 h-8 w-1 -translate-y-1/2 transform rounded-l-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
                    )}
                </a>
              ))}
            </nav>

            {/* User Profile */}
            {sidebarState.userData && (
              <div class="border-t border-white/20 p-4 dark:border-slate-700/20">
                <div class="group relative">
                  <div class="flex cursor-pointer items-center space-x-3">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg transition-all duration-200 hover:shadow-xl">
                      <span class="text-sm font-bold text-white">
                        {sidebarState.userData.first_name?.[0] || "U"}
                        {sidebarState.userData.last_name?.[0] || ""}
                      </span>
                    </div>
                    {sidebarState.isExpanded && (
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {sidebarState.userData.first_name} {sidebarState.userData.last_name}
                        </p>
                        <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                          {sidebarState.userData.role?.role_name || "Employee"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  <div class="invisible absolute right-0 bottom-full left-0 z-50 mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800">
                    <a
                      href="/profile"
                      class="block px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
                    >
                      <div class="flex items-center space-x-2">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>My Profile</span>
                      </div>
                    </a>
                    <a
                      href="/settings"
                      class="block px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
                    >
                      <div class="flex items-center space-x-2">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Settings</span>
                      </div>
                    </a>
                    <div class="border-t border-gray-200 dark:border-slate-700"></div>
                    <a
                      href="/"
                      onClick$={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.removeItem("auth_token");
                          sessionStorage.removeItem("auth_user");
                        }
                      }}
                      class="block px-4 py-3 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <div class="flex items-center space-x-2">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <div class="border-t border-white/20 p-4 dark:border-slate-700/20">
              <button
                onClick$={toggleSidebar}
                class="flex w-full items-center justify-center rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                title={
                  sidebarState.isExpanded
                    ? "Contraer sidebar"
                    : "Expandir sidebar"
                }
              >
                <svg
                  class={`h-6 w-6 transition-transform duration-300 ${
                    sidebarState.isExpanded ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarState.isMobileOpen && (
            <div
              class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick$={toggleMobileSidebar}
            ></div>
          )}

          {/* Mobile Sidebar */}
          <aside
            class={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/20 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden dark:border-slate-700/20 dark:bg-slate-900/95 ${
              sidebarState.isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Logo/Brand */}
            <div class="flex h-16 items-center justify-between border-b border-white/20 px-4 dark:border-slate-700/20">
              <a href="/" class="group flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                  <svg
                    class="h-6 w-6 text-white"
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
                </div>
                <div>
                  <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300">
                    SIRME
                  </h1>
                  <p class="-mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Time Recording System
                  </p>
                </div>
              </a>
              <button
                onClick$={toggleMobileSidebar}
                class="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  class={`group relative flex items-center space-x-3 rounded-xl px-3 py-3 font-medium transition-all duration-200 ${
                    currentPath.value === item.path
                      ? "border-l-4 border-blue-400 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                  }`}
                  onClick$={toggleMobileSidebar}
                >
                  <span
                    class={`transition-colors duration-200 ${
                      currentPath.value === item.path
                        ? "text-white"
                        : "text-gray-500 group-hover:text-blue-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div class="flex-1">
                    <div class="text-sm font-semibold">{item.label}</div>
                    <div
                      class={`text-xs ${
                        currentPath.value === item.path
                          ? "text-white/80"
                          : "text-gray-400"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </a>
              ))}
            </nav>

            {/* Mobile User Info */}
            {sidebarState.userData && (
              <div class="border-t border-white/20 p-4 dark:border-slate-700/20">
                <div class="flex items-center space-x-3">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                    <span class="text-sm font-bold text-white">
                      {sidebarState.userData.first_name?.[0] || "U"}
                      {sidebarState.userData.last_name?.[0] || ""}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {sidebarState.userData.first_name} {sidebarState.userData.last_name}
                    </p>
                    <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                      {sidebarState.userData.role?.role_name || "Empleado"}
                    </p>
                  </div>
                  <a
                    href="/"
                    onClick$={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.removeItem("auth_token");
                        sessionStorage.removeItem("auth_user");
                      }
                    }}
                    class="rounded-xl p-2 text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Cerrar sesión"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div class="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar for Mobile */}
        {sidebarState.isAuthenticated && (
          <header class="flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-4 backdrop-blur-xl md:hidden dark:border-slate-700/20 dark:bg-slate-900/80">
            <button
              onClick$={toggleMobileSidebar}
              class="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300">
              SIRME
            </h1>
            <div class="w-10"></div>
          </header>
        )}

        {/* Page Content */}
        <main class="flex-1 overflow-y-auto">
          <Slot />
        </main>
      </div>
    </div>
  );
});
