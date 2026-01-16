# 🔐 Sistema de Autenticación SIRME

Sistema completo de login y registro para la aplicación SIRME (Sistema de Registro de Horas).

## 📁 Estructura Creada

```
src/
├── types/
│   └── index.ts                        # ✅ Tipos de autenticación añadidos
├── graphql/
│   └── hooks/
│       └── useAuth.ts                  # ✅ NUEVO: Hooks de autenticación
├── components/
│   ├── organisms/
│   │   ├── LoginForm.tsx               # ✅ NUEVO: Componente formulario login
│   │   └── RegisterForm.tsx            # ✅ NUEVO: Componente formulario registro
│   ├── templates/
│   │   └── PublicLayout.tsx            # ✅ NUEVO: Layout sin navegación
│   └── providers/
│       ├── AuthProvider.tsx            # ✅ NUEVO: Contexto de autenticación
│       └── ProtectedRoute.tsx          # ✅ NUEVO: Protección de rutas
└── routes/
    ├── login/
    │   ├── index.tsx                   # ✅ NUEVO: Página de login
    │   └── layout.tsx                  # ✅ NUEVO: Layout específico
    └── register/
        ├── index.tsx                   # ✅ NUEVO: Página de registro
        └── layout.tsx                  # ✅ NUEVO: Layout específico
```

## 🚀 Características Implementadas

### 1. **Tipos TypeScript** ✅

- `User`: Interfaz de usuario completa
- `LoginFormData`: Datos del formulario de login
- `RegisterFormData`: Datos del formulario de registro
- `AuthResponse`: Respuesta de autenticación
- `AuthSession`: Datos de sesión

### 2. **Hooks GraphQL** ✅

- `loginUser()`: Autenticación de usuario
- `registerUser()`: Registro de nuevo usuario
- `hashPassword()`: Hash seguro de contraseñas (SHA-256)
- `verifyPassword()`: Verificación de contraseñas
- `saveUserSession()`: Guardar sesión en sessionStorage
- `getCurrentUser()`: Obtener usuario actual
- `logoutUser()`: Cerrar sesión

### 3. **Componentes de UI** ✅

- `LoginForm`: Formulario completo con validación
- `RegisterForm`: Formulario de registro con selector de roles
- Validación en tiempo real
- Manejo de errores
- Estados de carga
- Diseño responsive

### 4. **Páginas** ✅

- `/login`: Página de inicio de sesión
- `/register`: Página de registro
- Layouts personalizados sin navegación
- Integración con GraphQL

### 5. **Gestión de Sesión** ✅

- SessionStorage para tokens
- Contexto de autenticación
- Protección de rutas privadas
- Redirección automática
- Display de usuario en navbar

## 🔧 Uso

### Login

```typescript
// Navega a /login
// Ingresa email y contraseña
// Sistema verifica contra base de datos
// Guarda sesión y redirige al dashboard
```

### Registro

```typescript
// Navega a /register
// Completa el formulario:
//   - Nombre
//   - Apellido
//   - Email
//   - Rol (desde BD)
//   - Contraseña
//   - Confirmar contraseña
// Sistema crea usuario y autentica automáticamente
```

### Logout

```typescript
// Click en el avatar del usuario (navbar)
// Click en "Cerrar Sesión"
// Limpia sessionStorage
// Redirige a /login
```

## 🔒 Seguridad

### Implementado

- ✅ Hash de contraseñas (SHA-256)
- ✅ Validación de formularios
- ✅ Protección contra inyección SQL (GraphQL)
- ✅ Verificación de email único
- ✅ Validación de contraseñas coincidentes
- ✅ SessionStorage para tokens

### Para Producción (Recomendaciones)

- 🔄 Usar bcrypt en el backend para hash de contraseñas
- 🔄 Implementar JWT con expiración
- 🔄 Usar HTTP-only cookies en lugar de sessionStorage
- 🔄 Agregar rate limiting
- 🔄 Implementar CAPTCHA
- 🔄 2FA (autenticación de dos factores)
- 🔄 Recuperación de contraseña

## 📊 Flujo de Autenticación

```
┌────────────────────────────────────────────────────────────┐
│ 1. Usuario visita /login o /register                      │
└─────────────────────────┬──────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ 2. Llena el formulario                                     │
│    - Validación en tiempo real                             │
│    - Manejo de errores visuales                            │
└─────────────────────────┬──────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ 3. Submit → Hook useAuth                                   │
│    - loginUser() o registerUser()                          │
│    - Query GraphQL a Hasura                                │
└─────────────────────────┬──────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ 4. Hasura procesa                                          │
│    - Verifica credenciales (login)                         │
│    - Crea usuario (register)                               │
│    - Retorna datos + token                                 │
└─────────────────────────┬──────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Guarda sesión                                           │
│    - sessionStorage.setItem('auth_token')                  │
│    - sessionStorage.setItem('auth_user')                   │
└─────────────────────────┬──────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ 6. Redirige a dashboard                                    │
│    - useNavigate().nav('/')                                │
│    - Usuario autenticado ✅                                │
└────────────────────────────────────────────────────────────┘
```

## 🎨 UI/UX Features

- ✅ Diseño moderno con Tailwind CSS
- ✅ Gradientes y efectos de hover
- ✅ Validación visual en tiempo real
- ✅ Mensajes de error claros
- ✅ Estados de carga
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accesibilidad (labels, placeholders, required)

## 🧪 Testing

### Flujo de prueba manual:

1. **Registro**:

   - Ve a `/register`
   - Completa el formulario
   - Verifica validaciones
   - Verifica que crea el usuario en BD
   - Verifica redirección a dashboard

2. **Login**:

   - Ve a `/login`
   - Ingresa credenciales
   - Verifica autenticación
   - Verifica sesión guardada
   - Verifica redirección a dashboard

3. **Sesión**:
   - Verifica que el nombre aparece en navbar
   - Verifica dropdown de perfil
   - Verifica logout
   - Verifica limpieza de sesión

## 📝 Queries GraphQL Usadas

### Login

```graphql
query GetUserByEmail($email: String!) {
  users(where: { email: { _eq: $email } }) {
    user_id
    role_id
    first_name
    last_name
    email
    password
    role {
      role_id
      role_name
      description
    }
  }
}
```

### Register

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
    first_name
    last_name
    email
    role {
      role_name
    }
  }
}
```

## 🔗 Integración con MainLayout

El layout principal ahora:

- ✅ Muestra nombre del usuario autenticado
- ✅ Muestra rol del usuario
- ✅ Muestra iniciales en avatar
- ✅ Dropdown con opciones de perfil
- ✅ Botón de logout funcional
- ✅ Versión mobile responsive

## 📦 Próximos Pasos Sugeridos

1. **Recuperación de contraseña**

   - Crear `/forgot-password`
   - Envío de email con token
   - Reset de contraseña

2. **Perfil de usuario**

   - Crear `/profile`
   - Editar información personal
   - Cambiar contraseña
   - Subir avatar

3. **Roles y permisos**

   - Middleware de permisos
   - Rutas específicas por rol
   - Restricciones de acceso

4. **Mejoras de seguridad**
   - Implementar JWT real
   - HTTP-only cookies
   - Refresh tokens
   - CSRF protection

## ✅ Checklist de Implementación

- [x] Tipos TypeScript
- [x] Hooks de autenticación
- [x] Componentes de formularios
- [x] Páginas de login/registro
- [x] Layouts personalizados
- [x] Gestión de sesión
- [x] Integración con navbar
- [x] Protección de rutas
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Estados de carga
- [x] Diseño responsive

---

**Sistema de autenticación completamente funcional y listo para usar** ✨
