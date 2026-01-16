import type {
  DailyTimeEntry,
  ProjectEntry,
  ValidationRules,
  EmployeeRole,
} from "~/types";

// Export auth utilities
export * from "./auth";
export * from "./jwt";

/**
 * Date utility functions
 */
export class DateUtils {
  /**
   * Get current date in YYYY-MM-DD format
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * Get start of current week (Monday)
   */
  static getWeekStart(date?: string): string {
    const d = date ? new Date(date) : new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff)).toISOString().split("T")[0];
  }

  /**
   * Get end of current week (Sunday)
   */
  static getWeekEnd(date?: string): string {
    const weekStart = DateUtils.getWeekStart(date);
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  }

  /**
   * Get start of current month
   */
  static getMonthStart(date?: string): string {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  }

  /**
   * Get end of current month
   */
  static getMonthEnd(date?: string): string {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  }

  /**
   * Format date for display
   */
  static formatDisplayDate(date: string): string {
    // Append T00:00:00 to ensure date is treated as local time, not UTC
    // This prevents timezone shifts when displaying the date
    const localDate = date.includes("T") ? date : `${date}T00:00:00`;
    return new Date(localDate).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /**
   * Get days in month for calendar view
   */
  static getDaysInMonth(year: number, month: number): Date[] {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  /**
   * Check if date is today
   */
  static isToday(date: string): boolean {
    return date === DateUtils.getCurrentDate();
  }

  /**
   * Check if date is in current week
   */
  static isCurrentWeek(date: string): boolean {
    const weekStart = DateUtils.getWeekStart();
    const weekEnd = DateUtils.getWeekEnd();
    return date >= weekStart && date <= weekEnd;
  }
}

/**
 * Validation utility functions
 */
export class ValidationUtils {
  private static defaultRules: ValidationRules = {
    maxDailyHours: 24,
    maxWeeklyHours: 168,
    minHoursPerEntry: 0.25,
    maxHoursPerEntry: 24,
  };

  /**
   * Validate project entry hours
   */
  static validateProjectHours(
    hours: number,
    rules: ValidationRules = ValidationUtils.defaultRules,
  ): string | null {
    if (hours < rules.minHoursPerEntry) {
      return `Hours must be at least ${rules.minHoursPerEntry}`;
    }
    if (hours > rules.maxHoursPerEntry) {
      return `Hours cannot exceed ${rules.maxHoursPerEntry}`;
    }
    return null;
  }

  /**
   * Validate daily total hours - overloaded version for ProjectEntry
   */
  static validateDailyTotal(
    projects: ProjectEntry[],
    rules?: ValidationRules,
  ): string | null;
  /**
   * Validate daily total hours - overloaded version for Omit<ProjectEntry, 'id'>
   */
  static validateDailyTotal(
    projects: Omit<ProjectEntry, "id">[],
    rules?: ValidationRules,
  ): string | null;
  /**
   * Implementation
   */
  static validateDailyTotal(
    projects: ProjectEntry[] | Omit<ProjectEntry, "id">[],
    rules: ValidationRules = ValidationUtils.defaultRules,
  ): string | null {
    const totalHours = projects.reduce(
      (sum, project) => sum + project.hours,
      0,
    );

    if (totalHours > rules.maxDailyHours) {
      return `Daily total cannot exceed ${rules.maxDailyHours} hours`;
    }

    return null;
  }

  /**
   * Validate weekly total hours
   */
  static validateWeeklyTotal(
    entries: DailyTimeEntry[],
    rules: ValidationRules = ValidationUtils.defaultRules,
  ): string | null {
    const totalHours = entries.reduce(
      (sum, entry) => sum + entry.totalHours,
      0,
    );

    if (totalHours > rules.maxWeeklyHours) {
      return `Weekly total cannot exceed ${rules.maxWeeklyHours} hours`;
    }

    return null;
  }

  /**
   * Validate employee name
   */
  static validateEmployeeName(name: string): string | null {
    if (!name.trim()) {
      return "Employee name is required";
    }
    if (name.length < 2) {
      return "Employee name must be at least 2 characters";
    }
    return null;
  }

  /**
   * Validate client name
   */
  static validateClientName(name: string): string | null {
    if (!name.trim()) {
      return "Client name is required";
    }
    return null;
  }

  /**
   * Validate date
   */
  static validateDate(date: string): string | null {
    if (!date) {
      return "Date is required";
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date format";
    }

    // Check if date is not in the future (more than today)
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (parsedDate > today) {
      return "Date cannot be in the future";
    }

    return null;
  }
}

/**
 * Data formatting and calculation utilities
 */
export class DataUtils {
  /**
   * Calculate total hours from projects - overloaded version for ProjectEntry
   */
  static calculateTotalHours(projects: ProjectEntry[]): number;
  /**
   * Calculate total hours from projects - overloaded version for Omit<ProjectEntry, 'id'>
   */
  static calculateTotalHours(projects: Omit<ProjectEntry, "id">[]): number;
  /**
   * Implementation
   */
  static calculateTotalHours(
    projects: ProjectEntry[] | Omit<ProjectEntry, "id">[],
  ): number {
    return projects.reduce((sum, project) => sum + project.hours, 0);
  }

  /**
   * Calculate weekly progress percentage
   */
  static calculateWeeklyProgress(
    totalHours: number,
    targetHours: number = 40,
  ): number {
    return Math.min((totalHours / targetHours) * 100, 100);
  }

  /**
   * Generate unique ID
   */
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format hours for display
   */
  static formatHours(hours: number): string {
    if (hours === 0) return "0h";
    if (hours < 1) return `${(hours * 60).toFixed(0)}m`;

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) return `${wholeHours}h`;
    return `${wholeHours}h ${minutes}m`;
  }

  /**
   * Get role color for UI display
   */
  static getRoleColor(role: EmployeeRole): string {
    const colorMap: Record<EmployeeRole, string> = {
      "Architect MuleSoft": "badge-primary",
      "MuleSoft Developer": "badge-secondary",
      "Developer Fullstack": "badge-accent",
      "Data Engineer": "badge-info",
      "Developer Snowflake": "badge-success",
      "Analista BI": "badge-warning",
      Other: "badge-neutral",
    };
    return colorMap[role] || "badge-neutral";
  }

  /**
   * Sort time entries by date (newest first)
   */
  static sortEntriesByDate(entries: DailyTimeEntry[]): DailyTimeEntry[] {
    return [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  /**
   * Group entries by week
   */
  static groupEntriesByWeek(
    entries: DailyTimeEntry[],
  ): Record<string, DailyTimeEntry[]> {
    return entries.reduce(
      (groups, entry) => {
        const weekStart = DateUtils.getWeekStart(entry.date);
        if (!groups[weekStart]) {
          groups[weekStart] = [];
        }
        groups[weekStart].push(entry);
        return groups;
      },
      {} as Record<string, DailyTimeEntry[]>,
    );
  }

  /**
   * Filter entries by date range
   */
  static filterEntriesByDateRange(
    entries: DailyTimeEntry[],
    startDate: string,
    endDate: string,
  ): DailyTimeEntry[] {
    return entries.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate,
    );
  }

  /**
   * Get available role options
   */
  static getEmployeeRoles(): EmployeeRole[] {
    return [
      "Architect MuleSoft",
      "MuleSoft Developer",
      "Developer Fullstack",
      "Data Engineer",
      "Developer Snowflake",
      "Analista BI",
      "Other",
    ];
  }
}
