import { component$, type QRL } from "@builder.io/qwik";
import { CalendarDayTypes } from "~/types";
import { DataUtils } from "~/utils";

interface CalendarDayProps {
  day: CalendarDayTypes;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick$: QRL<(day: CalendarDayTypes) => void>;
}

const getHoursColorClass = (hours: number) => {
  if (hours === 0) return "";
  if (hours < 4) return "text-blue-400 dark:text-blue-300";
  if (hours < 8) return "text-emerald-500 dark:text-emerald-400";
  if (hours === 8) return "text-purple-500 dark:text-purple-400";
  return "text-amber-500 dark:text-amber-400";
};

export const CalendarDay = component$<CalendarDayProps>(
  ({ day, isCurrentMonth, isToday, onClick$ }) => {
    const dayNumber = new Date(day.date).getDate();

    return (
      <div
        class={`group relative h-28 cursor-pointer border-r border-b border-white/10 p-3 transition-all duration-300 md:h-36 dark:border-slate-600/20 ${
          isCurrentMonth
            ? "bg-white/5 hover:bg-white/20 dark:bg-slate-800/20 dark:hover:bg-slate-700/30"
            : "bg-white/5 text-slate-400 dark:bg-slate-900/20 dark:text-slate-600"
        } ${isToday ? "bg-blue-500/20 ring-2 ring-blue-400/50 dark:ring-blue-500/50" : ""} ${day.hasEntries ? "border-l-4 border-l-emerald-400 dark:border-l-emerald-500" : ""} hover:scale-105 hover:shadow-lg`}
        onClick$={() => onClick$(day)}
      >
        {/* Day number */}
        <div class="mb-2 flex items-start justify-between">
          <span
            class={`text-sm font-medium ${isToday ? "font-bold text-blue-600 dark:text-blue-400" : ""}`}
          >
            {dayNumber}
          </span>
          {isToday && (
            <div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
          )}
        </div>

        {/* Hours display */}
        {day.totalHours > 0 && (
          <div class="flex flex-1 flex-col items-center justify-center">
            <div
              class={`text-xl font-bold ${getHoursColorClass(day.totalHours)}`}
            >
              {DataUtils.formatHours(day.totalHours)}
            </div>
            <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {day.entries?.reduce(
                (total, entry) => total + entry.projects.length,
                0,
              ) || 0}{" "}
              project
              {(day.entries?.reduce(
                (total, entry) => total + entry.projects.length,
                0,
              ) || 0) !== 1
                ? "s"
                : ""}
            </div>
          </div>
        )}

        {/* Empty day indicator */}
        {day.totalHours === 0 && isCurrentMonth && (
          <div class="flex flex-1 items-center justify-center">
            <div class="h-2 w-2 rounded-full bg-slate-300 opacity-50 transition-opacity group-hover:opacity-100 dark:bg-slate-600"></div>
          </div>
        )}

        {/* Entry indicators */}
        {day.entries && day.entries.length > 0 && (
          <div class="absolute right-2 bottom-2 left-2 flex justify-center gap-1">
            {day.entries.some((entry) =>
              entry.projects.some((project) => project.isMPS),
            ) && (
              <div class="rounded-full bg-emerald-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                MPS
              </div>
            )}
            {day.totalHours > 8 && (
              <div class="rounded-full bg-amber-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                OT
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
