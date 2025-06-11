-- ===========================================
-- 1. Tabla de roles (incluye roles específicos del formulario)
-- ===========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ===========================================
-- 2. Tabla de usuarios
-- ===========================================
CREATE TABLE users (
    user_id     SERIAL PRIMARY KEY,
    role_id     INT NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(256) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles (role_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ===========================================
-- 3. Tabla de clientes
-- ===========================================
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ===========================================
-- 4. Tabla de proyectos
-- ===========================================
CREATE TABLE projects (
    project_id   SERIAL PRIMARY KEY,
    client_id    INT,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    start_date   DATE,
    end_date     DATE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP,
    CONSTRAINT fk_project_client
        FOREIGN KEY (client_id)
        REFERENCES clients (client_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ===========================================
-- 5. Tabla principal de registro de horas (por día y usuario)
-- ===========================================
CREATE TABLE time_entries (
    time_entry_id SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    entry_date    DATE NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_te_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ===========================================
-- 6. Detalle de proyectos reportados por día (múltiples proyectos por registro)
-- ===========================================
CREATE TABLE time_entry_projects (
    tep_id         SERIAL PRIMARY KEY,
    time_entry_id  INT NOT NULL,
    project_id     INT NOT NULL,
    hours_reported DECIMAL(4,2) NOT NULL,
    is_mps         BOOLEAN DEFAULT FALSE,
    notes          TEXT,
    CONSTRAINT fk_tep_te
        FOREIGN KEY (time_entry_id)
        REFERENCES time_entries (time_entry_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_tep_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ===========================================
-- 7. Tabla de reportes consolidados (para consultas rápidas)
-- ===========================================
CREATE TABLE time_reports (
    report_id   SERIAL PRIMARY KEY,
    user_id     INT NOT NULL,
    project_id  INT NOT NULL,
    period      DATE NOT NULL,       -- semana, mes, etc.
    total_hours DECIMAL(5,2) DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tr_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_tr_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
