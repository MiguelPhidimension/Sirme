import { $, component$, useSignal } from "@builder.io/qwik";
import {
  LuBarChart3,
  LuChevronDown,
  LuChevronRight,
} from "@qwikest/icons/lucide";

interface UserInProject {
  userId: string;
  userName: string;
  hours: number;
  percentage: number;
}

interface ProjectBreakdown {
  projectCode: string;
  projectName: string;
  totalHours: number;
  percentage: number;
  status: string;
  users?: UserInProject[];
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
    const expandedProject = useSignal<string | null>(null);

    const toggleProject = $((projectCode: string) => {
      expandedProject.value =
        expandedProject.value === projectCode ? null : projectCode;
    });

    return (
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-6 flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
            <LuBarChart3 class="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
                <th class="no-print pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <>
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
                          {project.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td class="no-print py-4">
                      <button
                        onClick$={() => toggleProject(project.projectCode)}
                        class="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {expandedProject.value === project.projectCode ? (
                          <LuChevronDown class="h-4 w-4" />
                        ) : (
                          <LuChevronRight class="h-4 w-4" />
                        )}
                        Details
                      </button>
                    </td>
                  </tr>

                  {/* Expanded User Details Row */}
                  {expandedProject.value === project.projectCode &&
                    project.users &&
                    project.users.length > 0 && (
                      <tr key={`${project.projectCode}-details`}>
                        <td
                          colSpan={4}
                          class="bg-gray-50 p-0 dark:bg-slate-700/30"
                        >
                          <div class="px-8 py-4">
                            <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Team Members
                            </h4>
                            <table class="w-full">
                              <thead>
                                <tr class="border-b border-gray-200 dark:border-slate-600">
                                  <th class="pb-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Name
                                  </th>
                                  <th class="pb-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Hours
                                  </th>
                                  <th class="pb-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Percentage
                                  </th>
                                  <th class="no-print pb-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {project.users.map((user) => (
                                  <tr
                                    key={user.userId}
                                    class="border-b border-gray-100 last:border-0 dark:border-slate-600/50"
                                  >
                                    <td class="py-2 text-sm text-gray-800 dark:text-gray-200">
                                      {user.userName}
                                    </td>
                                    <td class="py-2 font-mono text-sm text-gray-800 dark:text-gray-200">
                                      {user.hours.toFixed(1)}h
                                    </td>
                                    <td class="py-2">
                                      <div class="flex items-center gap-2">
                                        <div class="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
                                          <div
                                            class="h-full rounded-full bg-blue-500 transition-all duration-300"
                                            style={`width: ${user.percentage}%`}
                                          ></div>
                                        </div>
                                        <span class="text-xs text-gray-700 dark:text-gray-300">
                                          {user.percentage.toFixed(1)}%
                                        </span>
                                      </div>
                                    </td>
                                    <td class="no-print py-2">
                                      <button class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        View Details →
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);
