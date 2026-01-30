CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 2. Tabla de usuarios
CREATE TABLE users (
    user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id     UUID NOT NULL,
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

-- 3. Tabla de clientes
CREATE TABLE clients (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL
);

-- 4. Tabla de proyectos
CREATE TABLE projects (
    project_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id    UUID,
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

-- 5. Tabla principal de registro de horas (por día y usuario)
CREATE TABLE time_entries (
    time_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL,
    entry_date    DATE NOT NULL,
    is_pto        BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP,
    CONSTRAINT fk_te_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 6. Detalle de proyectos reportados por día (múltiples proyectos por registro)
CREATE TABLE time_entry_projects (
    tep_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_entry_id  UUID NOT NULL,
    project_id     UUID NOT NULL,
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

-- 7. Tabla de reportes consolidados (para consultas rápidas)
CREATE TABLE time_reports (
    report_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL,
    project_id  UUID NOT NULL,
    period      DATE NOT NULL,
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

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar roles predeterminados
INSERT INTO roles (role_name, description) VALUES
    ('Architect MuleSoft', 'Arquitecto especializado en soluciones MuleSoft'),
    ('MuleSoft Developer', 'Desarrollador de integraciones con MuleSoft'),
    ('Developer Fullstack', 'Desarrollador Full Stack'),
    ('Data Engineer', 'Ingeniero de Datos'),
    ('Developer Snowflake', 'Desarrollador especializado en Snowflake'),
    ('Analista BI', 'Analista de Business Intelligence'),
    ('Other', 'Otro rol')
ON CONFLICT (role_name) DO NOTHING;

-- Insertar clientes de ejemplo (opcional)
INSERT INTO clients (name) VALUES
    ('Cliente Demo 1'),
    ('Cliente Demo 2'),
    ('MuleSoft Professional Services')
ON CONFLICT DO NOTHING;