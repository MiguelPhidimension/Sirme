# Sistema de Registro de Usuarios - SIRME

## 📋 Descripción General

El sistema de registro permite a nuevos usuarios crear cuentas en la plataforma SIRME (Sistema de Registro de Horas). El sistema valida los datos, verifica la disponibilidad del email, encripta contraseñas y registra el usuario en la base de datos PostgreSQL a través de Hasura GraphQL.

## 🗂️ Estructura del Sistema

### 1. Base de Datos

#### Tabla `roles`

```sql
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
```

**Roles Disponibles:**

- Architect MuleSoft
- MuleSoft Developer
- Developer Fullstack
- Data Engineer
- Developer Snowflake
- Analista BI
- Other

#### Tabla `users`

```sql
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
);
```

### 2. Arquitectura de Componentes

```
src/
├── routes/
│   └── register/
│       ├── index.tsx          # Página principal de registro
│       └── layout.tsx         # Layout del registro
├── components/
│   └── organisms/
│       └── RegisterForm.tsx   # Formulario de registro
└── graphql/
    └── hooks/
        └── useAuth.ts         # Lógica de autenticación y registro
```

## 🔐 Flujo de Registro

### 1. Usuario Accede al Formulario

- Ruta: `/register`
- El usuario ve un formulario con campos para:
  - Nombre
  - Apellido
  - Email corporativo
  - Rol profesional
  - Contraseña
  - Confirmación de contraseña

### 2. Validaciones del Lado del Cliente

**Nombre y Apellido:**

- Requeridos
- Mínimo 2 caracteres

**Email:**

- Requerido
- Formato válido (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)

**Contraseña:**

- Requerida
- Mínimo 6 caracteres
- Debe coincidir con la confirmación

**Rol:**

- Requerido
- Debe seleccionarse de la lista de roles disponibles

### 3. Envío y Procesamiento

Cuando el usuario envía el formulario:

```typescript
handleRegister(formData) {
  1. Validar campos requeridos
  2. Verificar que el email no exista (GraphQL query)
  3. Validar coincidencia de contraseñas
  4. Encriptar contraseña (SHA-256)
  5. Crear usuario en BD (GraphQL mutation)
  6. Generar token de sesión
  7. Guardar sesión en sessionStorage
  8. Redirigir a /calendar
}
```

## 📡 GraphQL API

### Query: Verificar Email Existente

```graphql
query CheckEmailExists($email: String!) {
  users(where: { email: { _eq: $email } }) {
    user_id
  }
}
```

### Query: Obtener Todos los Roles

```graphql
query GetAllRoles {
  roles(order_by: { role_name: asc }) {
    role_id
    role_name
    description
  }
}
```

### Mutation: Crear Usuario

```graphql
mutation CreateUser(
  $first_name: String!
  $last_name: String!
  $email: String!
  $password: String!
  $role_id: uuid!
) {
  insert_users_one(
    object: {
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      role_id: $role_id
    }
  ) {
    user_id
    role_id
    first_name
    last_name
    email
    created_at
    role {
      role_id
      role_name
      description
    }
  }
}
```

## 🔒 Seguridad

### Encriptación de Contraseñas

```typescript
// Función de hash SHA-256
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
```

> ⚠️ **Nota:** En producción se debe usar bcrypt en el backend para mayor seguridad.

### Manejo de Sesiones

```typescript
// Generar token
const token = btoa(
  JSON.stringify({
    user_id: user.user_id,
    email: user.email,
    timestamp: Date.now(),
  }),
);

// Guardar en sessionStorage
sessionStorage.setItem("auth_token", token);
sessionStorage.setItem("auth_user", JSON.stringify(user));
```

## ⚠️ Manejo de Errores

### Errores Comunes

1. **Email ya registrado:**

   - Mensaje: "Este email ya está en uso"
   - Solución: Usar otro email o iniciar sesión

2. **Contraseñas no coinciden:**

   - Mensaje: "Las contraseñas no coinciden"
   - Solución: Verificar ambos campos

3. **Campos vacíos:**

   - Mensaje específico por campo
   - Solución: Completar todos los campos requeridos

