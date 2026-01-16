import { component$ } from "@builder.io/qwik";
import type { DashboardSummary } from "~/types";

/**
 * Props interface for WeeklyProgress component
 */
interface WeeklyProgressProps {
  summary: DashboardSummary;
}

/**
 * WeeklyProgress Molecule Component
 * Displays weekly progress information with visual progress bar.
 * Shows current progress towards weekly goals with status messages.
 * Combines atoms to create a focused progress display.
 *
 * Props:
 * - summary: Dashboard summary data containing weekly progress information
 *
 * Example usage:
 * <WeeklyProgress summary={dashboardSummary} />
 */
export const WeeklyProgress = component$<WeeklyProgressProps>(({ summary }) => {
  // Calculate progress status and styling
  const getProgressStatus = (progress: number) => {
    if (progress >= 100)
      return {
        color: "success",
        message: "Excellent work! 🎉",
        bgGradient: "from-emerald-500/20 to-green-500/20",
        barGradient: "from-emerald-400 to-emerald-600",
      };
    if (progress >= 80)
      return {
        color: "warning",
        message: "Great progress! 💪",
        bgGradient: "from-amber-500/20 to-yellow-500/20",
        barGradient: "from-amber-400 to-amber-600",
      };
    if (progress >= 60)
      return {
        color: "info",
        message: "Good momentum! 👍",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
        barGradient: "from-blue-400 to-blue-600",
      };
    return {
      color: "primary",
      message: "Keep going! 🚀",
      bgGradient: "from-purple-500/20 to-blue-500/20",
      barGradient: "from-purple-400 to-blue-600",
    };
  };

  const progressStatus = getProgressStatus(summary.weeklyProgress);
  const remainingHours = Math.max(0, 40 - summary.weekHours);

  return (
    <div class="group relative">
      {/* Background glow effect */}
      <div
        class={`absolute inset-0 bg-gradient-to-r ${progressStatus.bgGradient} rounded-3xl blur-xl transition-all duration-300 group-hover:blur-2xl`}
      ></div>

      {/* Main content container */}
      <div class="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
        {/* Header section */}
        <div class="mb-8 flex items-center justify-between">
          <h3 class="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-200">
            <span class="text-3xl">📈</span>
            Weekly Progress
          </h3>
          <div
            class={`badge badge-${progressStatus.color} badge-lg bg-opacity-20 gap-2 backdrop-blur-sm`}
          >
            {progressStatus.message}
          </div>
        </div>

        {/* Progress details */}
        <div class="space-y-6">
          {/* Hours summary */}
          <div class="flex items-center justify-between">
            <span class="text-lg text-slate-600 dark:text-slate-300">
              {summary.weekHours.toFixed(1)}h of 40h completed
            </span>
            <span class="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {summary.weeklyProgress.toFixed(1)}%
            </span>
          </div>

          {/* Progress bar */}
          <div class="relative h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              class={`bg-gradient-to-r ${progressStatus.barGradient} h-4 rounded-full shadow-lg transition-all duration-1000 ease-out`}
              style={`width: ${Math.min(summary.weeklyProgress, 100)}%`}
            >
              {/* Animated shine effect */}
              <div class="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>

          {/* Remaining hours message */}
          <div class="text-slate-600 dark:text-slate-400">
            {remainingHours > 0
              ? `${remainingHours.toFixed(1)} hours remaining to reach your goal`
              : "Goal achieved! Great work! 🎉"}
          </div>
        </div>
      </div>
    </div>
  );
});
