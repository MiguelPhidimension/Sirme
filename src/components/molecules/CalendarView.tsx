import React, { useState, useEffect } from 'react';
import { Badge } from '../atoms';
import { DataUtils, DateUtils } from '~/utils';
import type { DailyTimeEntry, CalendarDay } from '~/types';

/**
 * Props interface for CalendarView component
 */
interface CalendarViewProps {
  entries: DailyTimeEntry[];
  onDayClick: (date: Date) => void;
  onNewEntryForDate: (date: Date) => void;
}

/**
 * CalendarView Molecule Component
 * Displays a monthly calendar with time entries and navigation.
 * Shows daily hours and allows interaction with calendar days.
 * Combines atoms to create a comprehensive calendar display.
 * 
 * Props:
 * - entries: Array of time entries to display on calendar
 * - onDayClick: Handler for when a calendar day is clicked
 * - onNewEntryForDate: Handler for creating new entries for specific dates
 * 
 * Example usage:
 * <CalendarView 
 *   entries={recentEntries} 
 *   onDayClick={handleDayClick}
 *   onNewEntryForDate={handleNewEntry}
 * />
 */
export const CalendarView: React.FC<CalendarViewProps> = ({ 
  entries, 
  onDayClick, 
  onNewEntryForDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Calendar data store
  const [calendarData, setCalendarData] = useState<{
    days: CalendarDay[];
    monthTotal: number;
    workingDays: number;
    averageDaily: number;
  }>({
    days: [],
    monthTotal: 0,
    workingDays: 0,
    averageDaily: 0
  });

  // Week day labels
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Utility functions
  const getMonthYearDisplay = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: string) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: string) => {
    return new Date(date).getMonth() === currentDate.getMonth();
  };

  const getHoursColorClass = (hours: number) => {
    if (hours === 0) return 'text-slate-400 dark:text-slate-500';
    if (hours < 4) return 'text-blue-400 dark:text-blue-300';
    if (hours < 8) return 'text-emerald-500 dark:text-emerald-400';
    if (hours === 8) return 'text-purple-500 dark:text-purple-400';
    return 'text-amber-500 dark:text-amber-400';
  };

  // Build calendar grid data for current month
  const buildCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
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
      // Format date manually to avoid timezone issues
      const year = currentDay.getFullYear();
      const month = String(currentDay.getMonth() + 1).padStart(2, '0');
      const day = String(currentDay.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayEntries = entries.filter(entry => entry.date === dateStr);
      const totalHours = dayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      
      // Only count current month days for statistics
      if (currentDay.getMonth() === currentDate.getMonth() && totalHours > 0) {
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
    setCalendarData({
      days,
      monthTotal,
      workingDays,
      averageDaily: workingDays > 0 ? monthTotal / workingDays : 0
    });
  };

  // Initialize calendar when component mounts or month changes
  useEffect(() => {
    buildCalendarData();
  }, [currentDate, entries]);

  // Navigation handlers
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Day interaction handlers
  const handleDayClick = (clickedDate: Date) => {
    setSelectedDay(clickedDate);
    onDayClick(clickedDate);
  };

  const handleNewEntry = () => {
    if (selectedDay) {
      onNewEntryForDate(selectedDay);
      setShowModal(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEntriesForDate = (date: Date) => {
    // Format date manually to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return entries.filter(entry => entry.date === dateStr);
  };

  const getTotalHoursForDate = (date: Date) => {
    const dayEntries = getEntriesForDate(date);
    return dayEntries.reduce((total, entry) => total + entry.totalHours, 0);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = getMonthYearDisplay();

  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      {/* Main calendar container */}
      <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
        
        {/* Calendar header with navigation */}
        <div className="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20">
          <div className="flex items-center justify-between">
            <button
              className="group flex items-center space-x-2 px-6 py-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
              onClick={() => navigateMonth(-1)}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Previous</span>
            </button>

            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <span className="text-3xl">📅</span>
              {monthName}
            </h2>

            <button
              className="group flex items-center space-x-2 px-6 py-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
              onClick={() => navigateMonth(1)}
            >
              <span className="font-medium">Next</span>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm">
          {weekDays.map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-r border-white/10 dark:border-slate-600/20 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Days from previous month */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => {
            const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -(firstDayOfMonth - i - 1));
            const dayEntries = getEntriesForDate(prevMonthDate);
            const totalHours = getTotalHoursForDate(prevMonthDate);
            const hasEntries = dayEntries.length > 0;
            const projectCount = dayEntries.reduce((count, entry) => count + entry.projects.length, 0);

            return (
              <div
                key={`prev-${i}`}
                onClick={() => handleDayClick(prevMonthDate)}
                className={`relative h-24 border-r border-b border-white/10 dark:border-slate-600/20 cursor-pointer transition-all duration-200 opacity-40 bg-white/5 dark:bg-slate-800/10 hover:bg-white/10 dark:hover:bg-slate-700/20`}
              >
                <div className="p-2 h-full flex flex-col">
                  {/* Day number */}
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-600">
                      {prevMonthDate.getDate()}
                    </span>
                  </div>
                  
                  {/* Entry information */}
                  {hasEntries && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-1">
                      {/* Total hours */}
                      <div className="text-emerald-400/60 font-bold text-sm">
                        {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
                      </div>
                      
                      {/* Project count */}
                      <div className="text-slate-400/60 text-xs">
                        {projectCount} project{projectCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Days of the current month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEntries = getEntriesForDate(date);
            const totalHours = getTotalHoursForDate(date);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDay && isSameDay(date, selectedDay);
            const hasEntries = dayEntries.length > 0;
            const projectCount = dayEntries.reduce((count, entry) => count + entry.projects.length, 0);

            return (
              <div
                key={day}
                onClick={() => handleDayClick(date)}
                className={`relative h-24 border-r border-b border-white/10 dark:border-slate-600/20 cursor-pointer transition-all duration-200 bg-white/5 dark:bg-slate-800/20 hover:bg-white/10 dark:hover:bg-slate-700/30 ${
                  isSelected 
                    ? 'ring-2 ring-blue-400' 
                    : ''
                } ${
                  isToday 
                    ? 'ring-1 ring-blue-300' 
                    : ''
                }`}
              >
                <div className="p-2 h-full flex flex-col">
                  {/* Day number - reduced font size */}
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold text-white ${
                      isToday 
                        ? 'text-blue-400' 
                        : ''
                    }`}>
                      {day}
                    </span>
                    {isToday && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Entry information - centered and properly spaced */}
                  {hasEntries && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-1">
                      {/* Total hours - increased font size */}
                      <div className="text-emerald-400 font-bold text-base">
                        {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
                      </div>
                      
                      {/* Project count - in gray */}
                      <div className="text-gray-400 text-xs">
                        {projectCount} project{projectCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Days from next month to complete the grid */}
          {(() => {
            const totalCellsUsed = firstDayOfMonth + daysInMonth;
            const remainingCells = totalCellsUsed % 7 === 0 ? 0 : 7 - (totalCellsUsed % 7);
            
            return Array.from({ length: remainingCells }, (_, i) => {
              const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1);
              const dayEntries = getEntriesForDate(nextMonthDate);
              const totalHours = getTotalHoursForDate(nextMonthDate);
              const hasEntries = dayEntries.length > 0;
              const projectCount = dayEntries.reduce((count, entry) => count + entry.projects.length, 0);

              return (
                <div
                  key={`next-${i}`}
                  onClick={() => handleDayClick(nextMonthDate)}
                  className={`relative h-24 border-r border-b border-white/10 dark:border-slate-600/20 cursor-pointer transition-all duration-200 opacity-40 bg-white/5 dark:bg-slate-800/10 hover:bg-white/10 dark:hover:bg-slate-700/20`}
                >
                  <div className="p-2 h-full flex flex-col">
                    {/* Day number */}
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-600">
                        {nextMonthDate.getDate()}
                      </span>
                    </div>
                    
                    {/* Entry information */}
                    {hasEntries && (
                      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-1">
                        {/* Total hours */}
                        <div className="text-emerald-400/60 font-bold text-sm">
                          {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
                        </div>
                        
                        {/* Project count */}
                        <div className="text-slate-400/60 text-xs">
                          {projectCount} project{projectCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Selected Day Info */}
      {selectedDay && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Selected Date
                </div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {formatDate(selectedDay)}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleNewEntry}
                className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 