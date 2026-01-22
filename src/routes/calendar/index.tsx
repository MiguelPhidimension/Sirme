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
  const timeEntryModalId = useSignal("");
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
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    // Calculate calendar grid boundaries using local dates
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Calculate start date (Sunday before or on first day of month)
    const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startDate = new Date(year, month, 1 - firstDayWeekday);

    // Calculate end date (Saturday after or on last day of month)
    const lastDayWeekday = lastDayOfMonth.getDay();
    const endDate = new Date(year, month + 1, 0 + (6 - lastDayWeekday));

    // Build calendar days array
    const days: CalendarDayTypes[] = [];
    const currentDay = new Date(startDate);

    let monthTotal = 0;
    let workingDays = 0;

    while (currentDay <= endDate) {
      // Build date string from local date parts
      const y = currentDay.getFullYear();
      const m = currentDay.getMonth();
      const d = currentDay.getDate();
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

      // Advance to next day
      currentDay.setDate(currentDay.getDate() + 1);
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

          console.log("👤 User data from storage:", userData);
          console.log("✅ User ID extracted:", userId.value);
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

        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = firstDay.toISOString().split("T")[0];
        const endDate = lastDay.toISOString().split("T")[0];

        console.log(
          `📅 Fetching entries from ${startDate} to ${endDate} for user: ${userId.value}`,
        );

        const timeEntriesData = await getTimeEntries({
          user_id: userId.value,
          start_date: startDate,
          end_date: endDate,
        });

        console.log(`📊 Response from GraphQL:`, timeEntriesData);
        console.log(`📊 Response type:`, typeof timeEntriesData);
        console.log(`📊 Is array:`, Array.isArray(timeEntriesData));
        console.log(`📊 Length:`, timeEntriesData?.length);

        // Transform GraphQL data to DailyTimeEntry format
        if (
          timeEntriesData &&
          Array.isArray(timeEntriesData) &&
          timeEntriesData.length > 0
        ) {
          console.log(
            `✅ Processing ${timeEntriesData.length} entries for user ${userId.value}`,
          );

          entries.length = 0;

          const userName = authContext.user
            ? `${authContext.user.first_name} ${authContext.user.last_name}`
            : "";

          const userRole = (authContext.user?.role?.role_name ||
            "Employee") as EmployeeRole;

          timeEntriesData.forEach((entry: any, index: number) => {
            const projects = entry.time_entry_projects || [];
            const totalHours = projects.reduce(
              (sum: number, p: any) => sum + (p.hours_reported || 0),
              0,
            );

            console.log(
              `📌 [${index + 1}/${timeEntriesData.length}] Date: ${entry.entry_date}, Hours: ${totalHours}, Projects: ${projects.length}`,
            );

            entries.push({
              id: entry.time_entry_id,
              employeeName: userName,
              date: entry.entry_date,
              role: userRole,
              projects: projects.map((p: any) => ({
                id: p.tep_id,
                clientName: p.project?.client?.name || "Unknown",
                hours: p.hours_reported,
                isMPS: p.is_mps,
                notes: p.notes || "",
              })),
              totalHours,
              createdAt: entry.created_at,
              updatedAt: entry.updated_at,
            });
          });

          console.log(
            `✅ Successfully loaded ${entries.length} entries into calendar for user ${userId.value}`,
          );
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
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
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

  const handleEditEntry = $((entryId: string) => {
    timeEntryModalId.value = entryId;
    timeEntryModalDate.value = "";
    showTimeEntryModal.value = true;
    showDayModal.value = false;
  });

  // Day interaction handlers
  const handleDayClick = $((day: CalendarDayTypes) => {
    console.log("📅 Day clicked:", day);
    if (day.hasEntries) {
      console.log("✅ Day has entries, opening modal");
      selectedDay.value = day;
      showDayModal.value = true;
    } else {
      console.log("➡️ Day has no entries, opening time entry modal");
      // Directly set signals instead of calling the other QRL to avoid scoping issues
      timeEntryModalDate.value = day.date;
      timeEntryModalId.value = "";
      showTimeEntryModal.value = true;
    }
  });

  // Helper functions
  const getMonthYearDisplay = () => {
    return currentDate.value.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
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
          currentMonth={currentDate.value.getMonth()}
          onPrevMonth$={() => navigateMonth("prev")}
          onNextMonth$={() => navigateMonth("next")}
          onDayClick$={handleDayClick}
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
            onClose$={$(() => (showTimeEntryModal.value = false))}
            onSuccess$={$(() => {
              console.log("🔄 Time entry saved, refreshing calendar...");
              refreshTrigger.value++;
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
