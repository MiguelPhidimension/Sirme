import { component$, type Signal, type QRL } from "@builder.io/qwik";
import { LuSliders, LuX } from "@qwikest/icons/lucide";

interface ReportFiltersProps {
  startDate: Signal<string>;
  endDate: Signal<string>;
  selectedEmployee: Signal<string>;
  selectedProject: Signal<string>;
  employeeOptions?: { value: string; label: string }[];
  projectOptions?: { value: string; label: string }[];
  onClearFilters$?: QRL<() => void>;
}

/**
 * ReportFilters - Molecule component for report filter controls
 * Displays date range, employee, and project selectors
 */
export const ReportFilters = component$<ReportFiltersProps>(
  ({
    startDate,
    endDate,
    selectedEmployee,
    selectedProject,
    employeeOptions = [],
    projectOptions = [],
    onClearFilters$,
  }) => {
    return (
      <div class="no-print rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <LuSliders class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Report Filters
            </h2>
          </div>
          {onClearFilters$ && (
            <button
              onClick$={onClearFilters$}
              class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <LuX class="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Start Date */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={startDate.value}
              onChange$={(e) =>
                (startDate.value = (e.target as HTMLInputElement).value)
              }
            />
          </div>

          {/* End Date */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={endDate.value}
              onChange$={(e) =>
                (endDate.value = (e.target as HTMLInputElement).value)
              }
            />
          </div>

          {/* Employee selector */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee
            </label>
            <select
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={selectedEmployee.value}
              onChange$={(e) =>
                (selectedEmployee.value = (e.target as HTMLSelectElement).value)
              }
            >
              <option value="all">All Employees</option>
              {employeeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project selector */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <select
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={selectedProject.value}
              onChange$={(e) =>
                (selectedProject.value = (e.target as HTMLSelectElement).value)
              }
            >
              <option value="all">All Projects</option>
              {projectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  },
);
