import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
  QRL,
} from "@builder.io/qwik";
import {
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuCalendar,
} from "@qwikest/icons/lucide";
import { CalendarCell } from "../molecules";
import { Button, Badge } from "../atoms";
import { DateUtils, DataUtils } from "~/utils";
import type { CalendarDayTypes, DailyTimeEntry } from "~/types";

/**
 * Props interface for Calendar component
 */
interface CalendarProps {
  entries?: DailyTimeEntry[];
  selectedDate?: string;
  onDateSelect$?: QRL<(date: string) => void>;
  onNewEntry$?: QRL<(date: string) => void>;
  onEditEntry$?: QRL<(entryId: string) => void>;
  isLoading?: boolean;
}

/**
 * Calendar Organism Component
 * Interactive calendar showing historical time entries
 * Supports month navigation and day selection
 *
 * @example
 * <Calendar
 *   entries={timeEntries}
 *   onDateSelect$={handleDateSelect}
 *   onNewEntry$={handleNewEntry}
 * />
 */
export const Calendar = component$<CalendarProps>(
  ({
    entries = [],
    onDateSelect$,
    onNewEntry$,
    onEditEntry$,
    isLoading = false,
  }) => {
    // Calendar state
    const currentDate = useSignal(new Date());
    const selectedDay = useSignal<CalendarDayTypes | null>(null);
    const showDayDetails = useSignal(false);

    // Calendar data
    const calendarData = useStore<{
      days: CalendarDayTypes[];
      monthTotal: number;
      averageDaily: number;
    }>({
      days: [],
      monthTotal: 0,
      averageDaily: 0,
    });

    // Build calendar data for the current month
    const buildCalendarData = $(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();

      // Get first day of month and calculate grid start
      const firstDay = new Date(year, month, 1);
      const startOfWeek = new Date(firstDay);
      startOfWeek.setDate(firstDay.getDate() - firstDay.getDay()); // Start from Sunday

      // Get last day of month and calculate grid end
      const lastDay = new Date(year, month + 1, 0);
      const endOfWeek = new Date(lastDay);
      endOfWeek.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // End on Saturday

      // Build calendar days array
      const days: CalendarDayTypes[] = [];
      const currentDay = new Date(startOfWeek);

      let monthTotal = 0;
      let daysWithEntries = 0;

      while (currentDay <= endOfWeek) {
        const dateStr = currentDay.toISOString().split("T")[0];
        const dayEntries = entries.filter((entry) => entry.date === dateStr);
        const totalHours = dayEntries.reduce(
          (sum, entry) => sum + entry.totalHours,
          0,
        );

        if (currentDay.getMonth() === month && totalHours > 0) {
          monthTotal += totalHours;
          daysWithEntries++;
        }

        days.push({
          date: dateStr,
          totalHours,
          hasEntries: dayEntries.length > 0,
          entries: dayEntries,
        });

        currentDay.setDate(currentDay.getDate() + 1);
      }

      calendarData.days = days;
      calendarData.monthTotal = monthTotal;
      calendarData.averageDaily =
        daysWithEntries > 0 ? monthTotal / daysWithEntries : 0;
    });

    // Initialize calendar data
    useVisibleTask$(({ track }) => {
      track(() => currentDate.value);
      track(() => entries);
      buildCalendarData();
    });

    // Handle month navigation
    const navigateMonth = $((direction: "prev" | "next") => {
      const newDate = new Date(currentDate.value);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      currentDate.value = newDate;
    });

    // Handle day click
    const handleDayClick = $((date: string) => {
      const day = calendarData.days.find((d) => d.date === date);
      if (day) {
        selectedDay.value = day;
        showDayDetails.value = true;
        if (onDateSelect$) {
          onDateSelect$(date);
        }
      }
    });

    // Handle go to today
    const goToToday = $(() => {
      currentDate.value = new Date();
    });

    // Get month/year display
    const getMonthYear = () => {
      return currentDate.value.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    };

    // Week day headers
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (isLoading) {
      return (
        <div class="flex min-h-[400px] items-center justify-center">
          <div class="loading loading-spinner loading-lg text-primary"></div>
        </div>
      );
    }

    return (
      <div class="space-y-6">
        {/* Calendar Header */}
        <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 class="text-base-content text-3xl font-bold">
              <LuCalendar class="inline-block h-8 w-8" /> Time Calendar
            </h1>
            <p class="text-base-content/60 mt-1">
              View your time entries across different months
            </p>
          </div>

          <div class="flex gap-2">
            <Button variant="ghost" onClick$={goToToday}>
              Today
            </Button>
            <Button
              variant="primary"
              onClick$={() =>
                onNewEntry$ && onNewEntry$(DateUtils.getCurrentDate())
              }
            >
              New Entry
            </Button>
          </div>
        </div>

        {/* Month Summary */}
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="stats bg-base-100 shadow">
            <div class="stat">
              <div class="stat-title">Month Total</div>
              <div class="stat-value text-primary">
                {DataUtils.formatHours(calendarData.monthTotal)}
              </div>
              <div class="stat-desc">All logged hours this month</div>
            </div>
          </div>

          <div class="stats bg-base-100 shadow">
            <div class="stat">
              <div class="stat-title">Average Daily</div>
              <div class="stat-value text-success">
                {DataUtils.formatHours(calendarData.averageDaily)}
              </div>
              <div class="stat-desc">Average hours per working day</div>
            </div>
          </div>

          <div class="stats bg-base-100 shadow">
            <div class="stat">
              <div class="stat-title">Working Days</div>
              <div class="stat-value text-info">
                {
                  calendarData.days.filter(
                    (d) =>
                      d.hasEntries &&
                      new Date(d.date).getMonth() ===
                        currentDate.value.getMonth(),
                  ).length
                }
              </div>
              <div class="stat-desc">Days with logged hours</div>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div class="flex items-center justify-between">
          <Button variant="ghost" onClick$={() => navigateMonth("prev")}>
            <LuChevronLeft class="mr-1 h-5 w-5" />
            Previous
          </Button>

          <h2 class="text-base-content text-2xl font-bold">{getMonthYear()}</h2>

          <Button variant="ghost" onClick$={() => navigateMonth("next")}>
            Next
            <LuChevronRight class="ml-1 h-5 w-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div class="card bg-base-100 border-base-200 border shadow-sm">
          <div class="card-body p-0">
            {/* Week day headers */}
            <div class="border-base-200 grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div
                  key={day}
                  class="text-base-content/60 bg-base-200 p-4 text-center font-semibold"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div class="grid grid-cols-7">
              {calendarData.days.map((day) => {
                const isCurrentMonth =
                  new Date(day.date).getMonth() ===
                  currentDate.value.getMonth();
                return (
                  <CalendarCell
                    key={day.date}
                    day={day}
                    isCurrentMonth={isCurrentMonth}
                    onClick$={handleDayClick}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Details Modal */}
        {showDayDetails.value && selectedDay.value && (
          <div class="fixed inset-0 z-1 flex items-center justify-center bg-black/50 p-4">
            <div class="card bg-base-100 max-h-[80vh] w-full max-w-2xl overflow-auto">
              <div class="card-body">
                <div class="mb-4 flex items-start justify-between">
                  <div>
                    <h3 class="text-base-content text-2xl font-bold">
                      {DateUtils.formatDisplayDate(selectedDay.value.date)}
                    </h3>
                    <p class="text-base-content/60">
                      Total:{" "}
                      {DataUtils.formatHours(selectedDay.value.totalHours)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    square
                    onClick$={() => (showDayDetails.value = false)}
                  >
                    <LuX class="h-5 w-5" />
                  </Button>
                </div>

                {selectedDay.value.entries &&
                selectedDay.value.entries.length > 0 ? (
                  <div class="space-y-4">
                    {selectedDay.value.entries.map((entry) => (
                      <div
                        key={entry.id}
                        class="border-base-200 rounded-lg border p-4"
                      >
                        <div class="mb-3 flex items-start justify-between">
                          <div>
                            <div class="mb-1 flex items-center gap-2">
                              <span class="font-semibold">
                                {entry.employeeName}
                              </span>
                              <Badge variant="primary" size="sm">
                                {entry.role}
                              </Badge>
                              {entry.isPTO && (
                                <Badge variant="warning" size="sm">
                                  PTO
                                </Badge>
                              )}
                            </div>
                            <div class="text-base-content/60 text-sm">
                              {entry.isPTO ? (
                                <span>Personal Time Off</span>
                              ) : (
                                <>
                                  {entry.projects.length} project
                                  {entry.projects.length !== 1 ? "s" : ""} •
                                  Total:{" "}
                                  {DataUtils.formatHours(entry.totalHours)}
                                </>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick$={() =>
                              onEditEntry$ && onEditEntry$(entry.id)
                            }
                          >
                            Edit
                          </Button>
                        </div>

                        {!entry.isPTO && (
                          <div class="space-y-2">
                            {entry.projects.map((project, index) => (
                              <div key={index} class="bg-base-200 rounded p-3">
                                <div class="flex items-start justify-between">
                                  <div>
                                    <div class="font-medium">
                                      {project.clientName}
                                    </div>
                                    <div class="text-base-content/60 flex items-center gap-2 text-sm">
                                      <span>
                                        {DataUtils.formatHours(project.hours)}
                                      </span>
                                      {project.isMPS && (
                                        <Badge variant="success" size="xs">
                                          MPS
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {project.notes && (
                                  <p class="text-base-content/70 mt-2 text-sm">
                                    {project.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="text-base-content/50 py-8 text-center">
                    <div class="mb-2 text-4xl">📝</div>
                    <p>No time entries for this day</p>
                    <Button
                      variant="primary"
                      size="sm"
                      class="mt-4"
                      onClick$={() => {
                        if (onNewEntry$) {
                          onNewEntry$(selectedDay.value!.date);
                        }
                        showDayDetails.value = false;
                      }}
                    >
                      Add Entry
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
