import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { Button, Input, Select } from "~/components/atoms";
import type { RegisterFormData } from "~/types";

interface RegisterFormProps {
  onSubmit: QRL<(data: RegisterFormData) => Promise<void>>;
  isLoading?: boolean;
  error?: string;
  roles: Array<{ role_id: string; role_name: string }>;
}

/**
 * Register Form Component
 * Handles new user registration
 */
export const RegisterForm = component$<RegisterFormProps>(
  ({ onSubmit, isLoading, error, roles }) => {
    const firstName = useSignal("");
    const lastName = useSignal("");
    const email = useSignal("");
    const password = useSignal("");
    const confirmPassword = useSignal("");
    const roleId = useSignal("");
    const validationErrors = useSignal<
      Partial<Record<keyof RegisterFormData, string>>
    >({});

    const validateForm = $(() => {
      const errors: Partial<Record<keyof RegisterFormData, string>> = {};

      // First name validation
      if (!firstName.value) {
        errors.first_name = "El nombre es requerido";
      } else if (firstName.value.length < 2) {
        errors.first_name = "El nombre debe tener al menos 2 caracteres";
      }

      // Last name validation
      if (!lastName.value) {
        errors.last_name = "El apellido es requerido";
      } else if (lastName.value.length < 2) {
        errors.last_name = "El apellido debe tener al menos 2 caracteres";
      }

      // Email validation
      if (!email.value) {
        errors.email = "El email es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Email inválido";
      }

      // Password validation
      if (!password.value) {
        errors.password = "La contraseña es requerida";
      } else if (password.value.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
      }

      // Confirm password validation
      if (!confirmPassword.value) {
        errors.confirm_password = "Confirma tu contraseña";
      } else if (password.value !== confirmPassword.value) {
        errors.confirm_password = "Las contraseñas no coinciden";
      }

      // Role validation
      if (!roleId.value) {
        errors.role_id = "Selecciona un rol";
      }

      validationErrors.value = errors;
      return Object.keys(errors).length === 0;
    });

    const handleSubmit = $(async () => {
      const isValid = await validateForm();
      if (!isValid) return;

      await onSubmit({
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        confirm_password: confirmPassword.value,
        role_id: roleId.value,
      });
    });

    return (
      <div class="group relative">
        {/* Glassmorphism card effect */}
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

        <div class="relative rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/20 dark:bg-slate-800/70">
          {/* Header */}
          <div class="mb-8 text-center">
            <h2 class="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-300">
              Crear Nueva Cuenta
            </h2>
            <p class="text-slate-600 dark:text-slate-400">
              Únete a nuestro equipo completando el formulario
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div class="flex items-center space-x-2">
                <svg
                  class="h-5 w-5 flex-shrink-0 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            preventdefault:submit
            onSubmit$={handleSubmit}
            class="space-y-5"
          >
            {/* Name Fields Grid */}
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  for="firstName"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Nombre
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    value={firstName.value}
                    onInput$={(e) =>
                      (firstName.value = (e.target as HTMLInputElement).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                      validationErrors.value.first_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.first_name && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{validationErrors.value.first_name}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  for="lastName"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Apellido
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Pérez"
                    value={lastName.value}
                    onInput$={(e) =>
                      (lastName.value = (e.target as HTMLInputElement).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                      validationErrors.value.last_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.last_name && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{validationErrors.value.last_name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email Corporativo
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email.value}
                  onInput$={(e) =>
                    (email.value = (e.target as HTMLInputElement).value)
                  }
                  class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                    validationErrors.value.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                  } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                  required
                />
              </div>
              {validationErrors.value.email && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{validationErrors.value.email}</span>
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label
                for="role"
                class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Rol Profesional
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Select
                  id="role"
                  value={roleId.value}
                  onChange$={(e) =>
                    (roleId.value = (e.target as HTMLSelectElement).value)
                  }
                  class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                    validationErrors.value.role_id
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                  } cursor-pointer appearance-none rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                  required
                >
                  <option value="">Selecciona tu rol</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </Select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {validationErrors.value.role_id && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{validationErrors.value.role_id}</span>
                </p>
              )}
            </div>

            {/* Password Fields Grid */}
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Password */}
              <div>
                <label
                  for="password"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Contraseña
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password.value}
                    onInput$={(e) =>
                      (password.value = (e.target as HTMLInputElement).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                      validationErrors.value.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.password && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{validationErrors.value.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  for="confirmPassword"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirmar
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword.value}
                    onInput$={(e) =>
                      (confirmPassword.value = (
                        e.target as HTMLInputElement
                      ).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 dark:bg-slate-700 ${
                      validationErrors.value.confirm_password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.confirm_password && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{validationErrors.value.confirm_password}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              class="mt-6 w-full transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div class="flex items-center justify-center space-x-2">
                  <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                <div class="flex items-center justify-center space-x-2">
                  <span>Crear Cuenta</span>
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div class="mt-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                class="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
