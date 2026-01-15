import { component$, type QRL } from "@builder.io/qwik";

interface SidebarUserProfileProps {
  userData: {
    first_name?: string;
    last_name?: string;
    role?: {
      role_name?: string;
    };
  };
  isExpanded: boolean;
  onLogout$: QRL<() => void>;
}

/**
 * SidebarUserProfile - Molecule component for user profile in sidebar
 * Displays user info with dropdown menu for profile, settings, and logout
 */
export const SidebarUserProfile = component$<SidebarUserProfileProps>(
  ({ userData, isExpanded, onLogout$ }) => {
    return (
      <div class="group relative">
        <div class="flex cursor-pointer items-center space-x-3">
          <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg transition-all duration-200 hover:shadow-xl">
            <span class="text-sm font-bold text-white">
              {userData.first_name?.[0] || "U"}
              {userData.last_name?.[0] || ""}
            </span>
          </div>
          {isExpanded && (
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {userData.first_name} {userData.last_name}
              </p>
              <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                {userData.role?.role_name || "Employee"}
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
            onClick$={onLogout$}
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
    );
  },
);
