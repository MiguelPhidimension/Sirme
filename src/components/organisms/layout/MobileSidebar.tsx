import { component$, type QRL, type JSXOutput } from "@builder.io/qwik";
import { LuX } from "@qwikest/icons/lucide";
import { SidebarLogo, SidebarUserProfile } from "~/components/molecules";

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
            class="fixed inset-0 z-1 bg-black/50 backdrop-blur-sm md:hidden"
            onClick$={onClose$}
          ></div>
        )}

        {/* Mobile Sidebar */}
        <aside
          class={`fixed inset-y-0 left-0 z-1 w-64 transform border-r border-white/20 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden dark:border-slate-700/20 dark:bg-slate-900/95 ${
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
              <LuX class="h-6 w-6" />
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

          {/* User Profile */}
          {userData && (
            <div class="overflow-visible border-t border-white/20 p-4 dark:border-slate-700/20">
              <SidebarUserProfile
                userData={userData}
                isExpanded={true}
                onLogout$={onLogout$}
              />
            </div>
          )}
        </aside>
      </>
    );
  },
);
