import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { Badge } from '../atoms';
import { DataUtils, DateUtils } from '~/utils';
import type { DailyTimeEntry } from '~/types';

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
  onDayClick$?: (day: CalendarDay) => void;
  onNewEntryForDate$?: (date: string) => void;
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
export const CalendarView = component$<CalendarViewProps>(({ 
  entries, 
  onDayClick$, 
  onNewEntryForDate$ 
}) => {
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
    workingDays: 0
  });

  // Week day labels
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Utility functions
  const getMonthYearDisplay = () => {
    return currentDate.value.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: string) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: string) => {
    return new Date(date).getMonth() === currentDate.value.getMonth();
  };

  const getHoursColorClass = (hours: number) => {
    if (hours === 0) return 'text-slate-400 dark:text-slate-500';
    if (hours < 4) return 'text-blue-400 dark:text-blue-300';
    if (hours < 8) return 'text-emerald-500 dark:text-emerald-400';
    if (hours === 8) return 'text-purple-500 dark:text-purple-400';
    return 'text-amber-500 dark:text-amber-400';
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
      const dateStr = currentDay.toISOString().split('T')[0];
      const dayEntries = entries.filter(entry => entry.date === dateStr);
      const totalHours = dayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      
      // Only count current month days for statistics
      if (currentDay.getMonth() === month && totalHours > 0) {
        monthTotal += totalHours;
        workingDays++;
      }
      
      days.push({
        date: dateStr,
        totalHours,
        hasEntries: dayEntries.length > 0,
        entries: dayEntries
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
  const navigateMonth = $((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
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
  const handleDayClick = $((day: CalendarDay) => {
    selectedDay.value = day;
    
    // If day has no entries, show time entry form directly
    if (!day.hasEntries || day.totalHours === 0) {
      onNewEntryForDate$ && onNewEntryForDate$(day.date);
    } else {
      // If day has entries, show day modal
      showDayModal.value = true;
    }
    
    // Also call parent handler if provided
    onDayClick$ && onDayClick$(day);
  });

  return (
    <div class="relative group">
      {/* Background glow effect */}
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      {/* Main calendar container */}
      <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
        
        {/* Calendar header with navigation */}
        <div class="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20">
          <div class="flex items-center justify-between">
            <button
              class="group flex items-center space-x-2 px-6 py-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
              onClick$={() => navigateMonth('prev')}
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="font-medium">Previous</span>
            </button>

            <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <span class="text-3xl">📅</span>
              {getMonthYearDisplay()}
            </h2>

            <button
              class="group flex items-center space-x-2 px-6 py-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
              onClick$={() => navigateMonth('next')}
            >
              <span class="font-medium">Next</span>
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Week day headers */}
        <div class="grid grid-cols-7 bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm">
          {weekDays.map((day) => (
            <div key={day} class="p-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-r border-white/10 dark:border-slate-600/20 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div class="grid grid-cols-7">
          {calendarData.days.map((day, index) => {
            const dayNumber = new Date(day.date).getDate();
            const isCurrentMonthDay = isCurrentMonth(day.date);
            const isTodayDay = isToday(day.date);

            return (
              <div
                key={day.date}
                class={`
                  group relative h-28 md:h-36 p-3 border-r border-b border-white/10 dark:border-slate-600/20 cursor-pointer transition-all duration-300
                  ${isCurrentMonthDay 
                    ? 'bg-white/5 dark:bg-slate-800/20 hover:bg-white/20 dark:hover:bg-slate-700/30 text-slate-800 dark:text-slate-200' 
                    : 'bg-white/5 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600'
                  }
                  ${isTodayDay ? 'bg-blue-500/20 ring-2 ring-blue-400/50 dark:ring-blue-500/50' : ''}
                  ${day.hasEntries ? 'border-l-4 border-l-emerald-400 dark:border-l-emerald-500' : ''}
                  hover:shadow-lg hover:scale-105
                `}
                onClick$={() => handleDayClick(day)}
              >
                {/* Day number */}
                <div class="flex justify-between items-start mb-2">
                  <span class={`text-sm font-medium ${isTodayDay ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                    {dayNumber}
                  </span>
                  {isTodayDay && (
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                {/* Hours display */}
                {day.totalHours > 0 && (
                  <div class="flex flex-col items-center justify-center flex-1">
                    <div class={`text-xl font-bold ${getHoursColorClass(day.totalHours)}`}>
                      {DataUtils.formatHours(day.totalHours)}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {day.entries?.reduce((total, entry) => total + entry.projects.length, 0) || 0} project{(day.entries?.reduce((total, entry) => total + entry.projects.length, 0) || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                {/* Empty day indicator */}
                {day.totalHours === 0 && isCurrentMonthDay && (
                  <div class="flex items-center justify-center flex-1">
                    <div class="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}

                {/* Entry indicators */}
                {day.entries && day.entries.length > 0 && (
                  <div class="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
                    {day.entries.some(entry => entry.projects.some(project => project.isMPS)) && (
                      <Badge variant="success" class="px-2 py-1 bg-emerald-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
                        MPS
                      </Badge>
                    )}
                    {day.totalHours > 8 && (
                      <Badge variant="warning" class="px-2 py-1 bg-amber-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
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
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="relative group max-w-4xl w-full max-h-[85vh] overflow-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              
              {/* Modal header */}
              <div class="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20 rounded-t-3xl">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {DateUtils.formatDisplayDate(selectedDay.value.date)}
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400 mt-1">
                      Total: {DataUtils.formatHours(selectedDay.value.totalHours)}
                    </p>
                  </div>
                  <button
                    class="p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                    onClick$={() => showDayModal.value = false}
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal content */}
              <div class="p-8">
                {selectedDay.value.entries && selectedDay.value.entries.length > 0 ? (
                  <div class="space-y-6">
                    {selectedDay.value.entries.map((entry) => (
                      <div key={entry.id} class="group relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div class="relative bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-600/20 p-6 hover:bg-white/30 dark:hover:bg-slate-700/40 transition-all duration-300">
                          <div class="flex justify-between items-start mb-4">
                            <div>
                              <div class="flex items-center gap-3 mb-2">
                                <span class="text-lg font-semibold text-slate-800 dark:text-slate-200">{entry.employeeName}</span>
                                <Badge variant="primary" class="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                                  {entry.role}
                                </Badge>
                              </div>
                              <div class="text-sm text-slate-600 dark:text-slate-400">
                                {entry.projects.length} project{entry.projects.length !== 1 ? 's' : ''} • 
                                Total: {DataUtils.formatHours(entry.totalHours)}
                              </div>
                            </div>
                          </div>

                          <div class="space-y-3">
                            {entry.projects.map((project, index) => (
                              <div key={index} class="bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm border border-white/20 dark:border-slate-500/20 rounded-xl p-4">
                                <div class="flex justify-between items-start">
                                  <div class="flex-1">
                                    <div class="font-medium text-slate-800 dark:text-slate-200">{project.clientName}</div>
                                    <div class="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-3 mt-1">
                                      <span class="font-bold text-blue-600 dark:text-blue-400">
                                        {DataUtils.formatHours(project.hours)}
                                      </span>
                                      {project.isMPS && (
                                        <Badge variant="success" class="badge-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                          MPS
                                        </Badge>
                                      )}
                                    </div>
                                    {project.notes && (
                                      <p class="text-sm text-slate-700 dark:text-slate-300 mt-2 bg-white/10 dark:bg-slate-700/20 rounded-lg p-2">
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
                  <div class="text-center py-16">
                    <div class="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-3xl flex items-center justify-center">
                      <svg class="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">No time entries</h4>
                    <p class="text-slate-600 dark:text-slate-400 mb-6">You haven't logged any hours for this day yet.</p>
                    <button
                      class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      onClick$={() => {
                        onNewEntryForDate$ && onNewEntryForDate$(selectedDay.value!.date);
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
}); 