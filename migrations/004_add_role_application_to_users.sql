-- Add role_application column to users table
ALTER TABLE users ADD COLUMN role_application VARCHAR(50) DEFAULT 'colaborador' NOT NULL;
