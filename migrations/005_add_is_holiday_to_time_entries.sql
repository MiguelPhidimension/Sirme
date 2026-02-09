-- Migration: Add is_holiday column to time_entries table
-- Description: Adds support for Holiday entries (feriados/días festivos)
-- Date: 2026-02-09

ALTER TABLE time_entries
ADD COLUMN is_holiday BOOLEAN DEFAULT FALSE;

-- Create index for faster Holiday queries
CREATE INDEX idx_time_entries_is_holiday ON time_entries(is_holiday);
