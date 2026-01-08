import { component$, Slot, useSignal, $ } from "@builder.io/qwik";

/**
 * MainLayout Template Component
 * Provides the main application layout structure with navigation and footer.
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
  // State for mobile menu
  const isMobileMenuOpen = useSignal(false);

  // Navigation items with modern icons
  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: (
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
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
      description: "Overview and statistics",
    },
    {
      path: "/reports",
      label: "Reports",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"
          />
        </svg>
      ),
      description: "Analytics and exports",
    },
  ];

  // Get current path for active navigation highlighting
  const currentPath = globalThis?.location?.pathname || "/";

  const toggleMobileMenu = $(() => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Top Navigation */}
      <nav class="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl dark:border-slate-700/20 dark:bg-slate-900/80">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div class="flex items-center space-x-3">
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
                <div class="hidden sm:block">
                  <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-gray-300">
                    TimeTracker
                  </h1>
                  <p class="-mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Professional Time Management
                  </p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div class="hidden items-center space-x-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  class={`group relative flex items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                    currentPath === item.path
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                  }`}
                  title={item.description}
                >
                  <span
                    class={`transition-colors duration-200 ${
                      currentPath === item.path
                        ? "text-white"
                        : "text-gray-500 group-hover:text-blue-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span class="text-sm font-semibold">{item.label}</span>

                  {/* Active indicator */}
                  {currentPath === item.path && (
                    <div class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-white shadow-md"></div>
                  )}
                </a>
              ))}
            </div>

            {/* Right side controls */}
            <div class="flex items-center space-x-4">
              {/* User Profile with Dropdown */}
              <div class="group relative">
                <div class="flex cursor-pointer items-center space-x-3">
                  <div class="hidden text-right lg:block">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {typeof window !== "undefined" &&
                      sessionStorage.getItem("auth_user")
                        ? JSON.parse(
                            sessionStorage.getItem("auth_user") || "{}",
                          ).first_name +
                          " " +
                          JSON.parse(
                            sessionStorage.getItem("auth_user") || "{}",
                          ).last_name
                        : "Usuario"}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {typeof window !== "undefined" &&
                      sessionStorage.getItem("auth_user")
                        ? JSON.parse(
                            sessionStorage.getItem("auth_user") || "{}",
                          ).role?.role_name || "Empleado"
                        : "Empleado"}
                    </p>
                  </div>
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg transition-all duration-200 hover:shadow-xl">
                    <span class="text-sm font-bold text-white">
                      {typeof window !== "undefined" &&
                      sessionStorage.getItem("auth_user")
                        ? (JSON.parse(
                            sessionStorage.getItem("auth_user") || "{}",
                          ).first_name?.[0] || "U") +
                          (JSON.parse(
                            sessionStorage.getItem("auth_user") || "{}",
                          ).last_name?.[0] || "")
                        : "U"}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div class="invisible absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800">
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
                      <span>Mi Perfil</span>
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
                      <span>Configuración</span>
                    </div>
                  </a>
                  <div class="border-t border-gray-200 dark:border-slate-700"></div>
                  <a
                    href="/login"
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
                      <span>Cerrar Sesión</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                class="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/50 hover:text-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                onClick$={toggleMobileMenu}
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
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen.value && (
          <div class="border-t border-white/20 bg-white/95 backdrop-blur-xl md:hidden dark:border-slate-700/20 dark:bg-slate-900/95">
            <div class="space-y-3 px-4 py-6">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  class={`flex items-center space-x-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                    currentPath === item.path
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-slate-800/50"
                  }`}
                  onClick$={() => (isMobileMenuOpen.value = false)}
                >
                  <span
                    class={`${currentPath === item.path ? "text-white" : "text-gray-500"}`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div class="font-semibold">{item.label}</div>
                    <div
                      class={`text-xs ${currentPath === item.path ? "text-white/80" : "text-gray-400"}`}
                    >
                      {item.description}
                    </div>
                  </div>
                </a>
              ))}

              {/* Mobile User Info */}
              <div class="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
                <div class="flex items-center justify-between px-4 py-2">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                      <span class="text-sm font-bold text-white">
                        {typeof window !== "undefined" &&
                        sessionStorage.getItem("auth_user")
                          ? (JSON.parse(
                              sessionStorage.getItem("auth_user") || "{}",
                            ).first_name?.[0] || "U") +
                            (JSON.parse(
                              sessionStorage.getItem("auth_user") || "{}",
                            ).last_name?.[0] || "")
                          : "U"}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {typeof window !== "undefined" &&
                        sessionStorage.getItem("auth_user")
                          ? JSON.parse(
                              sessionStorage.getItem("auth_user") || "{}",
                            ).first_name +
                            " " +
                            JSON.parse(
                              sessionStorage.getItem("auth_user") || "{}",
                            ).last_name
                          : "Usuario"}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {typeof window !== "undefined" &&
                        sessionStorage.getItem("auth_user")
                          ? JSON.parse(
                              sessionStorage.getItem("auth_user") || "{}",
                            ).role?.role_name || "Empleado"
                          : "Empleado"}
                      </p>
                    </div>
                  </div>
                  <a
                    href="/login"
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
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main class="min-h-[calc(100vh-4rem)]">
        <Slot />
      </main>

      {/* Modern Footer */}
      {/* <footer class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> */}

      {/* Brand Section */}
      {/* <div class="col-span-1 md:col-span-2">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-lg font-bold text-gray-900 dark:text-white">TimeTracker Pro</span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Professional time management solution designed for modern teams. 
                Track, analyze, and optimize your productivity with our intuitive interface.
              </p>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div> */}

      {/* Quick Links */}
      {/* <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Features</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Time Tracking</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Analytics</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Reporting</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Team Management</a></li>
              </ul>
            </div> */}

      {/* Support */}
      {/* <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Help Center</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Documentation</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">System Status</a></li>
              </ul>
            </div>
          </div> */}

      {/* Bottom Footer */}
      {/* <div class="border-t border-gray-200 dark:border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 TimeTracker Pro. All rights reserved.
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div> */}
      {/* </footer> */}
    </div>
  );
});
