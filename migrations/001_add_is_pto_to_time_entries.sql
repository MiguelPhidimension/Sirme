-- Migration: Add is_pto column to time_entries table
-- Description: Adds support for Paid Time Off (PTO) entries
-- Date: 2026-01-29

ALTER TABLE time_entries
ADD COLUMN is_pto BOOLEAN DEFAULT FALSE;

-- Create index for faster PTO queries
CREATE INDEX idx_time_entries_is_pto ON time_entries(is_pto);

-- Add comment to describe the column
COMMENT ON COLUMN time_entries.is_pto IS 'Indicates if this entry is Paid Time Off (PTO)';
