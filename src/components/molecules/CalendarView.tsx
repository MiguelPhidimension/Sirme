import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  $,
  QRL,
} from "@builder.io/qwik";
import { Badge } from "../atoms";
import { DataUtils, DateUtils } from "~/utils";
import type { DailyTimeEntry } from "~/types";
import {
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuClipboard,
  LuCalendar,
} from "@qwikest/icons/lucide";

/**
 * Calendar day interface for calendar functionality
 */
interface CalendarDay {
  date: string;
  totalHours: number;
  hasEntries: boolean;
  entries?: DailyTimeEntry[];
}

/**
 * Props interface for CalendarView component
 */
interface CalendarViewProps {
  entries: DailyTimeEntry[];
  onDayClick$?: QRL<(day: CalendarDay) => void>;
  onNewEntryForDate$?: QRL<(date: string) => void>;
}

/**
 * CalendarView Molecule Component
 * Displays a monthly calendar with time entries and navigation.
 * Shows daily hours and allows interaction with calendar days.
 * Combines atoms to create a comprehensive calendar display.
 *
 * Props:
 * - entries: Array of time entries to display on calendar
 * - onDayClick$: Handler for when a calendar day is clicked
 * - onNewEntryForDate$: Handler for creating new entries for specific dates
 *
 * Example usage:
 * <CalendarView
 *   entries={recentEntries}
 *   onDayClick$={handleDayClick}
 *   onNewEntryForDate$={handleNewEntry}
 * />
 */
