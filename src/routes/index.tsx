import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { BrandHeader, AnimatedBackground } from "~/components/molecules";
import { LoginForm } from "~/components/organisms";
import { loginUser, saveUserSession } from "~/graphql/hooks/useAuth";
import type { LoginFormData } from "~/types";

/**
 * Login Page (Main Route) - Refactored with modular components
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
      <AnimatedBackground />

      {/* Logo/Brand Header */}
      <BrandHeader />

      {/* Main Content */}
      <div class="relative z-1 mt-20 w-full max-w-md sm:mt-0">
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
