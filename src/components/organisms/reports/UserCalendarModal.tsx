import {
  component$,
  useSignal,
  $,
  useComputed$,
  type QRL,
} from "@builder.io/qwik";
import { LuX, LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";

interface TimeEntryDetail {
  date: string;
  hours: number;
  notes?: string;
}

interface UserCalendarModalProps {
  isOpen: boolean;
  userName: string;
  projectName: string;
  timeEntries: TimeEntryDetail[];
  onClose: QRL<() => void>;
}

export const UserCalendarModal = component$<UserCalendarModalProps>(
  ({ isOpen, userName, projectName, timeEntries, onClose }) => {
    if (!isOpen) return null;

    const currentDate = useSignal(new Date());

    // Navigation handlers
    const goToPreviousMonth = $(() => {
      const newDate = new Date(currentDate.value);
      newDate.setMonth(newDate.getMonth() - 1);
      currentDate.value = newDate;
    });

    const goToNextMonth = $(() => {
      const newDate = new Date(currentDate.value);
      newDate.setMonth(newDate.getMonth() + 1);
      currentDate.value = newDate;
    });

    // Compute calendar data
    const calendarData = useComputed$(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();

      // Get first and last day of the month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Get day of week for first day (0 = Sunday)
      const startDayOfWeek = firstDay.getDay();

      // Get number of days in month
      const daysInMonth = lastDay.getDate();

      // Build calendar grid
      const days: Array<{
        date: number | null;
        dateString: string;
        hours: number;
        projectCount: number;
        isMPS: boolean;
      }> = [];

      // Add empty cells for days before month starts
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({
          date: null,
          dateString: "",
          hours: 0,
          projectCount: 0,
          isMPS: false,
        });
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Find entries for this date
        const entriesForDate = timeEntries.filter((e) => e.date === dateString);
        const totalHours = entriesForDate.reduce((sum, e) => sum + e.hours, 0);

        days.push({
          date: day,
          dateString,
          hours: totalHours,
          projectCount: entriesForDate.length,
          isMPS: false, // You can add MPS logic here if needed
        });
      }

      return {
        monthName: firstDay.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        days,
      };
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-md"
        onClick$={onClose}
      >
        <div class="group relative max-h-[90vh] w-full max-w-7xl overflow-hidden">
          {/* Glow effect */}
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

          {/* Modal content */}
          <div
            class="relative flex max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-2xl backdrop-blur-sm dark:border-slate-700/20"
            onClick$={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div class="flex-shrink-0 border-b border-slate-700 bg-slate-900/95 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white">{userName}</h2>
                  <p class="text-slate-400">{projectName}</p>
                </div>
                <button
                  onClick$={onClose}
                  class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <LuX class="h-6 w-6" />
                </button>
              </div>

              {/* Calendar Navigation */}
              <div class="mt-6 flex items-center justify-between">
                <button
                  onClick$={goToPreviousMonth}
                  class="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <LuChevronLeft class="h-5 w-5" />
                  Previous
                </button>
                <h3 class="text-xl font-semibold text-white">
                  {calendarData.value.monthName}
                </h3>
                <button
                  onClick$={goToNextMonth}
                  class="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  Next
                  <LuChevronRight class="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid - Scrollable */}
            <div class="flex-1 overflow-y-auto p-6">
              {/* Week day headers */}
              <div class="mb-2 grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    class="py-2 text-center text-sm font-medium text-slate-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div class="grid grid-cols-7 gap-2">
                {calendarData.value.days.map((day, idx) => (
                  <div
                    key={idx}
                    class={[
                      "relative min-h-[120px] rounded-lg border p-3 transition-all",
                      day.date
                        ? day.hours > 0
                          ? "border-emerald-500/30 bg-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
                          : "border-slate-700 bg-slate-800/50"
                        : "border-transparent bg-transparent",
                    ].join(" ")}
                  >
                    {day.date && (
                      <>
                        {/* Day number */}
                        <div class="mb-2 text-right text-sm font-medium text-slate-400">
                          {day.date}
                        </div>

                        {/* Hours worked */}
                        {day.hours > 0 && (
                          <div class="space-y-2">
                            <div class="text-center">
                              <div class="text-2xl font-bold text-emerald-400">
                                {day.hours}h
                              </div>
                              <div class="text-xs text-slate-500">
                                {day.projectCount}{" "}
                                {day.projectCount === 1
                                  ? "project"
                                  : "projects"}
                              </div>
                            </div>
                            {day.isMPS && (
                              <div class="mx-auto w-fit rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                                MPS
                              </div>
                            )}
                          </div>
                        )}

                        {/* Visual indicator bar */}
                        {day.hours > 0 && (
                          <div class="absolute right-0 bottom-0 left-0 h-1 rounded-b-lg bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
