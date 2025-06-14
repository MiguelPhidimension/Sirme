import React, { useState } from 'react';
import { Badge } from '../atoms';
import { DataUtils, DateUtils } from '~/utils';
import type { DailyTimeEntry } from '~/types';

/**
 * Props interface for RecentEntries component
 */
interface RecentEntriesProps {
  entries: DailyTimeEntry[];
  onEditEntry?: (entryId: string) => void;
  onNewEntry?: () => void;
}

/**
 * RecentEntries Molecule Component
 * Displays a list of recent time entries with modern styling.
 * Provides functionality to view, edit, and manage time entries.
 * Combines atoms to create a comprehensive entries display.
 * 
 * Props:
 * - entries: Array of recent time entries to display
 * - onEditEntry: Handler for editing existing entries
 * - onNewEntry: Handler for creating new entries
 * 
 * Example usage:
 * <RecentEntries 
 *   entries={recentEntries} 
 *   onEditEntry={handleEdit}
 *   onNewEntry={handleNew}
 * />
 */
export const RecentEntries: React.FC<RecentEntriesProps> = ({ 
  entries, 
  onEditEntry, 
  onNewEntry 
}) => {
  // Local state for showing all entries
  const [showAllEntries, setShowAllEntries] = useState(false);

  // Determine which entries to display
  const displayEntries = showAllEntries ? entries : entries.slice(0, 3);

  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      {/* Main content container */}
      <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Recent Time Entries
          </h3>
          {entries.length > 3 && (
            <button
              className="px-4 py-2 bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-600/20 transition-all duration-200"
              onClick={() => setShowAllEntries(!showAllEntries)}
            >
              {showAllEntries ? 'Show Less' : `Show All (${entries.length})`}
            </button>
          )}
        </div>

        {/* Entries content */}
        {entries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-3xl flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">No time entries yet</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start tracking your time to see entries here</p>
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              onClick={onNewEntry}
            >
              Add Your First Entry
            </button>
          </div>
        ) : (
          /* Entries list */
          <div className="space-y-6">
            {displayEntries.map((entry) => (
              <div key={entry.id} className="group relative">
                {/* Entry background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                
                {/* Entry content */}
                <div className="relative bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-600/20 p-6 hover:bg-white/30 dark:hover:bg-slate-700/40 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Entry header */}
                      <div className="flex items-center gap-4 mb-4">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {DateUtils.formatDisplayDate(entry.date)}
                        </h4>
                        <Badge variant="primary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                          {entry.role}
                        </Badge>
                        {DateUtils.isToday(entry.date) && (
                          <Badge variant="success" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 animate-pulse">
                            Today
                          </Badge>
                        )}
                      </div>
                      
                      {/* Entry details */}
                      <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">{entry.employeeName}</span>
                        </span>
                        <span className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {DataUtils.formatHours(entry.totalHours)}
                        </span>
                      </div>

                      {/* Projects list */}
                      <div className="flex flex-wrap gap-3">
                        {entry.projects.map((project, index) => (
                          <div key={index} className="bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm border border-white/20 dark:border-slate-500/20 rounded-xl px-4 py-2">
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{project.clientName}</span>
                              <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {DataUtils.formatHours(project.hours)}
                              </span>
                              {project.isMPS && (
                                <Badge variant="success" className="badge-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                  MPS
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Edit button */}
                    <button
                      className="ml-6 p-3 bg-white/20 dark:bg-slate-600/30 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-500/20 transition-all duration-200 hover:bg-white/30 dark:hover:bg-slate-600/40"
                      onClick={() => onEditEntry && onEditEntry(entry.id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
  );
}; 