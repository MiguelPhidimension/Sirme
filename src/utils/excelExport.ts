/**
 * Excel Export Utilities
 *
 * Utility functions to export report data to Excel format with multiple sheets.
 * Uses ExcelJS library to generate styled Excel files.
 */

import ExcelJS from "exceljs";
import type { ReportData, ReportTimeEntry } from "~/graphql/hooks/useReports";

/**
 * Detailed Report Sheet Structure:
 * Columns: Resource | Project | Customer | 1-ago | 2-ago | ... | 29-ago | Total
 * Each row represents a user-project-customer combination with hours per day
 */
interface DetailedReportRow {
  resource: string;
  project: string;
  customer: string;
  [key: string]: string | number; // Dynamic day columns like "1-ago", "2-ago", etc.
  total: number;
}

/**
 * Summary Report Sheet Structure:
 * Columns: Resource | Project | Customer | TOTAL
 * Each row represents aggregated totals per user-project-customer
 */
interface SummaryReportRow {
  resource: string;
  project: string;
  customer: string;
  total: number;
}

/**
 * Generate month name abbreviation in English (e.g., "Aug" for August)
 * Uses GMT to avoid timezone issues
 */
function getMonthAbbreviation(dateString: string): string {
  const date = new Date(dateString + "T00:00:00Z"); // Force GMT
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getUTCMonth()]; // Use UTC methods
}

/**
 * Get day number from date string (e.g., "2024-08-15" -> 15)
 * Uses GMT to avoid timezone issues
 */
function getDayNumber(dateString: string): number {
  const date = new Date(dateString + "T00:00:00Z"); // Force GMT
  return date.getUTCDate(); // Use UTC methods
}

/**
 * Generate column headers for detailed report based on date range
 * Returns array like ["1-ago", "2-ago", ..., "31-ago", "1-sep", "2-sep"]
 * Uses GMT dates and handles month transitions
 */
function generateDayColumns(startDate: string, endDate: string): string[] {
  const start = new Date(startDate + "T00:00:00Z"); // Force GMT
  const end = new Date(endDate + "T00:00:00Z"); // Force GMT
  const columns: string[] = [];

  // Generate columns for each day in range
  const current = new Date(start);
  while (current <= end) {
    const day = current.getUTCDate(); // Use UTC methods
    const currentDateStr = current.toISOString().split("T")[0]; // Get YYYY-MM-DD
    const monthAbbr = getMonthAbbreviation(currentDateStr); // Get month for THIS specific day
    columns.push(`${day}-${monthAbbr}`);
    current.setUTCDate(current.getUTCDate() + 1); // Use UTC methods
  }

  return columns;
}

/**
 * Build detailed report data structure
 * Groups time entries by user-project-customer and distributes hours by day
 */
function buildDetailedReportData(
  reportData: ReportData,
  startDate: string,
  endDate: string,
): DetailedReportRow[] {
  const dayColumns = generateDayColumns(startDate, endDate);

  // Create a map to track unique user-project-customer combinations
  const entryMap = new Map<string, DetailedReportRow>();

  // Process each time entry
  reportData.timeEntries.forEach((entry: ReportTimeEntry) => {
    if (!entry.projects || entry.projects.length === 0) return;

    const dayColumn = `${getDayNumber(entry.date)}-${getMonthAbbreviation(entry.date)}`;

    // Process each project in the entry
    entry.projects.forEach((project) => {
      const key = `${entry.employeeName}|${project.projectName}|${project.clientName}`;

      // Initialize row if it doesn't exist
      if (!entryMap.has(key)) {
        const newRow: DetailedReportRow = {
          resource: entry.employeeName,
          project: project.projectName,
          customer: project.clientName,
          total: 0,
        };

        // Initialize all day columns with 0
        dayColumns.forEach((col) => {
          newRow[col] = 0;
        });

        entryMap.set(key, newRow);
      }

      const row = entryMap.get(key)!;

      // Add hours to the specific day column
      if (row[dayColumn] !== undefined) {
        row[dayColumn] = (row[dayColumn] as number) + project.hours;
        row.total += project.hours;
      }
    });
  });

  // Convert map to array and sort by resource, then project
  return Array.from(entryMap.values()).sort((a, b) => {
    if (a.resource !== b.resource) {
      return a.resource.localeCompare(b.resource);
    }
    return a.project.localeCompare(b.project);
  });
}

/**
 * Build summary report data structure
 * Aggregates total hours per user-project-customer
 */
function buildSummaryReportData(reportData: ReportData): SummaryReportRow[] {
  const summaryMap = new Map<string, SummaryReportRow>();

  // Process each time entry
  reportData.timeEntries.forEach((entry: ReportTimeEntry) => {
    if (!entry.projects || entry.projects.length === 0) return;

    // Process each project in the entry
    entry.projects.forEach((project) => {
      const key = `${entry.employeeName}|${project.projectName}|${project.clientName}`;

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          resource: entry.employeeName,
          project: project.projectName,
          customer: project.clientName,
          total: 0,
        });
      }

      const row = summaryMap.get(key)!;
      row.total += project.hours;
    });
  });

  // Convert map to array and sort by resource, then project
  return Array.from(summaryMap.values()).sort((a, b) => {
    if (a.resource !== b.resource) {
      return a.resource.localeCompare(b.resource);
    }
    return a.project.localeCompare(b.project);
  });
}

