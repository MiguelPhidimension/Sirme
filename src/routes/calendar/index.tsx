import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { DailyTimeEntry, CalendarDayTypes, EmployeeRole } from "~/types";
import { CalendarHeader, CalendarStats } from "~/components/molecules";
import {
  CalendarGrid,
  DayDetailsModal,
  TimeEntryModal,
} from "~/components/organisms";
import { useGetTimeEntries } from "~/graphql/hooks/useTimeEntries";
import { AuthContext } from "~/components/providers/AuthProvider";

/**
 * Modern Dark Theme Calendar Component
 * Elegant dark design with glassmorphism effects matching dashboard and entry pages
 * Features:
 * - Interactive calendar grid with hover effects and dark theme
 * - Month navigation with smooth transitions
 * - Day details modal with glassmorphism design
 * - Statistics cards with gradient backgrounds
 * - Consistent styling with other pages
 */
export default component$(() => {
  // Core state management
  const currentDate = useSignal(new Date());
  const selectedDay = useSignal<CalendarDayTypes | null>(null);
  const showDayModal = useSignal(false);

  // Time Entry Modal State
  const showTimeEntryModal = useSignal(false);
  const timeEntryModalDate = useSignal("");
  const timeEntryModalId = useSignal<string | string[]>("");
  const timeEntrySelectedDates = useSignal<string[]>([]); // Store all selected dates
  const refreshTrigger = useSignal(0);

  const userId = useSignal<string>("");
  const isLoadingEntries = useSignal(false);

  // Authentication
  const authContext = useContext(AuthContext);

  // Get the hook for fetching time entries
  const getTimeEntries = useGetTimeEntries();

  // State for seed data creation
  const showSeedButton = useSignal(true); // Always show by default

  // Calendar data store
  const calendarData = useStore<{
    days: CalendarDayTypes[];
    monthTotal: number;
    averageDaily: number;
    workingDays: number;
  }>({
    days: [],
    monthTotal: 0,
    averageDaily: 0,
    workingDays: 0,
  });

  // Time entries store - will be populated from GraphQL
  const entries = useStore<DailyTimeEntry[]>([]);

  // Build calendar grid data for current month
  const buildCalendarData = $(() => {
    // Treat currentDate as UTC source of truth for month/year
    const d = currentDate.value;
    // currentDate doesn't have "getUTC..." reliable on the object itself if it was set via "new Date()" local,
    // but semantically we want to treat the "2023-11" part of it as GMT.
    // However, JS Date objects store a timestamp.
    // If we want consistency, we should lean on getUTC* methods.

    const year = d.getUTCFullYear(); // Changed to UTC
    const month = d.getUTCMonth(); // Changed to UTC

    // Calculate calendar grid boundaries using UTC dates
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

    // Calculate start date (Sunday before or on first day of month)
    const firstDayWeekday = firstDayOfMonth.getUTCDay(); // 0 = Sunday
    const startDate = new Date(firstDayOfMonth);
    startDate.setUTCDate(startDate.getUTCDate() - firstDayWeekday);

    // Calculate end date (Saturday after or on last day of month)
    const lastDayWeekday = lastDayOfMonth.getUTCDay();
    const endDate = new Date(lastDayOfMonth);
    endDate.setUTCDate(endDate.getUTCDate() + (6 - lastDayWeekday));

    // Build calendar days array
    const days: CalendarDayTypes[] = [];
    const currentDay = new Date(startDate); // This is a UTC Date

    let monthTotal = 0;
    let workingDays = 0;

    while (currentDay <= endDate) {
      // Build date string from UTC date parts
      const y = currentDay.getUTCFullYear();
      const m = currentDay.getUTCMonth();
      const d = currentDay.getUTCDate();
      const monthStr = String(m + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${y}-${monthStr}-${dayStr}`;

      const dayEntries = entries.filter((entry) => entry.date === dateStr);
      const totalHours = dayEntries.reduce(
        (sum, entry) => sum + entry.totalHours,
        0,
      );

      // Only count current month days for statistics
      if (m === month && totalHours > 0) {
        monthTotal += totalHours;
        workingDays++;
      }

      days.push({
        date: dateStr,
        totalHours,
        hasEntries: dayEntries.length > 0,
        entries: dayEntries,
      });

      // Advance to next day using UTC date setter
      currentDay.setUTCDate(currentDay.getUTCDate() + 1);
    }

    // Update calendar data
    calendarData.days = days;
    calendarData.monthTotal = monthTotal;
    calendarData.workingDays = workingDays;
    calendarData.averageDaily = workingDays > 0 ? monthTotal / workingDays : 0;
  });

  // Initialize calendar when component mounts or month changes
  useVisibleTask$(({ track }) => {
    track(() => currentDate.value);
    track(() => refreshTrigger.value);

    // Get user ID from localStorage - try multiple keys
    if (typeof window !== "undefined") {
      // Try multiple possible keys
      const userStr =
        localStorage.getItem("auth_user") ||
        localStorage.getItem("user") ||
        sessionStorage.getItem("auth_user") ||
        sessionStorage.getItem("user");

      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          // Try multiple possible keys for user_id
          userId.value =
            userData.user_id ||
            userData.id ||
            userData.userId ||
            userData["user-id"];
        } catch (e) {
          console.error("❌ Failed to parse user data:", e);
        }
      } else {
        console.warn("⚠️ No user data in localStorage or sessionStorage");
      }
    }

    // Fetch time entries for the current month
    (async () => {
      if (!userId.value) {
        console.warn("⚠️ No user ID available, skipping entry fetch");
        return;
      }

      try {
        isLoadingEntries.value = true;

        // Use UTC for data fetching ranges
        const year = currentDate.value.getUTCFullYear();
        const month = currentDate.value.getUTCMonth();

        const firstDay = new Date(Date.UTC(year, month, 1));
        const lastDay = new Date(Date.UTC(year, month + 1, 0));

        const startDate = firstDay.toISOString().split("T")[0];
        const endDate = lastDay.toISOString().split("T")[0];

        const timeEntriesData = await getTimeEntries({
          user_id: userId.value,
          start_date: startDate,
          end_date: endDate,
        });

        // Transform GraphQL data to DailyTimeEntry format
        if (
          timeEntriesData &&
          Array.isArray(timeEntriesData) &&
          timeEntriesData.length > 0
        ) {
          entries.length = 0;

          const userName = authContext.user
            ? `${authContext.user.first_name} ${authContext.user.last_name}`
            : "";

          const userRole = (authContext.user?.role_application ||
            "Employee") as EmployeeRole;

          timeEntriesData.forEach((entry: any) => {
            const projects = entry.time_entry_projects || [];
            const totalHours = projects.reduce(
              (sum: number, p: any) => sum + (p.hours_reported || 0),
              0,
            );

            entries.push({
              id: entry.time_entry_id,
              employeeName: userName,
              date: entry.entry_date,
              role: userRole,
              roleApplication: authContext.user?.role_application,
              projects: projects.map((p: any) => ({
                id: p.tep_id,
                clientName: p.project?.client?.name || "Unknown",
                hours: p.hours_reported,
                isMPS: p.is_mps,
                isPTO: p.is_pto || false,
                notes: p.notes || "",
              })),
              totalHours,
              isPTO: entry.is_pto,
              isHoliday: entry.is_holiday || false,
              createdAt: entry.created_at,
              updatedAt: entry.updated_at,
            });
          });

          showSeedButton.value = false;
        } else {
          console.warn("❌ No entries found or empty response");
          showSeedButton.value = true;
        }
      } catch (error) {
        console.error("❌ Error fetching entries:", error);
        showSeedButton.value = true;
      } finally {
        isLoadingEntries.value = false;
        // Build calendar data after loading entries
        buildCalendarData();
      }
    })();
  });

  // Navigation handlers
  const navigateMonth = $((direction: "prev" | "next") => {
    const newDate = new Date(currentDate.value);
    if (direction === "prev") {
      newDate.setUTCMonth(newDate.getUTCMonth() - 1);
    } else {
      newDate.setUTCMonth(newDate.getUTCMonth() + 1);
    }
    currentDate.value = newDate;
  });

  const goToToday = $(() => {
    currentDate.value = new Date();
  });

  const handleNewEntry = $((date: string) => {
    timeEntryModalDate.value = date;
    timeEntryModalId.value = "";
    showTimeEntryModal.value = true;
  });

  const handleEditEntry = $((entryId: string | string[]) => {
    timeEntryModalId.value = entryId;
    timeEntryModalDate.value = "";
    showTimeEntryModal.value = true;
    showDayModal.value = false;
  });

  // Day interaction handlers
  const handleDayClick = $((day: CalendarDayTypes) => {
    // Reset selected dates on single click
    timeEntrySelectedDates.value = [];
    if (day.hasEntries) {
      selectedDay.value = day;
      showDayModal.value = true;
    } else {
      // Directly set signals instead of calling the other QRL to avoid scoping issues
      timeEntryModalDate.value = day.date;
      timeEntryModalId.value = "";
      showTimeEntryModal.value = true;
    }
  });

  // Handle range selection (drag to select multiple days)
  const handleRangeSelect = $((startDate: string, endDate: string) => {
    // Generate array of all dates in range
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      dates.push(dateStr);
      current.setDate(current.getDate() + 1);
    }

    // Store all selected dates and open modal for first date
    timeEntrySelectedDates.value = dates;
    timeEntryModalDate.value = startDate;
    timeEntryModalId.value = "";
    showTimeEntryModal.value = true;
  });

  // Helper functions
  const getMonthYearDisplay = () => {
    return currentDate.value.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div class="min-h-full p-6">
      <div class="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <CalendarHeader
          onAddEntry$={() =>
            handleNewEntry(new Date().toISOString().split("T")[0])
          }
          onGoToToday$={goToToday}
        />

        {/* Stats Cards */}
        <CalendarStats
          monthTotal={calendarData.monthTotal}
          workingDays={calendarData.workingDays}
          averageDaily={calendarData.averageDaily}
        />

        {/* Calendar Section */}
        <CalendarGrid
          days={calendarData.days}
          monthYearDisplay={getMonthYearDisplay()}
          currentMonth={currentDate.value.getUTCMonth()}
          onPrevMonth$={() => navigateMonth("prev")}
          onNextMonth$={() => navigateMonth("next")}
          onDayClick$={handleDayClick}
          onRangeSelect$={handleRangeSelect}
        />

        {/* Day Details Modal */}
        {showDayModal.value && (
          <DayDetailsModal
            day={selectedDay.value}
            isOpen={showDayModal.value}
            onClose$={() => (showDayModal.value = false)}
            onAddEntry$={handleNewEntry}
            onEditEntry$={handleEditEntry}
          />
        )}

        {/* Time Entry Modal */}
        {showTimeEntryModal.value && (
          <TimeEntryModal
            isOpen={showTimeEntryModal.value}
            date={timeEntryModalDate.value}
            entryId={timeEntryModalId.value}
            selectedDates={timeEntrySelectedDates.value}
            onClose$={$(() => {
              showTimeEntryModal.value = false;
              timeEntrySelectedDates.value = [];
            })}
            onSuccess$={$(() => {
              refreshTrigger.value++;
              timeEntrySelectedDates.value = [];
            })}
          />
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Calendar - Time Tracking",
  meta: [
    {
      name: "description",
      content:
        "Modern dark theme calendar view for tracking time entries with interactive monthly navigation",
    },
  ],
};
