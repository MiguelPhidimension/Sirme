import {
  component$,
  type Signal,
  type QRL,
  useSignal,
  useComputed$,
  $,
} from "@builder.io/qwik";
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
} from "@qwikest/icons/lucide";

interface DateSelectorProps {
  selectedDate: Signal<string>;
  onDateChange: QRL<(date: string) => void>;
}

/**
 * DateSelector - Molecule component for date selection
 * Displays a mini calendar with modern styling
 */
export const DateSelector = component$<DateSelectorProps>(
  ({ selectedDate, onDateChange }) => {
    // Helper to get date object from YYYY-MM-DD string
    const getDateFromStr = (dateStr: string) => {
      if (!dateStr) return new Date();
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    };

    // State for the currently displayed month
    // Use selected date or today (in UTC)
    const currentMonthDate = useSignal(
      getDateFromStr(
        selectedDate.value || new Date().toISOString().split("T")[0],
      ),
    );

    // Computed values for calendar grid
    const calendarData = useComputed$(() => {
      const year = currentMonthDate.value.getUTCFullYear();
      const month = currentMonthDate.value.getUTCMonth();

      const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
      const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

      // Start from the Sunday before or on the first day
      const firstDayWeekday = firstDayOfMonth.getUTCDay();
      const startDate = new Date(firstDayOfMonth);
      startDate.setUTCDate(startDate.getUTCDate() - firstDayWeekday);

      // End on the Saturday after or on the last day
      const lastDayWeekday = lastDayOfMonth.getUTCDay();
      const endDate = new Date(lastDayOfMonth);
      endDate.setUTCDate(endDate.getUTCDate() + (6 - lastDayWeekday));

      const days: { date: Date; isCurrentMonth: boolean; dateStr: string }[] =
        [];
      const currentDay = new Date(startDate);

      while (currentDay <= endDate) {
        const dateStr = [
          currentDay.getUTCFullYear(),
          String(currentDay.getUTCMonth() + 1).padStart(2, "0"),
          String(currentDay.getUTCDate()).padStart(2, "0"),
        ].join("-");

        days.push({
          date: new Date(currentDay),
          isCurrentMonth: currentDay.getUTCMonth() === month,
          dateStr,
        });
        currentDay.setUTCDate(currentDay.getUTCDate() + 1);
      }

      return days;
    });

    const displayMonthYear = useComputed$(() => {
      return currentMonthDate.value.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    });

    const handlePrevMonth = $(() => {
      const d = new Date(currentMonthDate.value);
      d.setUTCMonth(d.getUTCMonth() - 1);
      currentMonthDate.value = d;
    });

    const handleNextMonth = $(() => {
      const d = new Date(currentMonthDate.value);
      d.setUTCMonth(d.getUTCMonth() + 1);
      currentMonthDate.value = d;
    });

    const handleDayClick = $((dateStr: string) => {
      onDateChange(dateStr);
    });

    return (
      <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <LuCalendar class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Select Date
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {getDateFromStr(selectedDate.value).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Calendar */}
        <div class="select-none">
          {/* Calendar Header */}
          <div class="mb-4 flex items-center justify-between">
            <button
              onClick$={handlePrevMonth}
              class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              preventdefault:click
              type="button"
            >
              <LuChevronLeft class="h-5 w-5" />
            </button>
            <span class="font-semibold text-slate-800 dark:text-white">
              {displayMonthYear.value}
            </span>
            <button
              onClick$={handleNextMonth}
              class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              preventdefault:click
              type="button"
            >
              <LuChevronRight class="h-5 w-5" />
            </button>
          </div>

          {/* Days Header */}
          <div class="mb-2 grid grid-cols-7 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                class="text-xs font-medium text-slate-400 dark:text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div class="grid grid-cols-7 gap-1">
            {calendarData.value.map((day) => {
              const isSelected = day.dateStr === selectedDate.value;
              const isToday =
                day.dateStr === new Date().toISOString().split("T")[0];

              return (
                <button
                  key={day.dateStr}
                  onClick$={() => handleDayClick(day.dateStr)}
                  type="button"
                  class={`flex aspect-square items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700"
                      : day.isCurrentMonth
                        ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                        : "text-slate-300 dark:text-slate-600"
                  } ${isToday && !isSelected ? "ring-1 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800" : ""} `}
                >
                  {day.date.getUTCDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
