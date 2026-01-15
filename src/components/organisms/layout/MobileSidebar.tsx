import { component$, type QRL, type JSXOutput } from "@builder.io/qwik";
import { SidebarLogo } from "~/components/molecules";

interface NavItem {
  path: string;
  label: string;
  icon: JSXOutput;
  description: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  currentPath: string;
  navItems: NavItem[];
  userData: any;
  onClose$: QRL<() => void>;
  onLogout$: QRL<() => void>;
}

/**
 * MobileSidebar - Organism component for mobile sidebar navigation
 * Contains logo, navigation items, user info, and close button
 */
export const MobileSidebar = component$<MobileSidebarProps>(
  ({ isOpen, currentPath, navItems, userData, onClose$, onLogout$ }) => {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div
            class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick$={onClose$}
          ></div>
        )}

        {/* Mobile Sidebar */}
        <aside
          class={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/20 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden dark:border-slate-700/20 dark:bg-slate-900/95 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo/Brand */}
          <div class="flex h-16 items-center justify-between border-b border-white/20 px-4 dark:border-slate-700/20">
            <SidebarLogo isExpanded={true} />
            <button
              onClick$={onClose$}
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
                  currentPath === item.path
                    ? "border-l-4 border-blue-400 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                }`}
                onClick$={onClose$}
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
                <div class="flex-1">
                  <div class="text-sm font-semibold">{item.label}</div>
                  <div
                    class={`text-xs ${
                      currentPath === item.path
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
          {userData && (
            <div class="border-t border-white/20 p-4 dark:border-slate-700/20">
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                  <span class="text-sm font-bold text-white">
                    {userData.first_name?.[0] || "U"}
                    {userData.last_name?.[0] || ""}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {userData.first_name} {userData.last_name}
                  </p>
                  <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                    {userData.role?.role_name || "Empleado"}
                  </p>
                </div>
                <a
                  href="/"
                  onClick$={onLogout$}
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
    );
  },
);
