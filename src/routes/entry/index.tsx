import React, { useState, useEffect } from 'react';
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
const EntryPage: React.FC = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStart(new Date().toISOString().split('T')[0]));
  
  // Calendar navigation state
  const currentDate = new Date();
  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear());

  // Updated initial data structure to match expected types
  const [initialData, setInitialData] = useState({
    employeeName: '',
    date: selectedDate,
    role: 'Other' as const,
    projects: [
      {
        clientName: 'Acme Corp',
        projectName: 'E-commerce Platform',
        hours: 4.5,
        isMPS: true,
        notes: 'Frontend development work'
      }
    ]
  });

  // Sync the selected date with form data whenever it changes
  useEffect(() => {
    setInitialData(prev => ({
      ...prev,
      date: selectedDate
    }));
  }, [selectedDate]);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (mode === 'weekly') {
      setSelectedWeekStart(getWeekStart(date));
    }
  };

  // Handle week selection (when clicking on week number or any day in weekly mode)
  const handleWeekSelect = (date: string) => {
    const weekStart = getWeekStart(date);
    setSelectedWeekStart(weekStart);
    setSelectedDate(date); // Keep the clicked date as the primary selection
  };

  // Navigate calendar months
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(prev => prev - 1);
      } else {
        setCalendarMonth(prev => prev - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(prev => prev + 1);
      } else {
        setCalendarMonth(prev => prev + 1);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    
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
      setIsLoading(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Navigate back to dashboard
    window.location.href = '/';
  };

  // Get calendar data
  const calendarWeeks = getCalendarGrid(calendarYear, calendarMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Helper function to check if a date is in the selected week
  const isInSelectedWeek = (date: string) => {
    if (mode !== 'weekly') return false;
    const weekDates = getWeekDates(selectedWeekStart);
    return weekDates.includes(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Instructions Banner */}
      <div className="pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Time Entry Instructions</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Use the calendar above to select your preferred date or week, then enter your employee information and project details below. 
                  You can add multiple projects for the selected period. All fields are required for submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Date Selection Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl p-6">
            {/* Header with Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Date</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === 'daily' ? 'Click on a date to select' : 'Click on any day to select the entire week'}
                  </p>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 p-1">
                <div className="flex space-x-1">
                  <button 
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      mode === 'daily' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => {
                      setMode('daily');
                    }}
                  >
                    Daily
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      mode === 'weekly' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    onClick={() => {
                      setMode('weekly');
                      setSelectedWeekStart(getWeekStart(selectedDate));
                    }}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                onClick={() => navigateMonth('prev')}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {monthNames[calendarMonth]} {calendarYear}
              </h3>
              
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                onClick={() => navigateMonth('next')}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 dark:bg-slate-600">
                {dayNames.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Weeks */}
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200 dark:border-slate-600">
                  {week.map((day, dayIndex) => {
                    const isSelected = mode === 'daily' 
                      ? day.date === selectedDate
                      : isInSelectedWeek(day.date);
                    const isWeekSelected = mode === 'weekly' && isInSelectedWeek(day.date);
                    
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`relative p-3 h-14 border-r border-gray-200 dark:border-slate-600 cursor-pointer transition-all duration-200 ${
                          !day.isCurrentMonth 
                            ? 'text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-slate-800/50' 
                            : 'text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600'
                        } ${
                          isSelected 
                            ? mode === 'daily'
                              ? 'bg-blue-500 text-white font-bold shadow-md' 
                              : 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                            : ''
                        } ${
                          day.isToday && !isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 font-semibold'
                            : ''
                        }`}
                        onClick={() => {
                          if (mode === 'daily') {
                            handleDateSelect(day.date);
                          } else {
                            handleWeekSelect(day.date);
                          }
                        }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <span className={`text-sm ${isSelected && mode === 'daily' ? 'text-white' : ''}`}>
                            {day.day}
                          </span>
                        </div>
                        
                        {/* Today indicator */}
                        {day.isToday && !isSelected && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                        )}
                        
                        {/* Week selection indicator */}
                        {mode === 'weekly' && isWeekSelected && (
                          <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mode === 'daily' ? 'Selected Date' : 'Selected Week'}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {mode === 'daily' ? (
                        new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      ) : (
                        (() => {
                          const dates = getWeekDates(selectedWeekStart);
                          const lastDate = dates[6];
                          return `${new Date(selectedWeekStart).toLocaleDateString('en-US', { 
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
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      if (mode === 'daily') {
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
        mode={mode}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EntryPage; 