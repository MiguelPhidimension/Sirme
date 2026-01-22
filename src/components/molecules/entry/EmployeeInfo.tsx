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
  ({ employeeName, role, onNameChange, onEmployeeIdChange, onRoleChange }) => {
    const isLoading = useSignal(true);

    // Load current user from session on component mount
    useVisibleTask$(async () => {
      const currentUser = getCurrentUser();

      if (currentUser) {
        console.log("👤 Current session user:", currentUser);

        // Set user information from session
        const fullName = `${currentUser.first_name} ${currentUser.last_name}`;
        await onEmployeeIdChange(currentUser.user_id);
        await onNameChange(fullName);

        // Fetch role using role_id
        if (currentUser.role_id) {
          try {
            const roleResponse = await graphqlClient.request<{
              roles_by_pk: { role_id: string; role_name: string; description?: string } | null;
            }>(GET_ROLE_BY_ID, {
              role_id: currentUser.role_id,
            });

            if (roleResponse.roles_by_pk) {
              console.log("🎭 User role:", roleResponse.roles_by_pk.role_name);
              await onRoleChange(roleResponse.roles_by_pk.role_name);
            } else {
              console.log("❌ No role found for role_id:", currentUser.role_id);
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
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
            <LuUser class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Employee Information
          </h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee Name
            </label>
            <input
              type="text"
              value={employeeName}
              disabled
              class="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              placeholder="Loading user..."
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <input
              type="text"
              value={role}
              disabled
              class="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-gray-400"
              placeholder="Loading role..."
            />
          </div>
        </div>
      </div>
    );
  },
);
