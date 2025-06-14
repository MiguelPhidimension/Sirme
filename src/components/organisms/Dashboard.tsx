import React, { useState } from 'react';
import { DashboardStats, WeeklyProgress, RecentEntries, CalendarView } from '../molecules';
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
  projectCount: number;
  hasMPS: boolean;
  entries?: DailyTimeEntry[];
}

/**
 * Props interface for Dashboard component
 */
interface DashboardProps {
  summary?: DashboardSummary;
  recentEntries?: DailyTimeEntry[];
  onNewEntry?: () => void;
  onViewCalendar?: () => void;
  onEditEntry?: (entryId: string) => void;
  onSubmitTimeEntry?: (formData: TimeEntryFormData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Dashboard Organism Component
 * Main dashboard that displays time tracking overview and statistics.
 * Composes multiple molecules and atoms to create a comprehensive dashboard view.
 * Manages time entry form interactions and provides quick actions.
 * 
 * Props:
 * - summary: Dashboard summary data
 * - recentEntries: Recent time entries for display
 * - onNewEntry: Handler for creating new entries
 * - onViewCalendar: Handler for viewing calendar
 * - onEditEntry: Handler for editing existing entries
 * - onSubmitTimeEntry: Handler for submitting time entry form data
 * - isLoading: Loading state
 * 
 * Example usage:
 * <Dashboard 
 *   summary={summary} 
 *   recentEntries={entries} 
 *   onNewEntry={handleNewEntry}
 *   onEditEntry={handleEdit}
 *   onSubmitTimeEntry={handleSubmitTimeEntry}
 *   isLoading={false}
 * />
 */
export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  recentEntries = [],
  onNewEntry,
  onViewCalendar,
  onEditEntry,
  onSubmitTimeEntry,
  isLoading = false
}) => {
  // Time entry form state
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [timeEntryFormDate, setTimeEntryFormDate] = useState<string>('');
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  // State for day details modal
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);

  // Default summary data if not provided
  const defaultSummary: DashboardSummary = {
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    recentEntries: [],
    weeklyProgress: 0
  };

  const displaySummary = summary || defaultSummary;

  // Utility functions for greeting and progress
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 60) return 'Good momentum! 👍';
    if (progress >= 80) return 'Great progress! 💪';
    return 'Keep going! 🚀';
  };

  // Handler for creating new entries for specific dates
  const handleNewEntryForDate = (date?: Date) => {
    if (date) {
      setTimeEntryFormDate(date.toISOString().split('T')[0]);
    } else {
      setTimeEntryFormDate(new Date().toISOString().split('T')[0]);
    }
    setShowTimeEntryForm(true);
  };

  // Handler for calendar day clicks
  const handleDayClick = (day: Date | string) => {
    let formattedDate: string;
    
    if (day instanceof Date) {
      // Format date manually to avoid timezone issues
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const dayOfMonth = String(day.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${dayOfMonth}`;
    } else {
      formattedDate = day;
    }

    // Find entries for this specific day
    const dayEntries = recentEntries.filter(entry => entry.date === formattedDate);
    
    if (dayEntries.length > 0) {
      // If entries exist, show the day details modal
      const totalHours = dayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      
      // Create a CalendarDay object for the modal
      const calendarDay: CalendarDay = {
        date: formattedDate,
        totalHours,
        projectCount: dayEntries.reduce((sum, entry) => sum + entry.projects.length, 0),
        hasMPS: dayEntries.some(entry => entry.projects.some(project => project.isMPS)),
        entries: dayEntries
      };
      
      setSelectedDay(calendarDay);
      setShowDayDetails(true);
    } else {
      // If no entries exist, show the time entry form for this date
      handleNewEntryForDate(day instanceof Date ? day : new Date(formattedDate));
    }
  };

  // Handle time entry form submission
  const handleTimeEntrySubmit = async (formData: TimeEntryFormData) => {
    setIsSubmittingEntry(true);
    
    try {
      if (onSubmitTimeEntry) {
        // Use the provided submission handler (from DashboardPage)
        await onSubmitTimeEntry(formData);
      } else {
        // Fallback: simulate API call for standalone usage
        console.log('Submitting time entry:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Time entry submitted successfully');
      }
      
      // Close form on successful submission
      setShowTimeEntryForm(false);
      
    } catch (error) {
      console.error('Failed to submit time entry:', error);
      // Error handling is managed by the parent component (DashboardPage)
      // Keep form open so user can retry or make corrections
    } finally {
      setIsSubmittingEntry(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const progressStatus = getProgressStatus(displaySummary.weeklyProgress);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {getGreeting()}, John! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {getProgressStatus(displaySummary.weeklyProgress)}
        </p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats summary={displaySummary} />

      {/* Weekly Progress */}
      <WeeklyProgress summary={displaySummary} />

      {/* Calendar View */}
      <CalendarView 
        entries={recentEntries}
        onDayClick={handleDayClick}
        onNewEntryForDate={handleNewEntryForDate}
      />

      {/* Recent Entries */}
      <RecentEntries 
        entries={recentEntries}
        onEditEntry={onEditEntry}
        onNewEntry={onNewEntry}
      />

      {/* Time Entry Form Modal */}
      {showTimeEntryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative group max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              <div className="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Add Time Entry</h3>
                  <div className="flex items-center space-x-3">
                    {/* Add Project Button */}
                    <button
                      className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => setShowAddProject(true)}
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Project</span>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      className="p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                      onClick={() => setShowTimeEntryForm(false)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <TimeEntryForm
                  initialData={{ date: timeEntryFormDate }}
                  onSubmit={handleTimeEntrySubmit}
                  onCancel={() => setShowTimeEntryForm(false)}
                  isLoading={isSubmittingEntry}
                  simplified={true}
                  showAddProject={showAddProject}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {showDayDetails && selectedDay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative group max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              <div className="bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm px-8 py-6 border-b border-white/20 dark:border-slate-600/20 rounded-t-3xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {DateUtils.formatDisplayDate(selectedDay.date)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Total: {DataUtils.formatHours(selectedDay.totalHours)}
                    </p>
                  </div>
                  <button
                    className="p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                    onClick={() => setShowDayDetails(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8">
                {selectedDay.entries && selectedDay.entries.length > 0 ? (
                  <div className="space-y-6">
                    {selectedDay.entries.map((entry) => (
                      <div key={entry.id} className="bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-600/20 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{entry.employeeName}</span>
                              <Badge variant="primary" size="sm">
                                {entry.role}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {entry.projects.length} project{entry.projects.length !== 1 ? 's' : ''} • 
                              Total: {DataUtils.formatHours(entry.totalHours)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditEntry && onEditEntry(entry.id)}
                            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            Edit
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {entry.projects.map((project, index) => (
                            <div key={index} className="bg-white/10 dark:bg-slate-600/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 dark:border-slate-500/10">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-medium text-slate-800 dark:text-slate-200">{project.clientName}</div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">{project.projectName}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {DataUtils.formatHours(project.hours)}
                                  </span>
                                  {project.isMPS && (
                                    <Badge variant="success" size="xs">
                                      MPS
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {project.notes && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">
                                  "{project.notes}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-3xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">No time entries</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">You haven't logged any hours for this day yet.</p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleNewEntryForDate(new Date(selectedDay.date));
                        setShowDayDetails(false);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Add Time Entry
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Quick Time Entry */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          variant="primary"
          size="lg"
          className="group relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-0"
          onClick={() => handleNewEntryForDate()}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative flex items-center justify-center">
            <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Button>
      </div>
    </div>
  );
}; 