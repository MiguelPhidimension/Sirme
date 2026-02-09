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
  clientId?: string;
  clientName: string;
  hours: number;
  isMPS: boolean; // MuleSoft Professional Services flag
  isPTO?: boolean; // Paid Time Off / 0 hours flag
  isHoliday?: boolean; // Holiday flag
  notes?: string;
  role?: string; // Role assigned to this project entry
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
  roleApplication?: string;
  projects: ProjectEntry[];
  totalHours: number;
  isPTO?: boolean;
  isHoliday?: boolean;
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
  projects: Omit<ProjectEntry, "id">[];
  isPTO?: boolean;
  isHoliday?: boolean;
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
    projects: Omit<ProjectEntry, "id">[];
  }>;
}

/**
 * Calendar day view data
 */
export interface CalendarDayTypes {
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
  timeFormat: "12h" | "24h";
  weekStartsOn: "monday" | "sunday";
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
  sortBy?: "date" | "hours" | "client";
  sortOrder?: "asc" | "desc";
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string | string[];
}

/**
 * User authentication types
 */
export interface User {
  user_id: string;
  role_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_application?: string;
  created_at: string;
  updated_at?: string;
  role?: {
    role_id: string;
    role_name: string;
    description?: string;
  };
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Register form data
 */
export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  errors?: string[];
}

/**
 * Auth session data
 */
export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
