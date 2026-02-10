/**
 * Collaborators Excel Export Utilities
 *
 * Exports collaborator data to a styled Excel file using ExcelJS.
 */

import ExcelJS from "exceljs";
import type {
  CollaboratorsData,
  CollaboratorData,
} from "~/graphql/hooks/useCollaborators";

/**
 * Style worksheet header row with professional formatting
 */
function styleHeaderRow(worksheet: ExcelJS.Worksheet): void {
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4788" },
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
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
}

/**
 * Style data rows with alternating colors
 */
function styleDataRows(worksheet: ExcelJS.Worksheet): void {
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.height = 22;
    const isEvenRow = rowNumber % 2 === 0;

    row.eachCell((cell) => {
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
        horizontal: "center",
        vertical: "middle",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    // Left-align text columns (first 3)
    for (let i = 1; i <= 3; i++) {
      const cell = row.getCell(i);
      cell.alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };
    }
  });
}

/**
 * Export collaborators data to an Excel file with two sheets:
 * 1. Summary - One row per collaborator with key stats
 * 2. By Project - Detailed breakdown per collaborator and project
 */
export async function exportCollaboratorsToExcel(
  data: CollaboratorsData,
  startDate: string,
  endDate: string,
  filename?: string,
): Promise<void> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SIRME Time Tracking";
    workbook.created = new Date();

    // ========================================
    // SHEET 1: COLLABORATOR SUMMARY
    // ========================================
    const summarySheet = workbook.addWorksheet("Collaborators Summary", {
      properties: { tabColor: { argb: "FF6366F1" } },
    });

    const summaryHeaders = [
      "Collaborator",
      "Email",
      "Role",
      "Total Hours",
      "Days Worked",
      "Daily Average (h)",
      "Active Projects",
      "PTO (h)",
      "Holidays (h)",
    ];
    summarySheet.addRow(summaryHeaders);

    data.collaborators.forEach((c: CollaboratorData) => {
      summarySheet.addRow([
        c.fullName,
        c.email,
        c.role,
        c.totalHours,
        c.totalDaysWorked,
        c.avgDailyHours,
        c.activeProjects,
        c.ptoHours,
        c.holidayHours,
      ]);
    });

    // Set column widths
    summarySheet.columns = [
      { width: 30 }, // Collaborator
      { width: 30 }, // Email
      { width: 20 }, // Role
      { width: 14 }, // Total Hours
      { width: 18 }, // Days Worked
      { width: 20 }, // Daily Average
      { width: 18 }, // Active Projects
      { width: 12 }, // PTO
      { width: 14 }, // Holidays
    ];

    styleHeaderRow(summarySheet);
    styleDataRows(summarySheet);

    // Highlight hours in total column
    summarySheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const totalCell = row.getCell(4);
      if (
        typeof totalCell.value === "number" &&
        (totalCell.value as number) > 0
      ) {
        totalCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        };
        totalCell.font = {
          bold: true,
          size: 11,
          name: "Calibri",
          color: { argb: "FF065F46" },
        };
      }
    });

    // Freeze header
    summarySheet.views = [
      { state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A1" },
    ];

    // Add autofilter
    if (summarySheet.lastRow) {
      summarySheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: {
          row: summarySheet.lastRow.number,
          column: summarySheet.columnCount,
        },
      };
    }

    // ========================================
    // SHEET 2: DETAILED PROJECT BREAKDOWN
    // ========================================
    const detailSheet = workbook.addWorksheet("Detail by Project", {
      properties: { tabColor: { argb: "FF10B981" } },
    });

    const detailHeaders = [
      "Collaborator",
      "Project",
      "Client",
      "Hours",
      "% of Total",
    ];
    detailSheet.addRow(detailHeaders);

    data.collaborators.forEach((c: CollaboratorData) => {
      if (c.projects.length === 0) {
        detailSheet.addRow([c.fullName, "No projects", "N/A", 0, "0%"]);
      } else {
        c.projects.forEach((p) => {
          detailSheet.addRow([
            c.fullName,
            p.projectName,
            p.clientName,
            p.hours,
            `${p.percentage}%`,
          ]);
        });
      }
    });

    // Set column widths
    detailSheet.columns = [
      { width: 30 }, // Collaborator
      { width: 30 }, // Project
      { width: 25 }, // Client
      { width: 14 }, // Hours
      { width: 14 }, // % of Total
    ];

    styleHeaderRow(detailSheet);
    styleDataRows(detailSheet);

    // Freeze header
    detailSheet.views = [
      { state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A1" },
    ];

    if (detailSheet.lastRow) {
      detailSheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: {
          row: detailSheet.lastRow.number,
          column: detailSheet.columnCount,
        },
      };
    }

    // ========================================
    // GENERATE AND DOWNLOAD
    // ========================================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const finalFilename =
      filename || generateCollaboratorsFilename(startDate, endDate);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFilename;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error exporting collaborators to Excel:", error);
    throw error;
  }
}

/**
 * Generate filename for collaborators report
 */
export function generateCollaboratorsFilename(
  startDate: string,
  endDate: string,
): string {
  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");

  const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  return `collaborators_${formatDate(start)}_${formatDate(end)}.xlsx`;
}
