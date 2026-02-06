-- Migration: Add is_pto column to time_entry_projects table
-- Description: Adds support for PTO flag at project level (0 hours projects)
-- Date: 2026-02-06

ALTER TABLE time_entry_projects
ADD COLUMN is_pto BOOLEAN DEFAULT FALSE;

-- Create index for faster PTO project queries
CREATE INDEX idx_time_entry_projects_is_pto ON time_entry_projects(is_pto);

-- Add comment to describe the column
COMMENT ON COLUMN time_entry_projects.is_pto IS 'Indicates if this project entry is marked as PTO/0 hours';
