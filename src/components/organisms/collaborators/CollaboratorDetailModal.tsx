import {
  component$,
  type QRL,
  type ReadonlySignal,
  type Signal,
} from "@builder.io/qwik";
import {
  LuX,
  LuClock,
  LuCalendar,
  LuTrendingUp,
  LuBriefcase,
  LuMail,
  LuUser,
  LuPalmtree,
  LuStar,
  LuBarChart3,
  LuPieChart,
  LuTarget,
} from "@qwikest/icons/lucide";
import type { CollaboratorData } from "~/graphql/hooks/useCollaborators";
import { CollaboratorCalendar } from "./CollaboratorCalendar";

interface CollaboratorDetailModalProps {
  isOpen: Signal<boolean>;
  collaborator: Signal<CollaboratorData | null>;
  onClose$: QRL<() => void>;
  dateRange: ReadonlySignal<string>;
  filterStartDate: ReadonlySignal<string>;
  filterEndDate: ReadonlySignal<string>;
}

// Color palette for project bars
const PROJECT_COLORS = [
  {
    bar: "from-blue-500 to-indigo-600",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  {
    bar: "from-purple-500 to-fuchsia-600",
    bg: "bg-purple-100 dark:bg-purple-900/40",
    text: "text-purple-700 dark:text-purple-300",
  },
  {
    bar: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    bar: "from-amber-500 to-orange-600",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  {
    bar: "from-rose-500 to-pink-600",
    bg: "bg-rose-100 dark:bg-rose-900/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  {
    bar: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    text: "text-cyan-700 dark:text-cyan-300",
  },
];

/**
 * CollaboratorDetailModal - Organism component for detailed collaborator view
 * Shows full statistics, project breakdown, hours distribution, and participation info
 */
export const CollaboratorDetailModal = component$<CollaboratorDetailModalProps>(
  (props) => {
    if (!props.isOpen.value || !props.collaborator.value) {
      return null;
    }

    const collaborator = props.collaborator.value;
    const onClose$ = props.onClose$;
    const dateRange = props.dateRange.value;

    const initials =
      `${collaborator.firstName[0] || ""}${collaborator.lastName[0] || ""}`
        .toUpperCase()
        .slice(0, 2);

    const maxProjectHours = Math.max(
      ...collaborator.projects.map((p) => p.hours),
      1,
    );

    // Calculate expected hours (8h/day based on days worked, or 22 business days * 8h as reference)
    const expectedMonthlyHours = 22 * 8; // 176h reference
    const utilizationRate =
      expectedMonthlyHours > 0
        ? Math.min(
            parseFloat(
              ((collaborator.totalHours / expectedMonthlyHours) * 100).toFixed(
                1,
              ),
            ),
            100,
          )
        : 0;

    // Determine performance status
    const getPerformanceStatus = (hours: number) => {
      if (hours >= 160)
        return {
          label: "Excellent",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
        };
      if (hours >= 120)
        return {
          label: "Good",
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
        };
      if (hours >= 80)
        return {
          label: "Average",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900/30",
        };
      return {
        label: "Low",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-100 dark:bg-rose-900/30",
      };
    };

    const performance = getPerformanceStatus(collaborator.totalHours);

    return (
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick$={(e) => {
          if ((e.target as HTMLElement).classList.contains("fixed")) {
            onClose$();
          }
        }}
      >
        <div class="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-2xl dark:border-slate-700/20 dark:bg-slate-800">
          {/* Close Button */}
          <button
            onClick$={onClose$}
            class="absolute top-4 right-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <LuX class="h-5 w-5" />
          </button>

          {/* Header */}
          <div class="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 text-white">
            <div class="flex items-center gap-5">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold shadow-lg backdrop-blur-sm">
                {initials}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <h2 class="text-2xl font-bold">{collaborator.fullName}</h2>
                  <span
                    class={`rounded-full px-3 py-0.5 text-xs font-bold ${performance.bg} ${performance.color}`}
                  >
                    {performance.label}
                  </span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-white/80">
                  <LuUser class="h-4 w-4" />
                  <span>{collaborator.role}</span>
                </div>
                <div class="mt-1 flex items-center gap-2 text-white/70">
                  <LuMail class="h-4 w-4" />
                  <span class="text-sm">{collaborator.email}</span>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {dateRange}
                  </span>
                  <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {collaborator.activeProjects}{" "}
                    {collaborator.activeProjects === 1 ? "project" : "projects"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div class="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5">
            <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center dark:from-emerald-900/20 dark:to-teal-900/20">
              <LuClock class="mx-auto h-5 w-5 text-emerald-500" />
              <p class="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {collaborator.totalHours}h
              </p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Total Hours
              </p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center dark:from-blue-900/20 dark:to-indigo-900/20">
              <LuCalendar class="mx-auto h-5 w-5 text-blue-500" />
              <p class="mt-1 font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                {collaborator.totalDaysWorked}
              </p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Days Worked
              </p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center dark:from-amber-900/20 dark:to-orange-900/20">
              <LuTrendingUp class="mx-auto h-5 w-5 text-amber-500" />
              <p class="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                {collaborator.avgDailyHours}h
              </p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Avg/Day
              </p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 text-center dark:from-purple-900/20 dark:to-fuchsia-900/20">
              <LuBriefcase class="mx-auto h-5 w-5 text-purple-500" />
              <p class="mt-1 font-mono text-2xl font-bold text-purple-600 dark:text-purple-400">
                {collaborator.activeProjects}
              </p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Projects
              </p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 p-4 text-center dark:from-cyan-900/20 dark:to-sky-900/20">
              <LuTarget class="mx-auto h-5 w-5 text-cyan-500" />
              <p class="mt-1 font-mono text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {utilizationRate}%
              </p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Utilization
              </p>
            </div>
          </div>

          {/* PTO & Holidays + Utilization bar */}
          <div class="mx-6 mb-4 space-y-3">
            {/* Utilization progress bar */}
            <div class="rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-slate-700/50 dark:bg-slate-700/30">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly utilization (ref. {expectedMonthlyHours}h)
                </span>
                <span class="font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {collaborator.totalHours}h / {expectedMonthlyHours}h
                </span>
              </div>
              <div class="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
                <div
                  class={`h-full rounded-full transition-all duration-700 ease-out ${
                    utilizationRate >= 90
                      ? "bg-gradient-to-r from-emerald-500 to-green-500"
                      : utilizationRate >= 60
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : utilizationRate >= 40
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-rose-500 to-pink-500"
                  }`}
                  style={`width: ${utilizationRate}%`}
                ></div>
              </div>
            </div>

            {/* PTO & Holidays badges */}
            {(collaborator.ptoHours > 0 || collaborator.holidayHours > 0) && (
              <div class="flex gap-3">
                {collaborator.ptoHours > 0 && (
                  <div class="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 dark:bg-orange-900/20">
                    <LuPalmtree class="h-4 w-4 text-orange-500" />
                    <span class="text-sm font-medium text-orange-700 dark:text-orange-400">
                      PTO: {collaborator.ptoHours}h
                    </span>
                  </div>
                )}
                {collaborator.holidayHours > 0 && (
                  <div class="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 dark:bg-rose-900/20">
                    <LuStar class="h-4 w-4 text-rose-500" />
                    <span class="text-sm font-medium text-rose-700 dark:text-rose-400">
                      Holidays: {collaborator.holidayHours}h
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hours Distribution - Visual bar chart */}
          {collaborator.projects.length > 0 && (
            <div class="mx-6 mb-4 rounded-xl border border-gray-100 bg-gray-50/80 p-5 dark:border-slate-700/50 dark:bg-slate-700/30">
              <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <LuPieChart class="h-4 w-4 text-purple-500" />
                Hours Distribution
              </h3>
              <div class="flex h-6 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
                {collaborator.projects.map((project, idx) => {
                  const colorSet = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                  return (
                    <div
                      key={project.projectId}
                      class={`h-full bg-gradient-to-r ${colorSet.bar} transition-all duration-500`}
                      style={`width: ${project.percentage}%`}
                      title={`${project.projectName}: ${project.hours}h (${project.percentage}%)`}
                    ></div>
                  );
                })}
              </div>
              {/* Legend */}
              <div class="mt-3 flex flex-wrap gap-3">
                {collaborator.projects.map((project, idx) => {
                  const colorSet = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                  return (
                    <div
                      key={project.projectId}
                      class="flex items-center gap-1.5"
                    >
                      <div
                        class={`h-3 w-3 rounded-full bg-gradient-to-r ${colorSet.bar}`}
                      ></div>
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        {project.projectName} ({project.percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hours Calendar */}
          <CollaboratorCalendar
            userId={collaborator.userId}
            startDate={props.filterStartDate.value}
            endDate={props.filterEndDate.value}
            fullName={collaborator.fullName}
          />

          {/* Project Participation Details */}
          <div class="p-6 pt-0">
            <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <LuBarChart3 class="h-5 w-5 text-purple-500" />
              Projects involved in
            </h3>

            {collaborator.projects.length === 0 ? (
              <div class="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-slate-600 dark:text-gray-400">
                No projects registered in this period
              </div>
            ) : (
              <div class="space-y-3">
                {collaborator.projects.map((project, idx) => {
                  const colorSet = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                  return (
                    <div
                      key={project.projectId}
                      class="overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-700/40"
                      style={`animation: fadeInUp 0.3s ease-out ${idx * 0.06}s both`}
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          {/* Project header */}
                          <div class="flex items-center gap-2">
                            <div
                              class={`h-3 w-3 rounded-full bg-gradient-to-r ${colorSet.bar}`}
                            ></div>
                            <h4 class="text-base font-bold text-gray-900 dark:text-white">
                              {project.projectName}
                            </h4>
                          </div>
                          <div class="mt-1 ml-5 flex items-center gap-2">
                            <span
                              class={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorSet.bg} ${colorSet.text}`}
                            >
                              {project.clientName}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div class="mt-3 ml-5">
                            <div class="mb-1 flex items-center justify-between">
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                Dedicated hours
                              </span>
                              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {project.hours}h of {collaborator.totalHours}h
                                total
                              </span>
                            </div>
                            <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
                              <div
                                class={`h-full rounded-full bg-gradient-to-r ${colorSet.bar} transition-all duration-500 ease-out`}
                                style={`width: ${(project.hours / maxProjectHours) * 100}%`}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div class="flex flex-col items-end gap-1">
                          <p class="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                            {project.hours}h
                          </p>
                          <p class="text-sm font-semibold text-purple-600 dark:text-purple-400">
                            {project.percentage}% of total
                          </p>
                          {collaborator.totalDaysWorked > 0 && (
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              ~
                              {(
                                project.hours / collaborator.totalDaysWorked
                              ).toFixed(1)}
                              h/day
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div class="border-t border-gray-200 p-6 dark:border-slate-700">
            <button
              onClick$={onClose$}
              class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  },
);
