import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { StatCard, ProjectEntryCard } from '../molecules';
import { Button, Badge } from '../atoms';
import { TimeEntryForm } from '../organisms';
import { DataUtils, DateUtils } from '~/utils';
import type { DashboardSummary, DailyTimeEntry, TimeEntryFormData } from '~/types';

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
 * Props interface for Dashboard component
 */
interface DashboardProps {
  summary?: DashboardSummary;
  recentEntries?: DailyTimeEntry[];
  onNewEntry$?: () => void;
  onViewCalendar$?: () => void;
  onEditEntry$?: (entryId: string) => void;
  isLoading?: boolean;
}

/**
 * Modern Dark Theme Dashboard Component
 * Elegant dark design with glassmorphism effects and modern styling
 * Matches the aesthetic of the entry page with DaisyUI dark theme
 */
export const Dashboard = component$<DashboardProps>(({
  summary,
  recentEntries = [],
  onNewEntry$,
  onViewCalendar$,
  onEditEntry$,
  isLoading = false
}) => {
  // Local state for filtering and display
  const selectedPeriod = useSignal<'day' | 'week' | 'month'>('week');
  const showAllEntries = useSignal(false);

  // Calendar state management
  const currentDate = useSignal(new Date());
  const selectedDay = useSignal<CalendarDay | null>(null);
  const showDayModal = useSignal(false);
  const showTimeEntryForm = useSignal(false);
  const timeEntryFormDate = useSignal('');
  const isSubmittingEntry = useSignal(false);
  const timeEntryTotalHours = useSignal(0);
  const showAddProject = useSignal(false);
  
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

  // Default summary data if not provided
  const defaultSummary: DashboardSummary = {
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    recentEntries: [],
    weeklyProgress: 0
  };

  const displaySummary = summary || defaultSummary;

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
    
    // Build calendar days array using recentEntries data
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    let monthTotal = 0;
    let workingDays = 0;
    
    while (currentDay <= endDate) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const dayEntries = recentEntries.filter(entry => entry.date === dateStr);
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
    track(() => recentEntries);
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

  // Handle new entry for a specific date
  const handleNewEntryForDate = $((date?: string) => {
    const targetDate = date || DateUtils.getCurrentDate();
    timeEntryFormDate.value = targetDate;
    showTimeEntryForm.value = true;
    showDayModal.value = false; // Close day modal when opening form
  });

  // Day interaction handlers
  const handleDayClick = $((day: CalendarDay) => {
    selectedDay.value = day;
    
    // If day has no entries, show time entry form directly
    if (!day.hasEntries || day.totalHours === 0) {
      handleNewEntryForDate(day.date);
    } else {
      // If day has entries, show day modal
      showDayModal.value = true;
    }
  });

  // Handle time entry form submission
  const handleTimeEntrySubmit = $(async (formData: TimeEntryFormData) => {
    isSubmittingEntry.value = true;
    
    try {
      // Simulate API call - replace with actual API integration
      console.log('Submitting time entry:', formData);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close form and refresh data
      showTimeEntryForm.value = false;
      
      // TODO: Refresh dashboard data or add the new entry to recentEntries
      // For now, we'll just close the form
      
      // Success feedback could be added here
      console.log('Time entry submitted successfully');
      
    } catch (error) {
      console.error('Failed to submit time entry:', error);
      // TODO: Show error message to user
    } finally {
      isSubmittingEntry.value = false;
    }
  });

  // Handle time entry form cancellation
  const handleTimeEntryCancel = $(() => {
    showTimeEntryForm.value = false;
    timeEntryFormDate.value = '';
    timeEntryTotalHours.value = 0;
    showAddProject.value = false;
  });

  // Handle total hours update from form
  const handleTotalHoursUpdate = $((totalHours: number) => {
    timeEntryTotalHours.value = totalHours;
  });

  // Handle add project click from header
  const handleAddProjectClick = $(() => {
    showAddProject.value = true;
    // We need to trigger the form to show the add project interface
    // This will be handled by passing a signal to the TimeEntryForm
  });

  // Handle period selection
  const handlePeriodChange = $((period: 'day' | 'week' | 'month') => {
    selectedPeriod.value = period;
  });

  // Get personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get progress status with dark theme colors
  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return { color: 'success', message: 'Target achieved! 🎉', bgColor: 'from-emerald-500/20 to-green-500/20' };
    if (progress >= 75) return { color: 'warning', message: 'Almost there! 💪', bgColor: 'from-amber-500/20 to-yellow-500/20' };
    if (progress >= 50) return { color: 'info', message: 'Good progress 👍', bgColor: 'from-blue-500/20 to-cyan-500/20' };
    return { color: 'primary', message: 'Keep going! 🚀', bgColor: 'from-purple-500/20 to-blue-500/20' };
  };

  // Helper functions for calendar
  const getMonthYearDisplay = () => {
    return currentDate.value.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: string) => {
    return date === DateUtils.getCurrentDate();
  };

  const isCurrentMonth = (date: string) => {
    return new Date(date).getMonth() === currentDate.value.getMonth();
  };

  const getHoursColorClass = (hours: number) => {
    if (hours === 0) return '';
    if (hours < 4) return 'text-blue-400 dark:text-blue-300';
    if (hours < 8) return 'text-emerald-500 dark:text-emerald-400';
    if (hours === 8) return 'text-purple-500 dark:text-purple-400';
    return 'text-amber-500 dark:text-amber-400';
  };

  // Week day labels
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="flex flex-col items-center space-y-4">
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const progressStatus = getProgressStatus(displaySummary.weeklyProgress);

  return (
    <div class="max-w-7xl mx-auto space-y-8">


      {/* Modern Stats Cards with Glassmorphism */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Today's Hours */}
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Today</p>
                <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {DataUtils.formatHours(displaySummary.todayHours)}
                </p>
              </div>
              <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Hours */}
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">This Week</p>
                <p class="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  {DataUtils.formatHours(displaySummary.weekHours)}
                </p>
              </div>
              <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Hours */}
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">This Month</p>
                <p class="text-4xl font-bold text-amber-600 dark:text-amber-400">
                  {DataUtils.formatHours(displaySummary.monthHours)}
                </p>
              </div>
              <div class="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section with Modern Design */}
      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
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
                      ? 'bg-white/5 dark:bg-slate-800/20 hover:bg-white/20 dark:hover:bg-slate-700/30  text-slate-400 dark:text-slate-400' 
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
                        <div class="px-2 py-1 bg-emerald-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
                          MPS
                        </div>
                      )}
                      {day.totalHours > 8 && (
                        <div class="px-2 py-1 bg-amber-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
                          OT
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Progress Section with Modern Design */}
      <div class="relative group">
        <div class={`absolute inset-0 bg-gradient-to-r ${progressStatus.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300`}></div>
        <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <span class="text-3xl">📈</span>
              Weekly Progress
            </h3>
            <div class={`badge badge-${progressStatus.color} badge-lg gap-2 bg-opacity-20 backdrop-blur-sm`}>
              {progressStatus.message}
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-300 text-lg">
                {displaySummary.weekHours.toFixed(1)}h of 40h completed
              </span>
              <span class="font-bold text-2xl text-slate-800 dark:text-slate-200">
                {displaySummary.weeklyProgress.toFixed(1)}%
              </span>
            </div>
            
            <div class="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div 
                class={`bg-gradient-to-r ${progressStatus.color === 'success' ? 'from-emerald-400 to-emerald-600' : 
                       progressStatus.color === 'warning' ? 'from-amber-400 to-amber-600' :
                       progressStatus.color === 'info' ? 'from-blue-400 to-blue-600' :
                       'from-purple-400 to-blue-600'} h-4 rounded-full transition-all duration-1000 ease-out shadow-lg`}
                style={`width: ${Math.min(displaySummary.weeklyProgress, 100)}%`}
              >
                <div class="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div class="text-slate-600 dark:text-slate-400">
              {40 - displaySummary.weekHours > 0 
                ? `${(40 - displaySummary.weekHours).toFixed(1)} hours remaining to reach your goal`
                : 'Goal achieved! Great work! 🎉'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Recent Time Entries with Modern Design */}
      <div class="relative group">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <span class="text-3xl">📋</span>
              Recent Time Entries
            </h3>
            {recentEntries.length > 3 && (
              <button
                class="px-4 py-2 bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-600/20 transition-all duration-200"
                onClick$={() => showAllEntries.value = !showAllEntries.value}
              >
                {showAllEntries.value ? 'Show Less' : `Show All (${recentEntries.length})`}
              </button>
            )}
          </div>

          {recentEntries.length === 0 ? (
            <div class="text-center py-16">
              <div class="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-3xl flex items-center justify-center">
                <svg class="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">No time entries yet</h4>
              <p class="text-slate-600 dark:text-slate-400 mb-6">Start tracking your time to see entries here</p>
              <button 
                class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick$={onNewEntry$}
              >
                Add Your First Entry
              </button>
            </div>
          ) : (
            <div class="space-y-6">
              {(showAllEntries.value ? recentEntries : recentEntries.slice(0, 3)).map((entry) => (
                <div key={entry.id} class="group relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div class="relative bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-600/20 p-6 hover:bg-white/30 dark:hover:bg-slate-700/40 transition-all duration-300">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <div class="flex items-center gap-4 mb-4">
                          <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {DateUtils.formatDisplayDate(entry.date)}
                          </h4>
                          <div class="badge badge-primary bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                            {entry.role}
                          </div>
                          {DateUtils.isToday(entry.date) && (
                            <div class="badge badge-success bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 animate-pulse">
                              Today
                            </div>
                          )}
                        </div>
                        
                        <div class="flex items-center gap-6 text-slate-600 dark:text-slate-400 mb-4">
                          <span class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="font-medium">{entry.employeeName}</span>
                          </span>
                          <span class="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {DataUtils.formatHours(entry.totalHours)}
                          </span>
                        </div>

                        <div class="flex flex-wrap gap-3">
                          {entry.projects.map((project, index) => (
                            <div key={index} class="bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm border border-white/20 dark:border-slate-500/20 rounded-xl px-4 py-2">
                              <div class="flex items-center gap-3 text-sm">
                                <span class="font-medium text-slate-700 dark:text-slate-300">{project.clientName}</span>
                                <span class="text-blue-600 dark:text-blue-400 font-bold">
                                  {DataUtils.formatHours(project.hours)}
                                </span>
                                {project.isMPS && (
                                  <div class="badge badge-xs badge-success bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                    MPS
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        class="ml-6 p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                        onClick$={() => onEditEntry$ && onEditEntry$(entry.id)}
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Day details modal with glassmorphism */}
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
                                <div class="badge badge-primary bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                                  {entry.role}
                                </div>
                              </div>
                              <div class="text-sm text-slate-600 dark:text-slate-400">
                                {entry.projects.length} project{entry.projects.length !== 1 ? 's' : ''} • 
                                Total: {DataUtils.formatHours(entry.totalHours)}
                              </div>
                            </div>
                            <button
                              class="px-4 py-2 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                              onClick$={() => onEditEntry$ && onEditEntry$(entry.id)}
                            >
                              Edit
                            </button>
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
                                        <div class="badge badge-xs badge-success bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                          MPS
                                        </div>
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
                        handleNewEntryForDate(selectedDay.value!.date);
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

      {/* Time Entry Form Modal */}
      {showTimeEntryForm.value && (
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="relative group max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              
              {/* Modal header */}
              <div class="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20 rounded-t-3xl">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      <span class="text-3xl">⏰</span>
                      Add Time Entry
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400 mt-1">
                      {timeEntryFormDate.value ? DateUtils.formatDisplayDate(timeEntryFormDate.value) : 'Select a date'}
                    </p>
                  </div>
                  
                  <div class="flex items-center space-x-4">
                    {/* Total Hours Display */}
                    <div class="text-slate-800 dark:text-slate-200 text-right">
                      <div class="text-sm text-slate-600 dark:text-slate-400">Total Hours</div>
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {DataUtils.formatHours(timeEntryTotalHours.value)}
                      </div>
                    </div>
                    
                    {/* Add Project Button */}
                    <button
                      class="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      onClick$={handleAddProjectClick}
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="font-medium">Add Project</span>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      class="p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                      onClick$={handleTimeEntryCancel}
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal content with TimeEntryForm */}
              <div class="p-8">
                <TimeEntryForm
                  mode="daily"
                  simplified={true}
                  showAddProjectInHeader={true}
                  showAddProjectSignal={showAddProject}
                  initialData={{
                    date: timeEntryFormDate.value,
                    employeeName: 'Current User',
                    role: 'Other',
                    projects: []
                  }}
                  onSubmit$={handleTimeEntrySubmit}
                  onCancel$={handleTimeEntryCancel}
                  onTotalHoursChange$={handleTotalHoursUpdate}
                  onAddProjectClick$={handleAddProjectClick}
                  isLoading={isSubmittingEntry.value}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Quick Time Entry */}
      <button
        class="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center group"
        onClick$={() => handleNewEntryForDate()}
        title="Add Time Entry"
      >
        <svg class="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}); 