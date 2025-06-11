import { component$, useSignal, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { CalendarCell } from '../molecules';
import { Button, Badge } from '../atoms';
import { DateUtils, DataUtils } from '~/utils';
import type { CalendarDay, DailyTimeEntry } from '~/types';

/**
 * Props interface for Calendar component
 */
interface CalendarProps {
  entries?: DailyTimeEntry[];
  selectedDate?: string;
  onDateSelect$?: (date: string) => void;
  onNewEntry$?: (date: string) => void;
  onEditEntry$?: (entryId: string) => void;
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
export const Calendar = component$<CalendarProps>(({
  entries = [],
  selectedDate,
  onDateSelect$,
  onNewEntry$,
  onEditEntry$,
  isLoading = false
}) => {
  // Calendar state
  const currentDate = useSignal(new Date());
  const selectedDay = useSignal<CalendarDay | null>(null);
  const showDayDetails = useSignal(false);

  // Calendar data
  const calendarData = useStore<{
    days: CalendarDay[];
    monthTotal: number;
    averageDaily: number;
  }>({
    days: [],
    monthTotal: 0,
    averageDaily: 0
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
    const days: CalendarDay[] = [];
    const currentDay = new Date(startOfWeek);
    
    let monthTotal = 0;
    let daysWithEntries = 0;
    
    while (currentDay <= endOfWeek) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const dayEntries = entries.filter(entry => entry.date === dateStr);
      const totalHours = dayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      
      if (currentDay.getMonth() === month && totalHours > 0) {
        monthTotal += totalHours;
        daysWithEntries++;
      }
      
      days.push({
        date: dateStr,
        totalHours,
        hasEntries: dayEntries.length > 0,
        entries: dayEntries
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    calendarData.days = days;
    calendarData.monthTotal = monthTotal;
    calendarData.averageDaily = daysWithEntries > 0 ? monthTotal / daysWithEntries : 0;
  });

  // Initialize calendar data
  useVisibleTask$(({ track }) => {
    track(() => currentDate.value);
    track(() => entries);
    buildCalendarData();
  });

  // Handle month navigation
  const navigateMonth = $((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    currentDate.value = newDate;
  });

  // Handle day click
  const handleDayClick = $((date: string) => {
    const day = calendarData.days.find(d => d.date === date);
    if (day) {
      selectedDay.value = day;
      showDayDetails.value = true;
      onDateSelect$ && onDateSelect$(date);
    }
  });

  // Handle go to today
  const goToToday = $(() => {
    currentDate.value = new Date();
  });

  // Get month/year display
  const getMonthYear = () => {
    return currentDate.value.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {/* Calendar Header */}
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-base-content">
            📅 Time Calendar
          </h1>
          <p class="text-base-content/60 mt-1">
            View your time entries across different months
          </p>
        </div>

        <div class="flex gap-2">
          <Button
            variant="ghost"
            onClick$={goToToday}
          >
            Today
          </Button>
          <Button
            variant="primary"
            onClick$={() => onNewEntry$ && onNewEntry$(DateUtils.getCurrentDate())}
          >
            New Entry
          </Button>
        </div>
      </div>

      {/* Month Summary */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Month Total</div>
            <div class="stat-value text-primary">
              {DataUtils.formatHours(calendarData.monthTotal)}
            </div>
            <div class="stat-desc">All logged hours this month</div>
          </div>
        </div>

        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Average Daily</div>
            <div class="stat-value text-success">
              {DataUtils.formatHours(calendarData.averageDaily)}
            </div>
            <div class="stat-desc">Average hours per working day</div>
          </div>
        </div>

        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Working Days</div>
            <div class="stat-value text-info">
              {calendarData.days.filter(d => d.hasEntries && new Date(d.date).getMonth() === currentDate.value.getMonth()).length}
            </div>
            <div class="stat-desc">Days with logged hours</div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div class="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick$={() => navigateMonth('prev')}
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>

        <h2 class="text-2xl font-bold text-base-content">
          {getMonthYear()}
        </h2>

        <Button
          variant="ghost"
          onClick$={() => navigateMonth('next')}
        >
          Next
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Calendar Grid */}
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-0">
          {/* Week day headers */}
          <div class="grid grid-cols-7 border-b border-base-200">
            {weekDays.map((day) => (
              <div key={day} class="p-4 text-center font-semibold text-base-content/60 bg-base-200">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div class="grid grid-cols-7">
            {calendarData.days.map((day) => {
              const isCurrentMonth = new Date(day.date).getMonth() === currentDate.value.getMonth();
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
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="card bg-base-100 w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div class="card-body">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-base-content">
                    {DateUtils.formatDisplayDate(selectedDay.value.date)}
                  </h3>
                  <p class="text-base-content/60">
                    Total: {DataUtils.formatHours(selectedDay.value.totalHours)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  square
                  onClick$={() => showDayDetails.value = false}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {selectedDay.value.entries && selectedDay.value.entries.length > 0 ? (
                <div class="space-y-4">
                  {selectedDay.value.entries.map((entry) => (
                    <div key={entry.id} class="border border-base-200 rounded-lg p-4">
                      <div class="flex justify-between items-start mb-3">
                        <div>
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold">{entry.employeeName}</span>
                            <Badge variant="primary" size="sm">
                              {entry.role}
                            </Badge>
                          </div>
                          <div class="text-sm text-base-content/60">
                            {entry.projects.length} project{entry.projects.length !== 1 ? 's' : ''} • 
                            Total: {DataUtils.formatHours(entry.totalHours)}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick$={() => onEditEntry$ && onEditEntry$(entry.id)}
                        >
                          Edit
                        </Button>
                      </div>

                      <div class="space-y-2">
                        {entry.projects.map((project, index) => (
                          <div key={index} class="bg-base-200 p-3 rounded">
                            <div class="flex justify-between items-start">
                              <div>
                                <div class="font-medium">{project.clientName}</div>
                                <div class="text-sm text-base-content/60 flex items-center gap-2">
                                  <span>{DataUtils.formatHours(project.hours)}</span>
                                  {project.isMPS && (
                                    <Badge variant="success" size="xs">
                                      MPS
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {project.notes && (
                              <p class="text-sm text-base-content/70 mt-2">
                                {project.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="text-center py-8 text-base-content/50">
                  <div class="text-4xl mb-2">📝</div>
                  <p>No time entries for this day</p>
                  <Button
                    variant="primary"
                    size="sm"
                    class="mt-4"
                    onClick$={() => {
                      onNewEntry$ && onNewEntry$(selectedDay.value!.date);
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
}); 