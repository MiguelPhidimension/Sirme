import React, { useState, useEffect, useCallback } from 'react';
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
  onDateSelect?: (date: string) => void;
  onNewEntry?: (date: string) => void;
  onEditEntry?: (entryId: string) => void;
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
 *   onDateSelect={handleDateSelect}
 *   onNewEntry={handleNewEntry}
 * />
 */
export const Calendar: React.FC<CalendarProps> = ({
  entries = [],
  selectedDate,
  onDateSelect,
  onNewEntry,
  onEditEntry,
  isLoading = false
}) => {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);

  // Calendar data
  const [calendarData, setCalendarData] = useState<{
    days: CalendarDay[];
    monthTotal: number;
    averageDaily: number;
  }>({
    days: [],
    monthTotal: 0,
    averageDaily: 0
  });

  // Build calendar data for the current month
  const buildCalendarData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
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
    
    setCalendarData({
      days,
      monthTotal,
      averageDaily: daysWithEntries > 0 ? monthTotal / daysWithEntries : 0
    });
  }, [currentDate, entries]);

  // Initialize calendar data
  useEffect(() => {
    buildCalendarData();
  }, [buildCalendarData]);

  // Handle month navigation
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  }, [currentDate]);

  // Handle day click
  const handleDayClick = useCallback((date: string) => {
    const day = calendarData.days.find((d: CalendarDay) => d.date === date);
    if (day) {
      setSelectedDay(day);
      setShowDayDetails(true);
      onDateSelect && onDateSelect(date);
    }
  }, [calendarData.days, onDateSelect]);

  // Handle go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Get month/year display
  const getMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            📅 Time Calendar
          </h1>
          <p className="text-base-content/60 mt-1">
            View your time entries across different months
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button
            variant="primary"
            onClick={() => onNewEntry && onNewEntry(DateUtils.getCurrentDate())}
          >
            New Entry
          </Button>
        </div>
      </div>

      {/* Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Month Total</div>
            <div className="stat-value text-primary">
              {DataUtils.formatHours(calendarData.monthTotal)}
            </div>
            <div className="stat-desc">All logged hours this month</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Average Daily</div>
            <div className="stat-value text-success">
              {DataUtils.formatHours(calendarData.averageDaily)}
            </div>
            <div className="stat-desc">Average hours per working day</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Working Days</div>
            <div className="stat-value text-info">
              {calendarData.days.filter((d: CalendarDay) => d.hasEntries && new Date(d.date).getMonth() === currentDate.getMonth()).length}
            </div>
            <div className="stat-desc">Days with logged hours</div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigateMonth('prev')}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>

        <h2 className="text-2xl font-bold text-base-content">
          {getMonthYear()}
        </h2>

        <Button
          variant="ghost"
          onClick={() => navigateMonth('next')}
        >
          Next
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-0">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-base-200">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-base-content/60 bg-base-200">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarData.days.map((day: CalendarDay) => {
              const isCurrentMonth = new Date(day.date).getMonth() === currentDate.getMonth();
              return (
                <CalendarCell
                  key={day.date}
                  day={day}
                  isCurrentMonth={isCurrentMonth}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {showDayDetails && selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-base-content">
                    {DateUtils.formatDisplayDate(selectedDay.date)}
                  </h3>
                  <p className="text-base-content/60">
                    Total: {DataUtils.formatHours(selectedDay.totalHours)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  square
                  onClick={() => setShowDayDetails(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {selectedDay.entries && selectedDay.entries.length > 0 ? (
                <div className="space-y-4">
                  {selectedDay.entries.map((entry: any) => (
                    <div key={entry.id} className="border border-base-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{entry.employeeName}</span>
                            <Badge variant="primary" size="sm">
                              {entry.role}
                            </Badge>
                          </div>
                          <div className="text-sm text-base-content/60">
                            {entry.projects.length} project{entry.projects.length !== 1 ? 's' : ''} • 
                            Total: {DataUtils.formatHours(entry.totalHours)}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditEntry && onEditEntry(entry.id)}
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {entry.projects.map((project: any, index: number) => (
                          <div key={index} className="bg-base-200 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{project.clientName}</div>
                                <div className="text-sm text-base-content/60 flex items-center gap-2">
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
                              <p className="text-sm text-base-content/70 mt-2">
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
                <div className="text-center py-8 text-base-content/50">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No time entries for this day</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      onNewEntry && onNewEntry(selectedDay!.date);
                      setShowDayDetails(false);
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
}; 