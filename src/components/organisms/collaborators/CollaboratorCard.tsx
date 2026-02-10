import { component$, type QRL } from "@builder.io/qwik";
import {
  LuBriefcase,
  LuChevronRight,
  LuClock,
  LuCalendar,
  LuTrendingUp,
} from "@qwikest/icons/lucide";
import type { CollaboratorData } from "~/graphql/hooks/useCollaborators";

interface CollaboratorCardProps {
  collaborator: CollaboratorData;
  onViewDetails$: QRL<(collaborator: CollaboratorData) => void>;
}

/**
 * CollaboratorCard - Organism component for displaying a single collaborator
 * Shows avatar, name, role, key stats, and a view details button
 */
export const CollaboratorCard = component$<CollaboratorCardProps>(
  ({ collaborator, onViewDetails$ }) => {
    const initials =
      `${collaborator.firstName[0] || ""}${collaborator.lastName[0] || ""}`
        .toUpperCase()
        .slice(0, 2);

    return (
      <div
        class="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl dark:border-slate-700/20 dark:bg-slate-800/90"
        onClick$={() => onViewDetails$(collaborator)}
      >
        {/* Gradient accent */}
        <div class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          {/* Avatar & Info */}
          <div class="flex items-center gap-4 lg:min-w-[250px]">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
              {initials}
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {collaborator.fullName}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {collaborator.role}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {collaborator.email}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div class="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Total Hours */}
            <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div class="flex items-center gap-2">
                <LuClock class="h-4 w-4 text-emerald-500" />
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Hours
                </span>
              </div>
              <p class="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {collaborator.totalHours}
              </p>
            </div>

            {/* Days Worked */}
            <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div class="flex items-center gap-2">
                <LuCalendar class="h-4 w-4 text-blue-500" />
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Days
                </span>
              </div>
              <p class="mt-1 font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                {collaborator.totalDaysWorked}
              </p>
            </div>

            {/* Avg Daily */}
            <div class="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-3 dark:from-amber-900/20 dark:to-orange-900/20">
              <div class="flex items-center gap-2">
                <LuTrendingUp class="h-4 w-4 text-amber-500" />
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Avg/day
                </span>
              </div>
              <p class="mt-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                {collaborator.avgDailyHours}h
              </p>
            </div>

            {/* Projects */}
            <div class="rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 p-3 dark:from-purple-900/20 dark:to-fuchsia-900/20">
              <div class="flex items-center gap-2">
                <LuBriefcase class="h-4 w-4 text-purple-500" />
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Projects
                </span>
              </div>
              <p class="mt-1 font-mono text-xl font-bold text-purple-600 dark:text-purple-400">
                {collaborator.activeProjects}
              </p>
            </div>
          </div>

          {/* Action indicator */}
          <div class="no-print flex-shrink-0">
            <div class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg lg:w-auto">
              View details
              <LuChevronRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
