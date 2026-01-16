import { component$, type QRL, Resource } from "@builder.io/qwik";
import { LuUser } from "@qwikest/icons/lucide";
import { useUsers } from "~/graphql/hooks/useUsers";

interface EmployeeInfoProps {
  employeeName: string;
  employeeId?: string;
  role: string;
  onNameChange: QRL<(name: string) => void>;
  onEmployeeIdChange: QRL<(userId: string) => void>;
  onRoleChange: QRL<(role: string) => void>;
}

/**
 * EmployeeInfo - Molecule component for employee information
 * Displays name and role input fields
 */
export const EmployeeInfo = component$<EmployeeInfoProps>(
  ({ employeeId, role, onNameChange, onEmployeeIdChange, onRoleChange }) => {
    // Load users from database
    const usersResource = useUsers();

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
            <Resource
              value={usersResource}
              onPending={() => (
                <select
                  disabled
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option>Loading users...</option>
                </select>
              )}
              onRejected={(error) => (
                <div class="text-sm text-red-600 dark:text-red-400">
                  Error loading users: {error.message}
                </div>
              )}
              onResolved={(data) => {
                console.log("📋 EmployeeInfo: Users resolved:", data);
                return (
                  <select
                    value={employeeId || ""}
                    onChange$={(e) => {
                      const selectedId = (e.target as HTMLSelectElement).value;
                      const selectedUser = data.users.find(
                        (u) => u.user_id === selectedId,
                      );

                      if (selectedUser) {
                        console.log("👤 Selected user:", selectedUser);
                        console.log("🎭 User role:", selectedUser.role);

                        const fullName = `${selectedUser.first_name} ${selectedUser.last_name}`;
                        onEmployeeIdChange(selectedId);
                        onNameChange(fullName);

                        // Update role if available
                        if (selectedUser.role) {
                          console.log(
                            "✅ Setting role to:",
                            selectedUser.role.role_name,
                          );
                          onRoleChange(selectedUser.role.role_name);
                        } else {
                          console.log("❌ No role found, setting N/A");
                          onRoleChange("N/A");
                        }
                      }
                    }}
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select an employee...</option>
                    {data.users.length === 0 ? (
                      <option disabled>No users found</option>
                    ) : (
                      data.users.map((user) => {
                        const displayText = `${user.first_name} ${user.last_name}`;
                        return (
                          <option key={user.user_id} value={user.user_id}>
                            {displayText}
                          </option>
                        );
                      })
                    )}
                  </select>
                );
              }}
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
              placeholder="Select a user to see their role"
            />
          </div>
        </div>
      </div>
    );
  },
);