4. **Error de conexión:**

   - Mensaje: "Error de conexión. Verifica tu internet"
   - Solución: Verificar conexión a internet

5. **Error de base de datos:**
   - Mensaje: "Error en la base de datos. Contacta al administrador"
   - Solución: Verificar Hasura y configuración de BD

## 🧪 Pruebas

### Caso de Prueba 1: Registro Exitoso

```
Datos:
- Nombre: Juan
- Apellido: Pérez
- Email: juan.perez@empresa.com
- Rol: MuleSoft Developer
- Contraseña: password123
- Confirmar: password123

Resultado Esperado:
✅ Usuario creado
✅ Sesión guardada
✅ Redirección a /calendar
```

### Caso de Prueba 2: Email Duplicado

```
Datos:
- Email ya registrado en BD

Resultado Esperado:
❌ Error: "Este email ya está en uso"
```

### Caso de Prueba 3: Contraseñas No Coinciden

```
Datos:
- Contraseña: password123
- Confirmar: password456

Resultado Esperado:
❌ Error: "Las contraseñas no coinciden"
```

## 🚀 Configuración e Instalación

### 1. Configurar Base de Datos

```sql
-- Ejecutar el script de creación de tablas
\i bd-sirme.sql

-- Verificar que los roles se insertaron
SELECT * FROM roles;
```

### 2. Configurar Hasura

1. Conectar a la base de datos PostgreSQL
2. Trackear las tablas `users` y `roles`
3. Configurar permisos de inserción en `users`
4. Establecer relación entre `users` y `roles`

### 3. Variables de Entorno

El endpoint y secret de Hasura están configurados en:

```typescript
// src/graphql/client.ts
const GRAPHQL_ENDPOINT = "https://easy-bison-49.hasura.app/v1/graphql";
const ADMIN_SECRET =
  "QeNCmNFN5d4PuAOhg6QLX5Hq0UfdTR48249BE6ivRPZmxrNAMWVP39yOvMYwvjr2";
```

> ⚠️ **Importante:** Mover estas credenciales a variables de entorno en producción.

## 📝 Código de Ejemplo

### Registrar un Usuario Programáticamente

```typescript
import { registerUser } from "~/graphql/hooks/useAuth";

const formData = {
  first_name: "Juan",
  last_name: "Pérez",
  email: "juan.perez@empresa.com",
  password: "password123",
  confirm_password: "password123",
  role_id: "uuid-del-rol",
};

const response = await registerUser(formData);

if (response.success) {
  console.log("Usuario registrado:", response.user);
  console.log("Token:", response.token);
} else {
  console.error("Error:", response.message);
}
```

## 🔄 Flujo Visual

```
┌─────────────────┐
│  Usuario        │
│  Visita         │
│  /register      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cargar Roles   │
│  desde Hasura   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mostrar        │
│  Formulario     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Usuario        │
│  Completa       │
│  Formulario     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validaciones   │
│  Cliente        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verificar      │
│  Email único    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Hash           │
│  Password       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Insert User    │
│  a Base Datos   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generar Token  │
│  y Guardar      │
│  Sesión         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect       │
│  /calendar      │
└─────────────────┘
```

## 📚 Referencias

- [Qwik Documentation](https://qwik.builder.io/)
- [Hasura GraphQL](https://hasura.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 🐛 Troubleshooting

### Problema: Error al cargar roles

**Síntoma:** Formulario muestra "Error al cargar el formulario"

**Solución:**

1. Verificar que Hasura esté corriendo
2. Verificar que la tabla `roles` tenga datos
3. Verificar permisos en Hasura
4. Revisar la consola del navegador

### Problema: Usuario no se crea

**Síntoma:** Formulario no redirige, muestra error genérico

**Solución:**

1. Revisar logs de la consola
2. Verificar permisos de inserción en Hasura
3. Verificar que todos los campos requeridos estén presentes
4. Verificar que el `role_id` sea válido

### Problema: Redirección al login desde /register

**Síntoma:** Al acceder a `/register` se redirecciona a `/`

**Solución:**

- Ya está resuelto. El layout verifica que las rutas que empiezan con `/register` sean públicas.

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0
