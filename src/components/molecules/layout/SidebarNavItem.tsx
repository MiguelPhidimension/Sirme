import { component$, type JSXOutput } from "@builder.io/qwik";

interface SidebarNavItemProps {
  path: string;
  label: string;
  icon: JSXOutput;
  description: string;
  isActive: boolean;
  isExpanded: boolean;
}

/**
 * SidebarNavItem - Molecule component for sidebar navigation item
 * Displays a single navigation link with icon and label
 */
export const SidebarNavItem = component$<SidebarNavItemProps>(
  ({ path, label, icon, description, isActive, isExpanded }) => {
    return (
      <a
        href={path}
        class={`group relative flex items-center rounded-xl px-3 py-3 font-medium transition-all duration-200 ${
          isActive
            ? "border-l-4 border-blue-400 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-white/50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
        }`}
        title={!isExpanded ? label : description}
      >
        <span
          class={`flex-shrink-0 transition-colors duration-200 ${
            isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500"
          }`}
        >
          {icon}
        </span>
        {isExpanded && <span class="ml-3 text-sm font-semibold">{label}</span>}
        {/* Active indicator */}
        {isActive && !isExpanded && (
          <div class="absolute top-1/2 -right-1 h-8 w-1 -translate-y-1/2 transform rounded-l-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
        )}
      </a>
    );
  },
);
