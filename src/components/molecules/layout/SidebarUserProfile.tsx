import {
  component$,
  type QRL,
  useSignal,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import { LuUser, LuSettings, LuLogOut } from "@qwikest/icons/lucide";

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
    const isMenuOpen = useSignal(false);

    // Close menu when clicking outside
    useOnDocument(
      "click",
      $((event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".user-profile-container")) {
          isMenuOpen.value = false;
        }
      }),
    );

    return (
      <div class="user-profile-container group relative">
        <div
          class="flex cursor-pointer items-center space-x-3"
          onClick$={(e) => {
            e.stopPropagation();
            isMenuOpen.value = !isMenuOpen.value;
          }}
        >
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
        <div
          class={`absolute ${isExpanded ? "right-0 left-0" : "left-full ml-2"} bottom-0 z-[999999] ${isExpanded ? "" : "w-56"} overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 ${
            isMenuOpen.value
              ? "visible opacity-100"
              : "invisible opacity-0 group-hover:visible group-hover:opacity-100"
          }`}
        >
          {!isExpanded && (
            <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {userData.first_name} {userData.last_name}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {userData.role?.role_name || "Employee"}
              </p>
            </div>
          )}
          <a
            href="/profile"
            class="block px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
            onClick$={() => (isMenuOpen.value = false)}
          >
            <div class="flex items-center space-x-2">
              <LuUser class="h-4 w-4" />
              <span>My Profile</span>
            </div>
          </a>
          <a
            href="/settings"
            class="block px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
            onClick$={() => (isMenuOpen.value = false)}
          >
            <div class="flex items-center space-x-2">
              <LuSettings class="h-4 w-4" />
              <span>Settings</span>
            </div>
          </a>
          <div class="border-t border-gray-200 dark:border-slate-700"></div>
          <a
            href="/"
            onClick$={() => {
              isMenuOpen.value = false;
              onLogout$();
            }}
            class="block px-4 py-3 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <div class="flex items-center space-x-2">
              <LuLogOut class="h-4 w-4" />
              <span>Logout</span>
            </div>
          </a>
        </div>
      </div>
    );
  },
);
