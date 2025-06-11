// Core types for the time tracking application

/**
 * Available employee roles in the system
 */
export type EmployeeRole = 
  | "Architect MuleSoft"
  | "MuleSoft Developer" 
  | "Developer Fullstack"
  | "Data Engineer"
  | "Developer Snowflake"
  | "Analista BI"
  | "Other";

/**
 * Project entry for a specific day
 * Represents work done on a single project during a day
 */
export interface ProjectEntry {
  id: string;
  clientName: string;
  hours: number;
  isMPS: boolean; // MuleSoft Professional Services flag
  notes?: string;
}

/**
 * Daily time entry 
 * Contains all work done by an employee in a single day
 */
export interface DailyTimeEntry {
  id: string;
  employeeName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  role: EmployeeRole;
  projects: ProjectEntry[];
  totalHours: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Weekly time entry summary
 * Aggregates daily entries for a week
 */
export interface WeeklyTimeEntry {
  id: string;
  employeeName: string;
  weekStartDate: string; // ISO date string (YYYY-MM-DD)
  weekEndDate: string; // ISO date string (YYYY-MM-DD)
  dailyEntries: DailyTimeEntry[];
  totalWeekHours: number;
  averageDailyHours: number;
}

/**
 * Form data for creating/editing a daily time entry
 */
export interface TimeEntryFormData {
  employeeName: string;
  date: string;
  role: EmployeeRole;
  projects: Omit<ProjectEntry, 'id'>[];
}

/**
 * Weekly bulk entry form data
 */
export interface WeeklyBulkFormData {
  employeeName: string;
  role: EmployeeRole;
  weekStartDate: string;
  dailyEntries: Array<{
    date: string;
    projects: Omit<ProjectEntry, 'id'>[];
  }>;
}

/**
 * Calendar day view data
 */
export interface CalendarDay {
  date: string;
  totalHours: number;
  hasEntries: boolean;
  entries?: DailyTimeEntry[];
}

/**
 * Dashboard summary data
 */
export interface DashboardSummary {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  recentEntries: DailyTimeEntry[];
  weeklyProgress: number; // percentage of weekly target
}

/**
 * Validation constraints
 */
export interface ValidationRules {
  maxDailyHours: number;
  maxWeeklyHours: number;
  minHoursPerEntry: number;
  maxHoursPerEntry: number;
}

/**
 * Application settings
 */
export interface AppSettings {
  defaultRole: EmployeeRole;
  timeFormat: '12h' | '24h';
  weekStartsOn: 'monday' | 'sunday';
  validation: ValidationRules;
  theme: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

/**
 * Filter options for time entries
 */
export interface TimeEntryFilters {
  startDate?: string;
  endDate?: string;
  employeeName?: string;
  role?: EmployeeRole;
  client?: string;
  isMPS?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'date' | 'hours' | 'client';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string | string[];
} 