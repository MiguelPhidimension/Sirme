import { component$, type QRL, type JSXOutput } from "@builder.io/qwik";
import {
  SidebarLogo,
  SidebarNavItem,
  SidebarUserProfile,
  SidebarToggleButton,
} from "~/components/molecules";

interface NavItem {
  path: string;
  label: string;
  icon: JSXOutput;
  description: string;
}

interface DesktopSidebarProps {
  isExpanded: boolean;
  currentPath: string;
  navItems: NavItem[];
  userData: any;
  onToggle$: QRL<() => void>;
  onLogout$: QRL<() => void>;
}

/**
 * DesktopSidebar - Organism component for desktop sidebar navigation
 * Contains logo, navigation items, user profile, and toggle button
 */
export const DesktopSidebar = component$<DesktopSidebarProps>(
  ({ isExpanded, currentPath, navItems, userData, onToggle$, onLogout$ }) => {
    return (
      <aside
        class={`hidden flex-col overflow-visible border-r border-white/20 bg-white/80 backdrop-blur-xl transition-all duration-300 md:flex dark:border-slate-700/20 dark:bg-slate-900/80 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Logo/Brand */}
        <div class="flex h-16 items-center border-b border-white/20 px-4 dark:border-slate-700/20">
          <SidebarLogo isExpanded={isExpanded} />
        </div>

        {/* Navigation */}
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              description={item.description}
              isActive={currentPath === item.path}
              isExpanded={isExpanded}
            />
          ))}
        </nav>

        {/* User Profile */}
        {userData && (
          <div class="overflow-visible border-t border-white/20 p-4 dark:border-slate-700/20">
            <SidebarUserProfile
              userData={userData}
              isExpanded={isExpanded}
              onLogout$={onLogout$}
            />
          </div>
        )}

        {/* Toggle Button */}
        <div class="border-t border-white/20 p-4 dark:border-slate-700/20">
          <SidebarToggleButton isExpanded={isExpanded} onToggle$={onToggle$} />
        </div>
      </aside>
    );
  },
);
