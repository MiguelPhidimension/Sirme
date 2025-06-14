import React from 'react';
import { DataUtils } from '~/utils';
import type { DashboardSummary } from '~/types';

/**
 * DashboardStats Molecule Component
 * Displays the three main stat cards (Today, Week, Month) with modern glassmorphism design.
 * This molecule combines multiple atoms and handles local presentation logic.
 * 
 * Props:
 * - summary: DashboardSummary object with hours data
 * 
 * Example usage:
 * <DashboardStats summary={dashboardSummary} />
 */
interface DashboardStatsProps {
  summary: DashboardSummary;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Today's Hours */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Today</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {DataUtils.formatHours(summary.todayHours)}
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Hours */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">This Week</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {DataUtils.formatHours(summary.weekHours)}
              </p>
            </div>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Hours */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
        <div className="relative bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 p-8 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">This Month</p>
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {DataUtils.formatHours(summary.monthHours)}
              </p>
            </div>
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 