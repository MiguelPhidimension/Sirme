import { component$, $ } from "@builder.io/qwik";
import { Badge } from "../atoms";
import { DataUtils, DateUtils } from "~/utils";
import type { CalendarDay } from "~/types";

/**
 * Props interface for CalendarCell component
 */
interface CalendarCellProps {
  day: CalendarDay;
  isCurrentMonth?: boolean;
  onClick$?: (date: string) => void;
}

/**
 * CalendarCell Molecule Component
 * Represents a single day in the calendar grid
 * Shows date, total hours, and visual indicators
 *
 * @example
 * <CalendarCell
 *   day={calendarDay}
 *   isCurrentMonth={true}
 *   onClick$={handleDayClick}
 * />
 */
export const CalendarCell = component$<CalendarCellProps>(
  ({ day, isCurrentMonth = true, onClick$ }) => {
    // Extract day number from date
    const dayNumber = new Date(day.date).getDate();
    const isToday = DateUtils.isToday(day.date);
    const isCurrentWeek = DateUtils.isCurrentWeek(day.date);

    // Handle cell click
    const handleClick = $(() => {
      if (onClick$) {
        onClick$(day.date);
      }
    });

    // Determine cell styling based on state
    const getCellClasses = () => {
      const baseClasses =
        "relative aspect-square p-2 border border-base-300 cursor-pointer transition-all hover:bg-base-200 flex flex-col";

      let classes = [baseClasses];

      // Current month styling
      if (!isCurrentMonth) {
        classes.push("text-base-content/30 bg-base-200/50");
      } else {
        classes.push("bg-base-100");
      }

      // Today styling
      if (isToday) {
        classes.push("ring-2 ring-primary bg-primary/10");
      }

      // Current week styling
      if (isCurrentWeek && !isToday) {
        classes.push("bg-primary/5");
      }

      // Has entries styling
      if (day.hasEntries) {
        classes.push("border-l-4 border-l-success");
      }

      return classes.join(" ");
    };

    // Get hours indicator color based on amount
    const getHoursColor = (hours: number) => {
      if (hours === 0) return "";
      if (hours < 4) return "text-info";
      if (hours < 8) return "text-success";
      if (hours === 8) return "text-primary";
      return "text-warning";
    };

    return (
      <div class={getCellClasses()} onClick$={handleClick}>
        {/* Day number */}
        <div class="mb-1 flex items-start justify-between">
          <span
            class={`text-sm font-medium ${isToday ? "text-primary font-bold" : ""}`}
          >
            {dayNumber}
          </span>

          {/* Today indicator */}
          {isToday && <div class="bg-primary h-2 w-2 rounded-full"></div>}
        </div>

        {/* Hours display */}
        {day.totalHours > 0 && (
          <div class="flex flex-1 flex-col items-center justify-center">
            <div
              class={`text-lg font-bold ${getHoursColor(day.totalHours)}`}
            >
              {DataUtils.formatHours(day.totalHours)}
            </div>

            {/* Project count indicator */}
            {day.entries && day.entries.length > 0 && (
              <div class="text-base-content/60 mt-1 text-xs">
                {day.entries.reduce(
                  (total, entry) => total + entry.projects.length,
                  0,
                )}{" "}
                projects
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {day.totalHours === 0 && isCurrentMonth && (
          <div class="flex flex-1 items-center justify-center">
            <div class="bg-base-content/20 h-1 w-1 rounded-full"></div>
          </div>
        )}

        {/* Bottom indicators */}
        <div class="absolute right-1 bottom-1 left-1 flex justify-center gap-1">
          {/* MPS indicator */}
          {day.entries?.some((entry) =>
            entry.projects.some((project) => project.isMPS),
          ) && (
            <Badge variant="success" size="xs">
              MPS
            </Badge>
          )}

          {/* Overtime indicator */}
          {day.totalHours > 8 && (
            <Badge variant="warning" size="xs">
              OT
            </Badge>
          )}
        </div>
      </div>
    );
  },
);