export const CalendarView = component$<CalendarViewProps>(
  ({ entries, onDayClick$, onNewEntryForDate$ }) => {
    // Calendar state management
    const currentDate = useSignal(new Date());
    const selectedDay = useSignal<CalendarDay | null>(null);
    const showDayModal = useSignal(false);

    // Calendar data store
    const calendarData = useStore<{
      days: CalendarDay[];
      monthTotal: number;
      averageDaily: number;
      workingDays: number;
    }>({
      days: [],
      monthTotal: 0,
      averageDaily: 0,
      workingDays: 0,
    });

    // Week day labels
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Utility functions
    const getMonthYearDisplay = () => {
      return currentDate.value.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    };

    const isToday = (date: string) => {
      return date === new Date().toISOString().split("T")[0];
    };

    const isCurrentMonth = (date: string) => {
      return new Date(date).getMonth() === currentDate.value.getMonth();
    };

    const getHoursColorClass = (hours: number) => {
      if (hours === 0) return "text-slate-400 dark:text-slate-500";
      if (hours < 4) return "text-blue-400 dark:text-blue-300";
      if (hours < 8) return "text-emerald-500 dark:text-emerald-400";
      if (hours === 8) return "text-purple-500 dark:text-purple-400";
      return "text-amber-500 dark:text-amber-400";
    };

    // Build calendar grid data for current month
    const buildCalendarData = $(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();

      // Calculate calendar grid boundaries
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

      const endDate = new Date(lastDayOfMonth);
      endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay())); // End on Saturday

      // Build calendar days array using entries data
      const days: CalendarDay[] = [];
      const currentDay = new Date(startDate);

      let monthTotal = 0;
      let workingDays = 0;

      while (currentDay <= endDate) {
        const dateStr = currentDay.toISOString().split("T")[0];
        const dayEntries = entries.filter((entry) => entry.date === dateStr);
        const totalHours = dayEntries.reduce(
          (sum, entry) => sum + entry.totalHours,
          0,
        );

        // Only count current month days for statistics
        if (currentDay.getMonth() === month && totalHours > 0) {
          monthTotal += totalHours;
          workingDays++;
        }

        days.push({
          date: dateStr,
          totalHours,
          hasEntries: dayEntries.length > 0,
          entries: dayEntries,
        });

        currentDay.setDate(currentDay.getDate() + 1);
      }

      // Update calendar data
      calendarData.days = days;
      calendarData.monthTotal = monthTotal;
      calendarData.workingDays = workingDays;
      calendarData.averageDaily =
        workingDays > 0 ? monthTotal / workingDays : 0;
    });

    // Initialize calendar when component mounts or month changes
    useVisibleTask$(({ track }) => {
      track(() => currentDate.value);
      track(() => entries);
      buildCalendarData();
    });

    // Navigation handlers
    const navigateMonth = $((direction: "prev" | "next") => {
      const newDate = new Date(currentDate.value);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      currentDate.value = newDate;
    });

    // const goToToday = $(() => {
    //   currentDate.value = new Date();
    // });

    // Day interaction handlers
    const handleDayClick = $((day: CalendarDay) => {
      selectedDay.value = day;

      // If day has entries, show day modal
      if (day.hasEntries) {
        showDayModal.value = true;
        // Don't call parent handler - we're handling this internally
      } else {
        // If day has no entries, show time entry form directly
        if (onNewEntryForDate$) {
          onNewEntryForDate$(day.date);
        }
        // Call parent handler for empty days
        if (onDayClick$) {
          onDayClick$(day);
        }
      }
    });

    return (
      <div class="group relative">
        {/* Background glow effect */}
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

        {/* Main calendar container */}
        <div class="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
          {/* Calendar header with navigation */}
          <div class="border-b border-white/20 bg-white/20 px-8 py-6 backdrop-blur-sm dark:border-slate-600/20 dark:bg-slate-700/30">
            <div class="flex items-center justify-between">
              <button
                class="group flex items-center space-x-2 rounded-xl border border-white/20 bg-white/20 px-6 py-3 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                onClick$={() => navigateMonth("prev")}
              >
                <LuChevronLeft class="h-5 w-5 transition-transform group-hover:scale-110" />
                <span class="font-medium">Previous</span>
              </button>

              <h2 class="flex items-center gap-3 text-3xl font-bold text-slate-800 dark:text-slate-200">
                <LuCalendar class="h-8 w-8" />
                {getMonthYearDisplay()}
              </h2>

              <button
                class="group flex items-center space-x-2 rounded-xl border border-white/20 bg-white/20 px-6 py-3 text-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-blue-600 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-300 dark:hover:bg-slate-600/40 dark:hover:text-blue-400"
                onClick$={() => navigateMonth("next")}
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
          <div class="grid grid-cols-7">
            {calendarData.days.map((day) => {
              const dayNumber = new Date(day.date).getDate();
              const isCurrentMonthDay = isCurrentMonth(day.date);
              const isTodayDay = isToday(day.date);

              return (
                <div
                  key={day.date}
                  class={`group relative h-28 cursor-pointer border-r border-b border-white/10 p-3 transition-all duration-300 md:h-36 dark:border-slate-600/20 ${
                    isCurrentMonthDay
                      ? "bg-white/5 text-slate-800 hover:bg-white/20 dark:bg-slate-800/20 dark:text-slate-200 dark:hover:bg-slate-700/30"
                      : "bg-white/5 text-slate-400 dark:bg-slate-900/20 dark:text-slate-600"
                  } ${isTodayDay ? "bg-blue-500/20 ring-2 ring-blue-400/50 dark:ring-blue-500/50" : ""} ${day.hasEntries ? "border-l-4 border-l-emerald-400 dark:border-l-emerald-500" : ""} hover:scale-105 hover:shadow-lg`}
                  onClick$={() => handleDayClick(day)}
                >
                  {/* Day number */}
                  <div class="mb-2 flex items-start justify-between">
                    <span
                      class={`text-sm font-medium ${isTodayDay ? "font-bold text-blue-600 dark:text-blue-400" : ""}`}
                    >
                      {dayNumber}
                    </span>
                    {isTodayDay && (
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
                  {day.totalHours === 0 && isCurrentMonthDay && (
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
                        <Badge
                          variant="success"
                          class="rounded-full bg-emerald-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                        >
                          MPS
                        </Badge>
                      )}
                      {day.totalHours > 8 && (
                        <Badge
                          variant="warning"
                          class="rounded-full bg-amber-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                        >
                          OT
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day details modal */}
        {showDayModal.value && selectedDay.value && (
          <div class="fixed inset-0 z-1 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div class="group relative max-h-[85vh] w-full max-w-4xl overflow-auto">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
              <div class="relative rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/30">
                {/* Modal header */}
                <div class="rounded-t-3xl border-b border-white/20 bg-white/20 px-8 py-6 backdrop-blur-sm dark:border-slate-600/20 dark:bg-slate-700/30">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {DateUtils.formatDisplayDate(selectedDay.value.date)}
                      </h3>
                      <p class="mt-1 text-slate-600 dark:text-slate-400">
                        Total:{" "}
                        {DataUtils.formatHours(selectedDay.value.totalHours)}
                      </p>
                    </div>
                    <button
                      class="rounded-xl border border-white/20 bg-white/20 p-3 text-slate-600 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-red-500 dark:border-slate-500/20 dark:bg-slate-600/30 dark:text-slate-400 dark:hover:bg-slate-600/40 dark:hover:text-red-400"
                      onClick$={() => (showDayModal.value = false)}
                    >
                      <LuX class="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal content */}
                <div class="p-8">
                  {selectedDay.value.entries &&
                  selectedDay.value.entries.length > 0 ? (
                    <div class="space-y-6">
                      {selectedDay.value.entries.map((entry) => (
                        <div key={entry.id} class="group relative">
                          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm transition-all duration-300 group-hover:blur-md"></div>
                          <div class="relative rounded-2xl border border-white/20 bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 dark:border-slate-600/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40">
                            <div class="mb-4 flex items-start justify-between">
                              <div>
                                <div class="mb-2 flex items-center gap-3">
                                  <span class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                    {entry.employeeName}
                                  </span>
                                  <Badge
                                    variant="primary"
                                    class="border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  >
                                    {entry.role}
                                  </Badge>
                                </div>
                                <div class="text-sm text-slate-600 dark:text-slate-400">
                                  {entry.projects.length} project
                                  {entry.projects.length !== 1 ? "s" : ""} •
                                  Total:{" "}
                                  {DataUtils.formatHours(entry.totalHours)}
                                </div>
                              </div>
                            </div>

                            <div class="space-y-3">
                              {entry.projects.map((project, index) => (
                                <div
                                  key={index}
                                  class="rounded-xl border border-white/20 bg-white/20 p-4 backdrop-blur-sm dark:border-slate-500/20 dark:bg-slate-600/30"
                                >
                                  <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                      <div class="font-medium text-slate-800 dark:text-slate-200">
                                        {project.clientName}
                                      </div>
                                      <div class="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <span class="font-bold text-blue-600 dark:text-blue-400">
                                          {DataUtils.formatHours(project.hours)}
                                        </span>
                                        {project.isMPS && (
                                          <Badge
                                            variant="success"
                                            class="badge-xs border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                          >
                                            MPS
                                          </Badge>
                                        )}
                                      </div>
                                      {project.notes && (
                                        <p class="mt-2 rounded-lg bg-white/10 p-2 text-sm text-slate-700 dark:bg-slate-700/20 dark:text-slate-300">
                                          {project.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div class="py-16 text-center">
                      <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20">
                        <LuClipboard class="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 class="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                        No time entries
                      </h4>
                      <p class="mb-6 text-slate-600 dark:text-slate-400">
                        You haven't logged any hours for this day yet.
                      </p>
                      <button
                        class="transform rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                        onClick$={() => {
                          if (onNewEntryForDate$) {
                            onNewEntryForDate$(selectedDay.value!.date);
                          }
                          showDayModal.value = false;
                        }}
                      >
                        Add Time Entry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
