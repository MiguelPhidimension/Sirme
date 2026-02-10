import {
  component$,
  useSignal,
  useTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import {
  LuChevronLeft,
  LuChevronRight,
  LuCalendar,
} from "@qwikest/icons/lucide";
import { graphqlClient } from "~/graphql/client";

// ============================================================================
// TYPES
// ============================================================================

interface CalendarDayData {
  date: string;
  totalHours: number;
  projectCount: number;
  isPTO: boolean;
  isHoliday: boolean;
  projects: Array<{
    projectId: string;
    projectName: string;
    hours: number;
  }>;
}

interface CollaboratorCalendarProps {
  userId: string;
  startDate: string; // filter start date (YYYY-MM-DD)
  endDate: string; // filter end date   (YYYY-MM-DD)
  fullName: string;
}

// Color palette matching the parent modal
const DAY_PROJECT_COLORS = [
  "bg-gradient-to-r from-blue-500 to-indigo-600",
  "bg-gradient-to-r from-purple-500 to-fuchsia-600",
  "bg-gradient-to-r from-emerald-500 to-teal-600",
  "bg-gradient-to-r from-amber-500 to-orange-600",
  "bg-gradient-to-r from-rose-500 to-pink-600",
  "bg-gradient-to-r from-cyan-500 to-sky-600",
];

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const GET_USER_TIME_ENTRIES = `
  query GetUserTimeEntries($user_id: uuid!, $start_date: date!, $end_date: date!) {
    time_entries(
      where: {
        user_id: { _eq: $user_id }
        entry_date: { _gte: $start_date, _lte: $end_date }
      }
      order_by: { entry_date: asc }
    ) {
      time_entry_id
      entry_date
      is_pto
      is_holiday
    }
  }
`;

const GET_ENTRY_PROJECTS = `
  query GetEntryProjects($time_entry_ids: [uuid!]!) {
    time_entry_projects(where: { time_entry_id: { _in: $time_entry_ids } }) {
      tep_id
      time_entry_id
      project_id
      hours_reported
    }
  }
`;

const GET_PROJECT_NAMES = `
  query GetProjectNames($project_ids: [uuid!]!) {
    projects(where: { project_id: { _in: $project_ids } }) {
      project_id
      name
    }
  }
`;

// ============================================================================
// HELPERS
// ============================================================================

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0=Sun

  const days: Array<{ date: string; day: number } | null> = [];

  // Leading blanks
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    days.push({ date: `${year}-${mm}-${dd}`, day: d });
  }

  return days;
}

