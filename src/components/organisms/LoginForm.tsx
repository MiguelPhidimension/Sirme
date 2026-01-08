import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { Button, Input } from "~/components/atoms";
import type { LoginFormData } from "~/types";

interface LoginFormProps {
  onSubmit: QRL<(data: LoginFormData) => Promise<void>>;
  isLoading?: boolean;
  error?: string;
}

/**
 * Login Form Component
 * Handles user authentication with email and password
 */
export const LoginForm = component$<LoginFormProps>(
  ({ onSubmit, isLoading, error }) => {
    const email = useSignal("");
    const password = useSignal("");
    const validationErrors = useSignal<{ email?: string; password?: string }>(
      {},
    );

    const validateForm = $(() => {
      const errors: { email?: string; password?: string } = {};

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

      validationErrors.value = errors;
      return Object.keys(errors).length === 0;
    });

    const handleSubmit = $(async () => {
      const isValid = await validateForm();
      if (!isValid) return;

      await onSubmit({
        email: email.value,
        password: password.value,
      });
    });

    return (
      <div class="group relative">
        {/* Glassmorphism card effect */}
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

        <div class="relative rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/20 dark:bg-slate-800/70">
          {/* Header */}
          <div class="mb-8 text-center">
            <h2 class="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-300">
              Bienvenido de vuelta
            </h2>
            <p class="text-slate-600 dark:text-slate-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div class="flex items-center space-x-2">
                <svg
                  class="h-5 w-5 text-red-500"
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
            class="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email
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
                  placeholder="tu@email.com"
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

            {/* Password Field */}
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
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Remember & Forgot */}
            <div class="flex items-center justify-between text-sm">
              <label class="group flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-slate-600 transition-colors group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-300">
                  Recordarme
                </span>
              </label>
              <a
                href="/forgot-password"
                class="font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              class="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div class="flex items-center justify-center space-x-2">
                  <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div class="flex items-center justify-center space-x-2">
                  <span>Iniciar Sesión</span>
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div class="mt-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              ¿No tienes una cuenta?{" "}
              <a
                href="/register"
                class="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
