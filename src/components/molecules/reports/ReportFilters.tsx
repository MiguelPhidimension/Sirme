import { component$, type QRL, type Signal } from "@builder.io/qwik";
import { LuSliders } from "@qwikest/icons/lucide";

interface PeriodOption {
  value: string;
  label: string;
}

interface ReportFiltersProps {
  selectedPeriod: Signal<"week" | "month" | "quarter" | "year">;
  selectedEmployee: Signal<string>;
  selectedProject: Signal<string>;
  periodOptions: PeriodOption[];
  employeeOptions?: { value: string; label: string }[];
  projectOptions?: { value: string; label: string }[];
  onPeriodChange$: QRL<(period: "week" | "month" | "quarter" | "year") => void>;
}

/**
 * ReportFilters - Molecule component for report filter controls
 * Displays period, employee, and project selectors
 */
export const ReportFilters = component$<ReportFiltersProps>(
  ({
    selectedPeriod,
    selectedEmployee,
    selectedProject,
    periodOptions,
    employeeOptions = [],
    projectOptions = [],
    onPeriodChange$,
  }) => {
    return (
      <div class="no-print rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-4 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
            <LuSliders class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Report Filters
          </h2>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Period selector */}
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Period
            </label>
            <select
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={selectedPeriod.value}
              onChange$={(e) =>
                onPeriodChange$((e.target as HTMLSelectElement).value as any)
              }
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
