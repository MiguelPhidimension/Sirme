-- Add role column to time_entry_projects table
ALTER TABLE time_entry_projects
ADD COLUMN role VARCHAR(100);

-- Add comment to document the column
COMMENT ON COLUMN time_entry_projects.role IS 'The role assigned to this project entry';
