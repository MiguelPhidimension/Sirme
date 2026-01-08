import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LoginForm } from "~/components/organisms";
import { loginUser, saveUserSession } from "~/graphql/hooks/useAuth";
import type { LoginFormData } from "~/types";

/**
 * Login Page
 * Allows users to authenticate with email and password
 */
export default component$(() => {
  const nav = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal("");

  const handleLogin = $(async (formData: LoginFormData) => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await loginUser(formData);

      if (response.success && response.user && response.token) {
        // Save session
        await saveUserSession(response.user, response.token);

        // Redirect to dashboard
        await nav("/");
      } else {
        error.value = response.message || "Error al iniciar sesión";
      }
    } catch (err) {
      console.error("Login error:", err);
      error.value = "Error inesperado. Intente nuevamente.";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
        <div class="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl delay-1000 dark:bg-purple-500/10"></div>
      </div>

      {/* Logo/Brand Header */}
      <div class="absolute top-8 left-8 z-10">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            <svg
              class="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
              SIRME
            </h1>
            <p class="text-xs text-slate-600 dark:text-slate-400">
              Sistema de Registro de Horas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="relative z-10 w-full max-w-md">
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading.value}
          error={error.value}
        />
      </div>
    </div>
  );
});
