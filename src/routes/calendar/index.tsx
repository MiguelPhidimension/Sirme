import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { DateUtils } from "~/utils";
import type { EmployeeRole, DailyTimeEntry, CalendarDayTypes } from "~/types";
import { CalendarHeader, CalendarStats } from "~/components/molecules";
import { CalendarGrid, DayDetailsModal } from "~/components/organisms";

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

  // Sample time entries data (would come from API in real app)
  const entries = useStore<DailyTimeEntry[]>([
    {
      id: "1",
      employeeName: "John Doe",
      date: new Date().toISOString().split("T")[0],
      role: "MuleSoft Developer" as EmployeeRole,
      projects: [
        {
          id: "proj-1-1",
          clientName: "Acme Corp",
          hours: 4.5,
          isMPS: true,
          notes: "Frontend development and testing",
        },
        {
          id: "proj-1-2",
          clientName: "TechStart Inc",
          hours: 2.0,
          isMPS: false,
          notes: "Project planning session",
        },
      ],
      totalHours: 6.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      employeeName: "John Doe",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      role: "MuleSoft Developer" as EmployeeRole,
      projects: [
        {
          id: "proj-2-1",
          clientName: "Acme Corp",
          hours: 8.0,
          isMPS: true,
          notes: "Backend API development",
        },
      ],
      totalHours: 8.0,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      employeeName: "John Doe",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      role: "Data Engineer" as EmployeeRole,
      projects: [
        {
          id: "proj-3-1",
          clientName: "BigData Solutions",
          hours: 6.5,
          isMPS: false,
          notes: "Schema design and optimization",
        },
      ],
      totalHours: 6.5,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

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

    // Build calendar days array
    const days: CalendarDayTypes[] = [];
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
    calendarData.averageDaily = workingDays > 0 ? monthTotal / workingDays : 0;
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

  const goToToday = $(() => {
    currentDate.value = new Date();
  });

  // Day interaction handlers
  const handleDayClick = $((day: CalendarDayTypes) => {
    selectedDay.value = day;
    showDayModal.value = true;
  });

  // Helper functions
  const getMonthYearDisplay = () => {
    return currentDate.value.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleNewEntry = $((date?: string) => {
    const targetDate = date || DateUtils.getCurrentDate();
    window.location.href = `/entry`;
    // window.location.href = `/entry?date=${targetDate}`;
  });

  const handleEditEntry = $((entryId: string) => {
    window.location.href = `/entry`;
    // window.location.href = `/entry?edit=${entryId}`;
  });

  return (
    <div class="min-h-full p-6">
      <div class="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <CalendarHeader
          onAddEntry$={() => handleNewEntry()}
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
        <DayDetailsModal
          day={selectedDay.value}
          isOpen={showDayModal.value}
          onClose$={() => (showDayModal.value = false)}
          onAddEntry$={handleNewEntry}
          onEditEntry$={handleEditEntry}
        />
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