function formatMonthYear(year: number, month: number) {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CollaboratorCalendar = component$<CollaboratorCalendarProps>(
  (props) => {
    // Parse filter start/end to determine the initial month to show
    const startParts = props.startDate.split("-").map(Number);
    const currentYear = useSignal(startParts[0]);
    const currentMonth = useSignal(startParts[1] - 1); // 0-based

    const calendarData = useSignal<Record<string, CalendarDayData>>({});
    const loading = useSignal(false);

    // Fetch data when month changes
    useTask$(async ({ track }) => {
      const year = track(() => currentYear.value);
      const month = track(() => currentMonth.value);
      const userId = props.userId;

      if (!userId) return;

      loading.value = true;

      try {
        const mm = String(month + 1).padStart(2, "0");
        const lastDay = new Date(year, month + 1, 0).getDate();
        const monthStart = `${year}-${mm}-01`;
        const monthEnd = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`;

        // 1. Fetch time entries for the month
        const entriesRes = await graphqlClient.request<{
          time_entries: Array<{
            time_entry_id: string;
            entry_date: string;
            is_pto: boolean;
            is_holiday: boolean;
          }>;
        }>(GET_USER_TIME_ENTRIES, {
          user_id: userId,
          start_date: monthStart,
          end_date: monthEnd,
        });

        const entries = entriesRes.time_entries || [];

        if (entries.length === 0) {
          calendarData.value = {};
          loading.value = false;
          return;
        }

        const entryIds = entries.map((e) => e.time_entry_id);

        // 2. Fetch projects for these entries
        const projRes = await graphqlClient.request<{
          time_entry_projects: Array<{
            tep_id: string;
            time_entry_id: string;
            project_id: string;
            hours_reported: number;
          }>;
        }>(GET_ENTRY_PROJECTS, { time_entry_ids: entryIds });

        const tepList = projRes.time_entry_projects || [];

        // 3. Fetch project names
        const uniqueProjectIds = [...new Set(tepList.map((t) => t.project_id))];
        let projectNameMap = new Map<string, string>();

        if (uniqueProjectIds.length > 0) {
          const namesRes = await graphqlClient.request<{
            projects: Array<{ project_id: string; name: string }>;
          }>(GET_PROJECT_NAMES, { project_ids: uniqueProjectIds });

          projectNameMap = new Map(
            (namesRes.projects || []).map((p) => [p.project_id, p.name]),
          );
        }

        // 4. Build calendar data keyed by date
        const tepByEntry = new Map<string, typeof tepList>();
        for (const tep of tepList) {
          if (!tepByEntry.has(tep.time_entry_id)) {
            tepByEntry.set(tep.time_entry_id, []);
          }
          tepByEntry.get(tep.time_entry_id)!.push(tep);
        }

        const result: Record<string, CalendarDayData> = {};

        for (const entry of entries) {
          const date = entry.entry_date;
          const entryProjects = tepByEntry.get(entry.time_entry_id) || [];

          const projectsAgg = new Map<
            string,
            { projectId: string; projectName: string; hours: number }
          >();

          let dayHours = 0;
          for (const tep of entryProjects) {
            const hours = parseFloat(String(tep.hours_reported)) || 0;
            dayHours += hours;
            const existing = projectsAgg.get(tep.project_id);
            if (existing) {
              existing.hours += hours;
            } else {
              projectsAgg.set(tep.project_id, {
                projectId: tep.project_id,
                projectName: projectNameMap.get(tep.project_id) || "Unknown",
                hours,
              });
            }
          }

          if (result[date]) {
            // Merge multiple entries for same date
            result[date].totalHours += dayHours;
            result[date].isPTO = result[date].isPTO || entry.is_pto;
            result[date].isHoliday = result[date].isHoliday || entry.is_holiday;
            for (const [pid, proj] of projectsAgg) {
              const existing = result[date].projects.find(
                (p) => p.projectId === pid,
              );
              if (existing) {
                existing.hours += proj.hours;
              } else {
                result[date].projects.push(proj);
              }
            }
            result[date].projectCount = result[date].projects.length;
          } else {
            result[date] = {
              date,
              totalHours: dayHours,
              projectCount: projectsAgg.size,
              isPTO: entry.is_pto || false,
              isHoliday: entry.is_holiday || false,
              projects: Array.from(projectsAgg.values()),
            };
          }
        }

        calendarData.value = result;
      } catch (err) {
        console.error("Error fetching calendar data:", err);
        calendarData.value = {};
      } finally {
        loading.value = false;
      }
    });

    const goToPreviousMonth = $(() => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
      } else {
        currentMonth.value -= 1;
      }
    });

    const goToNextMonth = $(() => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
      } else {
        currentMonth.value += 1;
      }
    });

    const days = useComputed$(() =>
      getMonthDays(currentYear.value, currentMonth.value),
    );
    const monthLabel = useComputed$(() =>
      formatMonthYear(currentYear.value, currentMonth.value),
    );
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div class="mx-6 mb-4 rounded-xl border border-gray-100 bg-gray-50/80 p-5 dark:border-slate-700/50 dark:bg-slate-700/30">
        {/* Header */}
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <LuCalendar class="h-4 w-4 text-blue-500" />
            Hours Calendar
          </h3>
          <div class="flex items-center gap-3">
            <button
              onClick$={goToPreviousMonth}
              class="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              <LuChevronLeft class="h-3.5 w-3.5" />
              Previous
            </button>
            <span class="min-w-[140px] text-center text-sm font-semibold text-gray-900 dark:text-white">
              {monthLabel.value}
            </span>
            <button
              onClick$={goToNextMonth}
              class="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              Next
              <LuChevronRight class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading.value && (
          <div class="flex items-center justify-center py-8">
            <div class="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
              Loading calendar...
            </span>
          </div>
        )}

        {/* Calendar Grid */}
        {!loading.value && (
          <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-600">
            {/* Weekday headers */}
            <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-100 dark:border-slate-600 dark:bg-slate-600/50">
              {weekDays.map((wd) => (
                <div
                  key={wd}
                  class="py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div class="grid grid-cols-7">
              {days.value.map((cell, idx) => {
                if (!cell) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      class="min-h-[80px] border-r border-b border-gray-200 bg-gray-50/50 dark:border-slate-600/50 dark:bg-slate-800/30"
                    ></div>
                  );
                }

                const dayData = calendarData.value[cell.date];
                const hasData = dayData && dayData.totalHours > 0;
                const isPTO = dayData?.isPTO;
                const isHoliday = dayData?.isHoliday;

                // Determine hour color
                const getHourColor = (hours: number) => {
                  if (hours >= 8)
                    return "text-emerald-500 dark:text-emerald-400";
                  if (hours >= 6) return "text-blue-500 dark:text-blue-400";
                  if (hours >= 4) return "text-amber-500 dark:text-amber-400";
                  return "text-rose-500 dark:text-rose-400";
                };

                return (
                  <div
                    key={cell.date}
                    class={`group relative flex min-h-[80px] flex-col border-r border-b border-gray-200 p-1.5 transition-colors dark:border-slate-600/50 ${
                      hasData
                        ? "bg-white hover:bg-blue-50/50 dark:bg-slate-700/60 dark:hover:bg-slate-700/80"
                        : isPTO
                          ? "bg-orange-50/50 dark:bg-orange-900/10"
                          : isHoliday
                            ? "bg-rose-50/50 dark:bg-rose-900/10"
                            : "bg-white dark:bg-slate-800/40"
                    }`}
                  >
                    {/* Day number */}
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {cell.day}
                    </span>

                    {/* Hours */}
                    {hasData && (
                      <div class="flex flex-1 flex-col items-center justify-center">
                        <span
                          class={`font-mono text-lg font-bold ${getHourColor(dayData.totalHours)}`}
                        >
                          {dayData.totalHours}h
                        </span>
                        <span class="text-[10px] text-gray-400 dark:text-gray-500">
                          {dayData.projectCount}{" "}
                          {dayData.projectCount === 1 ? "project" : "projects"}
                        </span>
                      </div>
                    )}

                    {/* PTO/Holiday label */}
                    {isPTO && !hasData && (
                      <div class="flex flex-1 items-center justify-center">
                        <span class="text-xs font-medium text-orange-500">
                          PTO
                        </span>
                      </div>
                    )}
                    {isHoliday && !hasData && !isPTO && (
                      <div class="flex flex-1 items-center justify-center">
                        <span class="text-xs font-medium text-rose-500">
                          Holiday
                        </span>
                      </div>
                    )}

                    {/* Project color bars at bottom */}
                    {hasData && dayData.projects.length > 0 && (
                      <div class="mt-auto flex h-1.5 w-full gap-[1px] overflow-hidden rounded-full">
                        {dayData.projects.map((proj, pidx) => {
                          const totalDayHours = dayData.totalHours || 1;
                          const widthPct = (proj.hours / totalDayHours) * 100;
                          const colorClass =
                            DAY_PROJECT_COLORS[
                              pidx % DAY_PROJECT_COLORS.length
                            ];
                          return (
                            <div
                              key={proj.projectId}
                              class={`h-full ${colorClass}`}
                              style={`width: ${widthPct}%`}
                              title={`${proj.projectName}: ${proj.hours}h`}
                            ></div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);
