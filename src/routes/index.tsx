import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LoginForm } from "~/components/organisms";
import { loginUser, saveUserSession } from "~/graphql/hooks/useAuth";
import type { LoginFormData } from "~/types";

/**
 * Login Page (Main Route)
 * Allows users to authenticate with email and password
 * Redirects to /calendar if already authenticated
 */
export default component$(() => {
  const nav = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal("");

  // Check if already authenticated
  useVisibleTask$(() => {
    const token = sessionStorage.getItem("auth_token");
    const user = sessionStorage.getItem("auth_user");

    if (token && user) {
      // Already authenticated, redirect to calendar
      nav("/calendar");
    }
  });

  const handleLogin = $(async (formData: LoginFormData) => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await loginUser(formData);

      if (response.success && response.user && response.token) {
        // Save session
        await saveUserSession(response.user, response.token);

        // Log success
        console.log("✅ Login exitoso:", response.user.email);

        // Redirect to calendar
        await nav("/calendar");
      } else {
        // Handle error response
        error.value = response.message || "Error al iniciar sesión";

        // Show detailed errors
        if (response.errors && response.errors.length > 0) {
          console.error("Errores de login:", response.errors);
          error.value = response.errors.join(". ");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Provide more specific error messages
      if (err.message?.includes("network") || err.message?.includes("fetch")) {
        error.value =
          "Error de conexión. Verifica tu internet e intenta nuevamente.";
      } else if (err.message?.includes("GraphQL")) {
        error.value = "Error en la base de datos. Contacta al administrador.";
      } else {
        error.value = err.message || "Error inesperado. Intente nuevamente.";
      }
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background elements */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
        <div class="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl delay-1000 dark:bg-purple-500/10"></div>
      </div>

      {/* Logo/Brand Header */}
      <div class="absolute top-4 right-4 left-4 z-10 sm:right-auto sm:left-8">
        <div class="flex items-center justify-center space-x-2 sm:justify-start sm:space-x-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg sm:h-10 sm:w-10 sm:rounded-xl">
            <svg
              class="h-5 w-5 text-white sm:h-6 sm:w-6"
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
            <h1 class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-blue-400 dark:to-purple-400">
              SIRME
            </h1>
            <p class="text-xs text-slate-600 dark:text-slate-400">
              Time Recording System
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="relative z-10 mt-20 w-full max-w-md sm:mt-0">
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading.value}
          error={error.value}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard - SIRME Pro",
  meta: [
    {
      name: "description",
      content:
        "Modern time tracking dashboard for managing work hours and projects with enhanced UI/UX",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],
};
