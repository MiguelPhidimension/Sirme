# 🔒 Sistema de Protección de Rutas - SIRME

Sistema completo de autenticación y autorización implementado para controlar el acceso a las rutas de la aplicación.

## 📋 Flujo de Autenticación

### **Usuario NO Autenticado**

```
┌─────────────────────────────────────────┐
│ Usuario visita cualquier ruta           │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Layout verifica sessionStorage          │
│ - auth_token: ❌ No existe             │
│ - auth_user: ❌ No existe              │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Redirección automática a /login        │
│ Solo puede ver: /login y /register     │
└─────────────────────────────────────────┘
```

### **Usuario Autenticado**

```
┌─────────────────────────────────────────┐
│ Usuario inicia sesión correctamente    │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Datos guardados en sessionStorage      │
│ - auth_token: ✅ "encrypted_token"    │
│ - auth_user: ✅ {user_data}           │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Redirección a Dashboard (/)            │
│ Acceso completo a todas las rutas      │
└─────────────────────────────────────────┘
```

## 🛡️ Protección Implementada

### **1. Layout Principal (`/src/routes/layout.tsx`)**

Protege todas las rutas del dashboard y la aplicación.

**Funcionamiento:**

- ✅ Verifica autenticación al cargar cualquier ruta
- ✅ Excluye rutas públicas (`/login`, `/register`)
- ✅ Redirige a `/login` si no hay sesión válida
- ✅ Renderiza `MainLayout` con navegación completa

```typescript
// Verificación en el layout principal
useVisibleTask$(() => {
  const publicPaths = ["/login", "/register"];
  const currentPath = loc.url.pathname;

  if (publicPaths.includes(currentPath)) {
    return; // No verificar auth en páginas públicas
  }

  const token = sessionStorage.getItem("auth_token");
  const user = sessionStorage.getItem("auth_user");

  if (!token || !user) {
    nav("/login"); // Redirigir a login
  }
});
```

### **2. Layouts de Autenticación**

- **`/src/routes/login/layout.tsx`**
- **`/src/routes/register/layout.tsx`**

**Funcionamiento:**

- ✅ Verifica si el usuario YA está autenticado
- ✅ Redirige a `/` (dashboard) si ya hay sesión
- ✅ Renderiza solo el contenido (sin navbar)
- ✅ Diseño minimalista para auth

```typescript
// Verificación en layouts de auth
useVisibleTask$(() => {
  const token = sessionStorage.getItem("auth_token");
  const user = sessionStorage.getItem("auth_user");

  if (token && user) {
    nav("/"); // Ya autenticado, ir al dashboard
  }
});
```

## 🎨 Navegación Condicional

### **Navbar para Usuario NO Autenticado**

Las páginas `/login` y `/register` NO muestran:

- ❌ Links de navegación (Dashboard, Reports, etc.)
- ❌ Información del usuario
- ❌ Dropdown de perfil
- ❌ Opciones de configuración

Solo muestran:

- ✅ Logo de la aplicación (SIRME)
- ✅ Diseño minimalista
- ✅ Formulario centrado

### **Navbar para Usuario Autenticado**

El `MainLayout` muestra:

- ✅ Logo clickeable
- ✅ Links de navegación activos
- ✅ Nombre completo del usuario
- ✅ Rol del usuario
- ✅ Avatar con iniciales
- ✅ Dropdown con opciones:
  - Mi Perfil
  - Configuración
  - Cerrar Sesión

## 🔑 Funciones de Autenticación

### **Archivo: `/src/utils/auth.ts`**

```typescript
// Verificar si está autenticado
isAuthenticated(): boolean

// Obtener usuario actual
getCurrentUser(): User | null

// Obtener token
getAuthToken(): string | null

// Limpiar autenticación (logout)
clearAuth(): void
```

## 🚀 Rutas y Acceso

### **Rutas Públicas** (sin autenticación)

```
/login     → Formulario de inicio de sesión
/register  → Formulario de registro
```

### **Rutas Protegidas** (requieren autenticación)

```
/              → Dashboard principal
/entry         → Registro de horas
/calendar      → Vista de calendario
/reports       → Reportes y análisis
/profile       → Perfil del usuario
/settings      → Configuración
```

## 📊 Matriz de Acceso

| Ruta        | Usuario NO Auth        | Usuario Auth      | Navbar Completo |
| ----------- | ---------------------- | ----------------- | --------------- |
| `/login`    | ✅ Permitido           | ❌ Redirige a `/` | ❌ No           |
| `/register` | ✅ Permitido           | ❌ Redirige a `/` | ❌ No           |
| `/`         | ❌ Redirige a `/login` | ✅ Permitido      | ✅ Sí           |
| `/entry`    | ❌ Redirige a `/login` | ✅ Permitido      | ✅ Sí           |
| `/calendar` | ❌ Redirige a `/login` | ✅ Permitido      | ✅ Sí           |
| `/reports`  | ❌ Redirige a `/login` | ✅ Permitido      | ✅ Sí           |

## 🔄 Flujo Completo del Usuario

### **Nuevo Usuario**

```
1. Visita aplicación
2. Redirigido a /login automáticamente
3. Click en "Regístrate aquí"
4. Llena formulario en /register
5. Submit → Crea cuenta + Autenticación automática
6. sessionStorage guardado
7. Redirigido a Dashboard (/)
8. Acceso completo con navbar
```

### **Usuario Existente**

```
1. Visita /login
2. Ingresa credenciales
3. Submit → Verifica en BD
4. sessionStorage guardado
5. Redirigido a Dashboard (/)
6. Acceso completo con navbar
```

### **Usuario Logueado que Intenta Acceder a Auth**

```
1. Usuario YA está logueado
2. Intenta visitar /login o /register
3. Layout detecta sessionStorage
4. Redirigido automáticamente a /
5. Mantiene sesión activa
```

### **Logout**

```
1. Usuario click en avatar
2. Click en "Cerrar Sesión"
3. clearAuth() ejecutado
4. sessionStorage limpiado
5. Redirigido a /login
6. Navbar completo deshabilitado
```

## 🛠️ Archivos Modificados

### Protección de Rutas

- ✅ `src/routes/layout.tsx` - Layout principal con protección
- ✅ `src/routes/login/layout.tsx` - Layout de login con verificación
- ✅ `src/routes/register/layout.tsx` - Layout de registro con verificación

### Utilidades

- ✅ `src/utils/auth.ts` - Funciones de autenticación (NUEVO)
- ✅ `src/utils/index.ts` - Export de utilidades auth

### Componentes

- ✅ `src/components/templates/MainLayout.tsx` - Navbar condicional

## ⚡ Ventajas del Sistema

1. **Seguridad**: Sin token válido = sin acceso
2. **UX Fluida**: Redirecciones automáticas sin fricción
3. **Estado Consistente**: sessionStorage como fuente de verdad
4. **Separación Clara**: Layouts diferentes para auth y app
5. **Mantenible**: Lógica centralizada y reutilizable

## 🔒 Consideraciones de Seguridad

### **Implementado**

- ✅ Verificación en cada carga de ruta
- ✅ Tokens en sessionStorage (limpiados al cerrar pestaña)
- ✅ Redirecciones automáticas
- ✅ Verificación bidireccional (auth ↔ app)

### **Para Producción** (Recomendaciones)

- 🔄 JWT con expiración en el backend
- 🔄 HTTP-only cookies en lugar de sessionStorage
- 🔄 Refresh tokens para sesiones largas
- 🔄 Rate limiting en endpoints de auth
- 🔄 HTTPS obligatorio en producción

---

**Sistema completo de protección de rutas implementado y funcionando** 🎉✨
