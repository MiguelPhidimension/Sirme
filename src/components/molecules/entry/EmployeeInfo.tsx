import {
  component$,
  type QRL,
  useVisibleTask$,
  useSignal,
} from "@builder.io/qwik";
import { LuUser } from "@qwikest/icons/lucide";
import { getCurrentUser } from "~/utils/auth";
import { graphqlClient } from "~/graphql/client";

interface EmployeeInfoProps {
  employeeName: string;
  employeeId?: string;
  role: string;
  disabled?: boolean;
  onNameChange: QRL<(name: string) => void>;
  onEmployeeIdChange: QRL<(userId: string) => void>;
  onRoleChange: QRL<(role: string) => void>;
}

const GET_ROLE_BY_ID = `
  query GetRoleById($role_id: uuid!) {
    roles_by_pk(role_id: $role_id) {
      role_id
      role_name
      description
    }
  }
`;

/**
 * EmployeeInfo - Molecule component for employee information
 * Displays the current session user's name and role
 */
export const EmployeeInfo = component$<EmployeeInfoProps>(
  ({
    employeeName,
    role,
    disabled = false,
    onNameChange,
    onEmployeeIdChange,
    onRoleChange,
  }) => {
    const isLoading = useSignal(true);
    const roleApplication = useSignal<string>("");

    // Load current user from session on component mount
    useVisibleTask$(async () => {
      const currentUser = getCurrentUser();

      if (currentUser) {

        // Set user information from session
        const fullName = `${currentUser.first_name} ${currentUser.last_name}`;
        roleApplication.value = currentUser.role_application || "colaborador";
        await onEmployeeIdChange(currentUser.user_id);
        await onNameChange(fullName);

        // Fetch role using role_id
        if (currentUser.role_id) {
          try {
            const roleResponse = await graphqlClient.request<{
              roles_by_pk: {
                role_id: string;
                role_name: string;
                description?: string;
              } | null;
            }>(GET_ROLE_BY_ID, {
              role_id: currentUser.role_id,
            });

            if (roleResponse.roles_by_pk) {
              await onRoleChange(roleResponse.roles_by_pk.role_name);
            } else {
              await onRoleChange("N/A");
            }
          } catch (error) {
            console.error("Error fetching role:", error);
            await onRoleChange("N/A");
          }
        } else {
          await onRoleChange("N/A");
        }

        isLoading.value = false;
      }
    });

    return (
      <div
        class={`rounded-2xl border border-white/20 bg-gradient-to-br from-white/95 to-white/85 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 dark:border-slate-700/20 dark:bg-gradient-to-br dark:from-slate-800/95 dark:to-slate-900/85 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {/* Header with icon */}
        <div class="mb-6 flex items-center space-x-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20">
            <LuUser class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 class="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Current User
            </h2>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {employeeName || "Loading..."}
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div class="flex flex-col space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Technical Role:
            </span>
            <span class="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-700 shadow-sm dark:from-purple-900/30 dark:to-purple-800/20 dark:text-purple-300">
              {role || "N/A"}
            </span>
          </div>
          {roleApplication.value && (
            <div class="flex items-center space-x-2">
              <span class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                App Role:
              </span>
              <span class="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 capitalize shadow-sm dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-300">
                {roleApplication.value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);
