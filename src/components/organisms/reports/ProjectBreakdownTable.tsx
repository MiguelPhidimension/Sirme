import { $, component$, useSignal, type QRL } from "@builder.io/qwik";
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

export interface UserDetailsParams {
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
}

interface ProjectBreakdownTableProps {
  projects: ProjectBreakdown[];
  onUserDetailsClick$?: QRL<(params: UserDetailsParams) => void>;
}

/**
 * ProjectBreakdownTable - Organism component for project breakdown table
 * Displays detailed breakdown of hours per project with percentages and status
 */
export const ProjectBreakdownTable = component$<ProjectBreakdownTableProps>(
  ({ projects, onUserDetailsClick$ }) => {
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
                        <td colSpan={4} class="p-0">
                          <div class="animate-[slideDown_0.3s_ease-out] bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-slate-800/40">
                            <div class="px-8 py-6">
                              <div class="mb-4 flex items-center gap-3">
                                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                  <svg
                                    class="h-4 w-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                </div>
                                <h4 class="text-base font-bold text-gray-900 dark:text-white">
                                  Team Members
                                </h4>
                                <span class="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                  {project.users.length}{" "}
                                  {project.users.length === 1
                                    ? "member"
                                    : "members"}
                                </span>
                              </div>

                              <div class="grid gap-3">
                                {project.users.map((user, idx) => (
                                  <div
                                    key={user.userId}
                                    class="group relative overflow-hidden rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-slate-600/40 dark:bg-slate-700/50"
                                    style={`animation: fadeInUp 0.3s ease-out ${idx * 0.05}s both`}
                                  >
                                    {/* Gradient accent line */}
                                    <div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    <div class="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-4">
                                      {/* Name */}
                                      <div class="flex items-center gap-3">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-md">
                                          {user.userName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                        </div>
                                        <div>
                                          <p class="font-semibold text-gray-900 dark:text-white">
                                            {user.userName}
                                          </p>
                                          <p class="text-xs text-gray-500 dark:text-gray-400">
                                            Team Member
                                          </p>
                                        </div>
                                      </div>

                                      {/* Hours */}
                                      <div class="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-2 dark:from-emerald-900/20 dark:to-teal-900/20">
                                        <div class="text-center">
                                          <p class="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {user.hours.toFixed(1)}
                                          </p>
                                          <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            hours
                                          </p>
                                        </div>
                                      </div>

                                      {/* Percentage bar */}
                                      <div class="flex flex-col gap-1">
                                        <div class="flex items-center justify-between">
                                          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Contribution
                                          </span>
                                          <span class="text-sm font-bold text-gray-900 dark:text-white">
                                            {user.percentage.toFixed(1)}%
                                          </span>
                                        </div>
                                        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
                                          <div
                                            class="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 transition-all duration-500 ease-out"
                                            style={`width: ${user.percentage}%`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* Action button */}
                                      <div class="no-print">
                                        <button
                                          onClick$={() => {
                                            if (onUserDetailsClick$) {
                                              onUserDetailsClick$({
                                                userId: user.userId,
                                                userName: user.userName,
                                                projectId: project.projectCode,
                                                projectName: project.projectName,
                                              });
                                            }
                                          }}
                                          class="group/btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        >
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
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                          </svg>
                                          <span>View Calendar</span>
                                          <svg
                                            class="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M9 5l7 7-7 7"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
