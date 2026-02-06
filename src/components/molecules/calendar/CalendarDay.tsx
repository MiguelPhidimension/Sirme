import { component$, type QRL } from "@builder.io/qwik";
import { CalendarDayTypes } from "~/types";
import { DataUtils } from "~/utils";

interface CalendarDayProps {
  day: CalendarDayTypes;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected?: boolean;
  isSelectionStart?: boolean;
  isSelectionEnd?: boolean;
  onClick$: QRL<(day: CalendarDayTypes) => void>;
  onMouseDown$: QRL<(date: string) => void>;
  onMouseEnter$: QRL<(date: string) => void>;
  onMouseUp$?: QRL<() => void>;
}

const getHoursColorClass = (hours: number) => {
  if (hours === 0) return "";
  if (hours < 4) return "text-blue-400 dark:text-blue-300";
  if (hours < 8) return "text-emerald-500 dark:text-emerald-400";
  if (hours === 8) return "text-purple-500 dark:text-purple-400";
  return "text-amber-500 dark:text-amber-400";
};

const getBackgroundColorClass = (
  hours: number,
  isCurrentMonth: boolean,
  isToday: boolean,
  isPTO?: boolean,
  hasProjectPTO?: boolean,
) => {
  if (isPTO)
    return "bg-purple-500/20 ring-1 ring-purple-500/50 dark:bg-fuchsia-900/30 dark:ring-fuchsia-500/50 dark:hover:bg-fuchsia-900/40";
  if (hasProjectPTO && hours === 0)
    return "bg-purple-400/15 ring-1 ring-purple-400/40 dark:bg-fuchsia-800/20 dark:ring-fuchsia-400/40 dark:hover:bg-fuchsia-800/30";
  if (isToday)
    return "bg-blue-500/20 ring-2 ring-blue-400/50 dark:ring-blue-500/50";
  if (!isCurrentMonth) return "";
  if (hours === 0)
    return "bg-white/5 hover:bg-white/20 dark:bg-slate-800/20 dark:hover:bg-slate-700/30";
  if (hours < 4)
    return "bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-900/20 dark:hover:bg-blue-900/30";
  if (hours < 8)
    return "bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30";
  if (hours === 8)
    return "bg-purple-500/10 hover:bg-purple-500/20 dark:bg-purple-900/20 dark:hover:bg-purple-900/30";
  return "bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-900/20 dark:hover:bg-amber-900/30";
};

export const CalendarDay = component$<CalendarDayProps>(
  ({
    day,
    isCurrentMonth,
    isToday,
    isSelected = false,
    isSelectionStart = false,
    isSelectionEnd = false,
    onClick$,
    onMouseDown$,
    onMouseEnter$,
  }) => {
    // Safely extract day number from YYYY-MM-DD string to avoid timezone shifts
    // caused by new Date("YYYY-MM-DD") being interpreted as UTC
    const dayNumber = parseInt(day.date.split("-")[2], 10);
    const isPTO = day.entries?.some((e) => e.isPTO);
    const hasProjectPTO = day.entries?.some((e) =>
      e.projects.some((p) => p.isPTO),
    );

    const getSelectionClass = () => {
      if (isSelectionStart && isSelectionEnd) {
        return "bg-indigo-600/60 ring-2 ring-indigo-400";
      }
      if (isSelectionStart) {
        return "bg-indigo-600/60 ring-2 ring-indigo-400 rounded-l-lg";
      }
      if (isSelectionEnd) {
        return "bg-indigo-600/60 ring-2 ring-indigo-400 rounded-r-lg";
      }
      if (isSelected) {
        return "bg-indigo-600/50";
      }
      return "";
    };

    return (
      <div
        class={`group relative h-28 cursor-pointer border-r border-b border-white/10 p-3 transition-all duration-300 select-none md:h-36 dark:border-slate-600/20 ${getSelectionClass() ? getSelectionClass() : getBackgroundColorClass(day.totalHours, isCurrentMonth, isToday, isPTO, hasProjectPTO)} ${day.hasEntries ? "border-l-4 border-l-emerald-400 dark:border-l-emerald-500" : ""} hover:scale-105 hover:shadow-lg`}
        onClick$={() => onClick$(day)}
        onMouseDown$={() => onMouseDown$(day.date)}
        onMouseEnter$={() => onMouseEnter$(day.date)}
      >
        {/* Day number */}
        <div class="mb-2 flex items-start justify-between">
          <div class="flex items-center gap-2">
            <span
              class={`text-sm font-medium ${
                isToday
                  ? "font-bold text-blue-600 dark:text-blue-400"
                  : isCurrentMonth
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-600"
              }`}
            >
              {dayNumber}
            </span>
            {isToday && (
              <span class="rounded-md bg-blue-500/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-blue-600/80">
                Today
              </span>
            )}
          </div>
          {isToday && (
            <div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
          )}
        </div>

        {/* Hours display */}
        {(day.totalHours > 0 ||
          hasProjectPTO ||
          (isToday && day.hasEntries)) && (
          <div class="flex flex-1 flex-col items-center justify-center">
            <div
              class={`text-xl font-bold ${(hasProjectPTO && day.totalHours === 0) || (isToday && day.hasEntries) ? "text-slate-400 dark:text-slate-500" : getHoursColorClass(day.totalHours)}`}
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
        {day.totalHours === 0 && isCurrentMonth && !isPTO && !hasProjectPTO && (
          <div class="flex flex-1 items-center justify-center">
            <div class="h-2 w-2 rounded-full bg-slate-300 opacity-50 transition-opacity group-hover:opacity-100 dark:bg-slate-600"></div>
          </div>
        )}

        {/* Entry indicators */}
        {day.entries && day.entries.length > 0 && (
          <div class="absolute right-2 bottom-2 left-2 flex justify-center gap-1">
            {isPTO && (
              <div class="rounded-full bg-fuchsia-600 px-2 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                PTO
              </div>
            )}
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
