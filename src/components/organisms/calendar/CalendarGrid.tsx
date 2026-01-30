import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";
import { CalendarDay } from "~/components/molecules/calendar/CalendarDay";
import type { CalendarDayTypes } from "~/types";

interface CalendarGridProps {
  days: CalendarDayTypes[];
  monthYearDisplay: string;
  currentMonth: number;
  onPrevMonth$: QRL<() => void>;
  onNextMonth$: QRL<() => void>;
  onDayClick$: QRL<(day: CalendarDayTypes) => void>;
  onRangeSelect$?: QRL<(startDate: string, endDate: string) => void>;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarGrid = component$<CalendarGridProps>(
  ({
    days,
    monthYearDisplay,
    currentMonth,
    onPrevMonth$,
    onNextMonth$,
    onDayClick$,
    onRangeSelect$,
  }) => {
    const isSelecting = useSignal(false);
    const selectionStart = useSignal<string | null>(null);
    const selectionEnd = useSignal<string | null>(null);
    const initialStart = useSignal<string | null>(null);

    const getCurrentDate = () => {
      return new Date().toISOString().split("T")[0];
    };

    const isToday = (date: string) => {
      return date === getCurrentDate();
    };

    const isCurrentMonth = (date: string) => {
      // Safely parse month from YYYY-MM-DD string to avoid timezone shifts
      const monthPart = parseInt(date.split("-")[1], 10);
      return monthPart - 1 === currentMonth;
    };

    // Check if date is in selection range
    const isInRange = (date: string) => {
      if (!selectionStart.value || !selectionEnd.value) return false;
      const start = new Date(selectionStart.value).getTime();
      const end = new Date(selectionEnd.value).getTime();
      const current = new Date(date).getTime();
      return current >= start && current <= end;
    };

    const isRangeStart = (date: string) => {
      if (!selectionStart.value) return false;
      return date === selectionStart.value;
    };

    const isRangeEnd = (date: string) => {
      if (!selectionEnd.value) return false;
      return date === selectionEnd.value;
    };

    const handleMouseDown = $((date: string) => {
      isSelecting.value = true;
      selectionStart.value = date;
      selectionEnd.value = date;
      initialStart.value = date;
    });

    const handleMouseEnter = $((date: string) => {
      if (!isSelecting.value || !initialStart.value) return;

      const start = new Date(initialStart.value).getTime();
      const current = new Date(date).getTime();

      if (current < start) {
        selectionStart.value = date;
        selectionEnd.value = initialStart.value;
      } else {
        selectionStart.value = initialStart.value;
        selectionEnd.value = date;
      }
    });

    const handleMouseUp = $(() => {
      isSelecting.value = false;

      if (
        selectionStart.value &&
        selectionEnd.value &&
        onRangeSelect$ &&
        selectionStart.value !== selectionEnd.value
      ) {
        onRangeSelect$(selectionStart.value, selectionEnd.value);
      }

      selectionStart.value = null;
      selectionEnd.value = null;
      initialStart.value = null;
    });

    return (
      <div class="group relative">
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
        <div class="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
          {/* Calendar header with navigation */}
          <div class="border-b border-white/20 bg-white/20 px-8 py-6 backdrop-blur-sm dark:border-slate-600/20 dark:bg-slate-700/30">
            <div class="flex items-center justify-between">
              <button
                class="group flex items-center space-x-2 rounded-xl border border-white/20 bg-white/20 px-6 py-3 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                onClick$={onPrevMonth$}
              >
                <LuChevronLeft class="h-5 w-5 transition-transform group-hover:scale-110" />
                <span class="font-medium">Previous</span>
              </button>

              <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {monthYearDisplay}
              </h2>

              <button
                class="group flex items-center space-x-2 rounded-xl border border-white/20 bg-white/20 px-6 py-3 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                onClick$={onNextMonth$}
              >
                <span class="font-medium">Next</span>
                <LuChevronRight class="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* Week day headers */}
          <div class="grid grid-cols-7 bg-white/10 backdrop-blur-sm dark:bg-slate-700/20">
            {weekDays.map((day) => (
              <div
                key={day}
                class="border-r border-white/10 p-4 text-center text-sm font-semibold text-slate-600 last:border-r-0 dark:border-slate-600/20 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            class="grid grid-cols-7"
            onMouseUp$={handleMouseUp}
            onMouseLeave$={handleMouseUp}
          >
            {days.map((day) => (
              <CalendarDay
                key={day.date}
                day={day}
                isCurrentMonth={isCurrentMonth(day.date)}
                isToday={isToday(day.date)}
                isSelected={isInRange(day.date)}
                isSelectionStart={isRangeStart(day.date)}
                isSelectionEnd={isRangeEnd(day.date)}
                onClick$={onDayClick$}
                onMouseDown$={handleMouseDown}
                onMouseEnter$={handleMouseEnter}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);