/**
 * Style worksheet with professional formatting using ExcelJS
 * Adds colors, borders, bold headers, and proper column widths
 */
function styleWorksheet(worksheet: ExcelJS.Worksheet): void {
  // Get the header row
  const headerRow = worksheet.getRow(1);

  // Style header row
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4788" }, // Dark blue
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" }, // White
      size: 12,
      name: "Calibri",
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = {
      top: { style: "medium", color: { argb: "FF000000" } },
      bottom: { style: "medium", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  // Set column widths
  const columns = worksheet.columns;
  columns.forEach((column, index) => {
    if (index < 3) {
      // Resource, Project, Customer columns
      column.width = 30;
    } else if (column === columns[columns.length - 1]) {
      // Total column
      column.width = 14;
    } else {
      // Day columns
      column.width = 10;
    }
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    row.height = 22;
    const isEvenRow = rowNumber % 2 === 0;

    row.eachCell((cell, colNumber) => {
      const isTextColumn = colNumber <= 3; // Resource, Project, Customer
      const isTotalColumn = colNumber === row.cellCount;
      const cellValue = cell.value;

      // Base styling
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEvenRow ? "FFF9FAFB" : "FFFFFFFF" },
      };

      cell.font = {
        size: 11,
        name: "Calibri",
        color: { argb: "FF1F2937" },
      };

      cell.alignment = {
        horizontal: isTextColumn ? "left" : "center",
        vertical: "middle",
        wrapText: isTextColumn,
      };

      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };

      // Style Total column
      if (isTotalColumn && typeof cellValue === "number" && cellValue > 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDBEAFE" }, // Light blue
        };
        cell.font = {
          ...cell.font,
          bold: true,
          color: { argb: "FF1E40AF" }, // Dark blue
        };
      }

      // Highlight cells with hours > 0 in day columns
      if (
        !isTextColumn &&
        !isTotalColumn &&
        typeof cellValue === "number" &&
        cellValue > 0
      ) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" }, // Light green
        };
        cell.font = {
          ...cell.font,
          bold: true,
          color: { argb: "FF065F46" }, // Dark green
        };
      }

      // Style zeros in day columns
      if (
        !isTextColumn &&
        !isTotalColumn &&
        (cellValue === 0 || cellValue === "0")
      ) {
        cell.font = {
          ...cell.font,
          color: { argb: "FFD1D5DB" }, // Light gray
        };
      }
    });
  });

  // Freeze first row and first three columns
  worksheet.views = [
    {
      state: "frozen",
      xSplit: 3,
      ySplit: 1,
      activeCell: "A1",
    },
  ];

  // Add autofilter
  if (worksheet.lastRow) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: worksheet.lastRow.number, column: worksheet.columnCount },
    };
  }
}

/**
 * Main export function - Generates Excel file with two sheets using ExcelJS
 * @param reportData - Report data from useReportsData hook
 * @param startDate - Start date of report range
 * @param endDate - End date of report range
 * @param filename - Optional filename (default: "time_report.xlsx")
 */
export async function exportReportToExcel(
  reportData: ReportData,
  startDate: string,
  endDate: string,
  filename: string = "time_report.xlsx",
): Promise<void> {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIRME Time Tracking";
    workbook.created = new Date();

    // ========================================
    // SHEET 1: DETAILED REPORT
    // ========================================
    const detailedData = buildDetailedReportData(
      reportData,
      startDate,
      endDate,
    );
    const dayColumns = generateDayColumns(startDate, endDate);

    // Create detailed worksheet
    const detailedSheet = workbook.addWorksheet("Detailed", {
      properties: { tabColor: { argb: "FF1F4788" } },
    });

    // Add headers
    const detailedHeaders = [
      "Resource",
      "Project",
      "Customer",
      ...dayColumns,
      "Total",
    ];
    detailedSheet.addRow(detailedHeaders);

    // Add data rows
    detailedData.forEach((row) => {
      const rowData = [
        row.resource,
        row.project,
        row.customer,
        ...dayColumns.map((col) => {
          const value = row[col];
          return typeof value === "number" ? value : 0;
        }),
        row.total,
      ];
      detailedSheet.addRow(rowData);
    });

    // Apply styling to detailed sheet
    styleWorksheet(detailedSheet);

    // ========================================
    // SHEET 2: SUMMARY REPORT
    // ========================================
    const summaryData = buildSummaryReportData(reportData);

    // Create summary worksheet
    const summarySheet = workbook.addWorksheet("Summary", {
      properties: { tabColor: { argb: "FF10B981" } },
    });

    // Add headers
    const summaryHeaders = ["Resource", "Project", "Customer", "TOTAL"];
    summarySheet.addRow(summaryHeaders);

    // Add data rows
    summaryData.forEach((row) => {
      summarySheet.addRow([row.resource, row.project, row.customer, row.total]);
    });

    // Apply styling to summary sheet
    styleWorksheet(summarySheet);

    // ========================================
    // GENERATE AND DOWNLOAD FILE
    // ========================================
    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error exporting report to Excel:", error);
    throw error;
  }
}

/**
 * Generate filename with date range (using GMT)
 */
export function generateReportFilename(
  startDate: string,
  endDate: string,
): string {
  const start = new Date(startDate + "T00:00:00Z"); // Force GMT
  const end = new Date(endDate + "T00:00:00Z"); // Force GMT

  const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  return `time_report_${formatDate(start)}_${formatDate(end)}.xlsx`;
}
