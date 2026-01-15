import { component$ } from "@builder.io/qwik";

interface ProjectBreakdown {
  projectCode: string;
  projectName: string;
  totalHours: number;
  percentage: number;
  status: string;
}

interface ProjectBreakdownTableProps {
  projects: ProjectBreakdown[];
}

/**
 * ProjectBreakdownTable - Organism component for project breakdown table
 * Displays detailed breakdown of hours per project with percentages and status
 */
export const ProjectBreakdownTable = component$<ProjectBreakdownTableProps>(
  ({ projects }) => {
    return (
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-6 flex items-center space-x-3">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Project Breakdown
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Project
                </th>
                <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Hours
                </th>
                <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Percentage
                </th>
                <th class="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th class="no-print pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.projectCode}
                  class="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50"
                >
                  <td class="py-4">
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">
                        {project.projectName}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {project.projectCode}
                      </div>
                    </div>
                  </td>
                  <td class="py-4 font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {project.totalHours}h
                  </td>
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                          style={`width: ${project.percentage}%`}
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {project.percentage}%
                      </span>
                    </div>
                  </td>
                  <td class="py-4">
                    <span
                      class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td class="no-print py-4">
                    <button class="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);
