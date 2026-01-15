import { component$, type QRL } from "@builder.io/qwik";

interface EmployeeInfoProps {
  employeeName: string;
  role: string;
  onNameChange: QRL<(name: string) => void>;
  onRoleChange: QRL<(role: string) => void>;
}

/**
 * EmployeeInfo - Molecule component for employee information
 * Displays name and role input fields
 */
export const EmployeeInfo = component$<EmployeeInfoProps>(
  ({ employeeName, role, onNameChange, onRoleChange }) => {
    return (
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
            <svg
              class="h-5 w-5 text-purple-600 dark:text-purple-400"
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
              onInput$={(e) =>
                onNameChange((e.target as HTMLInputElement).value)
              }
              placeholder="Enter your name"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange$={(e) =>
                onRoleChange((e.target as HTMLSelectElement).value)
              }
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="MuleSoft Developer">MuleSoft Developer</option>
              <option value="Java Developer">Java Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    );
  },
);
