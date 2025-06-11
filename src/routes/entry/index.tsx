import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TimeEntryForm } from "~/components/organisms";

/**
 * Helper function to get week start date (Monday)
 * This doesn't need to be serialized since it's a pure function
 */
const getWeekStart = (date: string) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

/**
 * Helper function to get week dates array
 * This doesn't need to be serialized since it's a pure function
 */
const getWeekDates = (startDate: string) => {
  const dates = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

/**
 * Helper function to get calendar grid for a month
 */
const getCalendarGrid = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Get the first day of week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay.getDay();
  // Convert to Monday = 0, Sunday = 6
  const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const weeks = [];
  let currentWeek = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, 1 - (startDay - i));
    currentWeek.push({
      date: prevDate.toISOString().split('T')[0],
      day: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Add days of the current month
  const today = new Date().toISOString().split('T')[0];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    currentWeek.push({
      date: dateStr,
      day: day,
      isCurrentMonth: true,
      isToday: dateStr === today
    });
    
    // If week is complete (7 days), add to weeks array
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Fill the last week with next month's days if needed
  if (currentWeek.length > 0) {
    const nextMonthStart = 1;
    for (let i = currentWeek.length; i < 7; i++) {
      const nextDate: Date = new Date(year, month + 1, nextMonthStart + (i - currentWeek.length));
      currentWeek.push({
        date: nextDate.toISOString().split('T')[0],
        day: nextDate.getDate(),
        isCurrentMonth: false,
        isToday: false
      });
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
};

/**
 * Time entry page component
 * Provides interface for adding and editing time entries with calendar date selection
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const mode = useSignal<'daily' | 'weekly'>('daily');
  const selectedDate = useSignal(new Date().toISOString().split('T')[0]);
  const selectedWeekStart = useSignal(getWeekStart(new Date().toISOString().split('T')[0]));
  
  // Calendar navigation state
  const currentDate = new Date();
  const calendarMonth = useSignal(currentDate.getMonth());
  const calendarYear = useSignal(currentDate.getFullYear());

  // Handle date selection
  const handleDateSelect = $((date: string) => {
    selectedDate.value = date;
    if (mode.value === 'weekly') {
      selectedWeekStart.value = getWeekStart(date);
    }
    syncDateWithForm();
  });

  // Handle week selection (when clicking on week number or any day in weekly mode)
  const handleWeekSelect = $((date: string) => {
    const weekStart = getWeekStart(date);
    selectedWeekStart.value = weekStart;
    selectedDate.value = date; // Keep the clicked date as the primary selection
    syncDateWithForm();
  });

  // Navigate calendar months
  const navigateMonth = $((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (calendarMonth.value === 0) {
        calendarMonth.value = 11;
        calendarYear.value--;
      } else {
        calendarMonth.value--;
      }
    } else {
      if (calendarMonth.value === 11) {
        calendarMonth.value = 0;
        calendarYear.value++;
      } else {
        calendarMonth.value++;
      }
    }
  });

  // Updated initial data structure to match expected types
  const initialData = useStore({
    employeeName: '',
    date: selectedDate.value,
    role: 'Other' as const,
    projects: [
      {
        clientName: '',
        hours: 0,
        isMPS: false,
        notes: ''
      }
    ]
  });

  // Sync the selected date with form data whenever it changes
  const syncDateWithForm = $(() => {
    initialData.date = selectedDate.value;
  });

  // Handle form submission
  const handleSubmit = $(async (formData: any) => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      console.log('Submitting time entry:', formData);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to submit time entry:', error);
      // TODO: Show error message to user
    } finally {
      isLoading.value = false;
    }
  });

  // Handle form cancellation
  const handleCancel = $(() => {
    // Navigate back to dashboard
    window.location.href = '/';
  });

  // Get calendar data
  const calendarWeeks = getCalendarGrid(calendarYear.value, calendarMonth.value);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Helper function to check if a date is in the selected week
  const isInSelectedWeek = (date: string) => {
    if (mode.value !== 'weekly') return false;
    const weekDates = getWeekDates(selectedWeekStart.value);
    return weekDates.includes(date);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Instructions Banner */}
      <div class="pb-8">
        <div class="max-w-4xl mx-auto px-6">
          <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Time Entry Instructions</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Use the calendar above to select your preferred date or week, then enter your employee information and project details below. 
                  You can add multiple projects for the selected period. All fields are required for submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Date Selection Section */}
      <div class="pt-24 pb-8">
        <div class="max-w-4xl mx-auto px-6">
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl p-6">
            {/* Header with Mode Toggle */}
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Select Date</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {mode.value === 'daily' ? 'Click on a date to select' : 'Click on any day to select the entire week'}
                  </p>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div class="bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 p-1">
                <div class="flex space-x-1">
                  <button 
                    class={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      mode.value === 'daily' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick$={() => {
                      mode.value = 'daily';
                    }}
                  >
                    Daily
                  </button>
                  <button 
                    class={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      mode.value === 'weekly' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick$={() => {
                      mode.value = 'weekly';
                      selectedWeekStart.value = getWeekStart(selectedDate.value);
                    }}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div class="flex justify-between items-center mb-4">
              <button
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                onClick$={() => navigateMonth('prev')}
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {monthNames[calendarMonth.value]} {calendarYear.value}
              </h3>
              
              <button
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                onClick$={() => navigateMonth('next')}
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div class="bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden">
              {/* Day Headers */}
              <div class="grid grid-cols-7 bg-gray-50 dark:bg-slate-600">
                {dayNames.map((day) => (
                  <div key={day} class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Weeks */}
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} class="grid grid-cols-7 border-t border-gray-200 dark:border-slate-600">
                  {week.map((day, dayIndex) => {
                    const isSelected = mode.value === 'daily' 
                      ? day.date === selectedDate.value
                      : isInSelectedWeek(day.date);
                    const isWeekSelected = mode.value === 'weekly' && isInSelectedWeek(day.date);
                    
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        class={`relative p-3 h-14 border-r border-gray-200 dark:border-slate-600 cursor-pointer transition-all duration-200 ${
                          !day.isCurrentMonth 
                            ? 'text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-slate-800/50' 
                            : 'text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600'
                        } ${
                          isSelected 
                            ? mode.value === 'daily'
                              ? 'bg-blue-500 text-white font-bold shadow-md' 
                              : 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                            : ''
                        } ${
                          day.isToday && !isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 font-semibold'
                            : ''
                        }`}
                        onClick$={() => {
                          if (mode.value === 'daily') {
                            handleDateSelect(day.date);
                          } else {
                            handleWeekSelect(day.date);
                          }
                        }}
                      >
                        <div class="flex items-center justify-center h-full">
                          <span class={`text-sm ${isSelected && mode.value === 'daily' ? 'text-white' : ''}`}>
                            {day.day}
                          </span>
                        </div>
                        
                        {/* Today indicator */}
                        {day.isToday && !isSelected && (
                          <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                        )}
                        
                        {/* Week selection indicator */}
                        {mode.value === 'weekly' && isWeekSelected && (
                          <div class="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            <div class="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {mode.value === 'daily' ? 'Selected Date' : 'Selected Week'}
                    </div>
                    <div class="font-bold text-gray-900 dark:text-white">
                      {mode.value === 'daily' ? (
                        new Date(selectedDate.value).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      ) : (
                        (() => {
                          const dates = getWeekDates(selectedWeekStart.value);
                          const lastDate = dates[6];
                          return `${new Date(selectedWeekStart.value).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} - ${new Date(lastDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}`;
                        })()
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div class="flex space-x-2">
                  <button
                    class="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                    onClick$={() => {
                      const today = new Date().toISOString().split('T')[0];
                      if (mode.value === 'daily') {
                        handleDateSelect(today);
                      } else {
                        handleWeekSelect(today);
                      }
                    }}
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Time Entry Form */}
      <TimeEntryForm
        mode={mode.value}
        initialData={initialData}
        onSubmit$={handleSubmit}
        onCancel$={handleCancel}
        isLoading={isLoading.value}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Time Entry - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Add or edit time tracking entries for projects and tasks with a modern, intuitive interface",
    },
  ],
}; 