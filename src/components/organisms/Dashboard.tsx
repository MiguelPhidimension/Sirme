import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { StatCard, ProjectEntryCard } from '../molecules';
import { Button, Badge } from '../atoms';
import { DataUtils, DateUtils } from '~/utils';
import type { DashboardSummary, DailyTimeEntry } from '~/types';

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

  // Default summary data if not provided
  const defaultSummary: DashboardSummary = {
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    recentEntries: [],
    weeklyProgress: 0
  };

  const displaySummary = summary || defaultSummary;

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
      {/* Modern Header Section with Glassmorphism */}
      <div class="text-center space-y-6 py-12">
        <div class="space-y-4">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
            {getGreeting()}! 👋
          </h1>
          <p class="text-xl text-slate-400 dark:text-slate-300 max-w-2xl mx-auto">
            Welcome back to your productivity dashboard
          </p>
        </div>
        
        {/* Modern Action Buttons */}
        <div class="flex flex-wrap justify-center gap-4 pt-6">
          <button 
            class="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            onClick$={onNewEntry$}
          >
            <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-lg font-semibold">Add Time Entry</span>
          </button>
          
          <button 
            class="group flex items-center space-x-3 px-8 py-4 bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            onClick$={onViewCalendar$}
          >
            <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-lg font-semibold">View Calendar</span>
          </button>
        </div>
      </div>

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
    </div>
  );
}); 