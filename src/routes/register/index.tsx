import {
  component$,
  useSignal,
  $,
  useResource$,
  Resource,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { RegisterForm } from "~/components/organisms";
import { registerUser, saveUserSession } from "~/graphql/hooks/useAuth";
import { graphqlClient } from "~/graphql/client";
import type { RegisterFormData } from "~/types";

const GET_ALL_ROLES_QUERY = `
  query GetAllRoles {
    roles(order_by: { role_name: asc }) {
      role_id
      role_name
      description
    }
  }
`;

/**
 * Register Page
 * Allows new users to create an account
 */
export default component$(() => {
  const nav = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal("");

  // Fetch roles for the select dropdown
  const rolesResource = useResource$<{
    roles: Array<{ role_id: string; role_name: string }>;
  }>(async () => {
    try {
      const response = await graphqlClient.request<{
        roles: Array<{
          role_id: string;
          role_name: string;
          description?: string;
        }>;
      }>(GET_ALL_ROLES_QUERY);
      return { roles: response.roles };
    } catch (err) {
      console.error("Error fetching roles:", err);
      throw new Error("No se pudieron cargar los roles");
    }
  });

  const handleRegister = $(async (formData: RegisterFormData) => {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await registerUser(formData);

      if (response.success && response.user && response.token) {
        // Save session
        await saveUserSession(response.user, response.token);

        // Redirect to dashboard
        await nav("/");
      } else {
        error.value = response.message || "Error al crear la cuenta";
      }
    } catch (err) {
      console.error("Register error:", err);
      error.value = "Error inesperado. Intente nuevamente.";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/10"></div>
        <div class="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-blue-400/20 blur-3xl delay-1000 dark:bg-blue-500/10"></div>
      </div>

      {/* Logo */}
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
      <div class="relative z-10 w-full max-w-2xl">
        <Resource
          value={rolesResource}
          onPending={() => (
            <div class="group relative">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
              <div class="relative rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/20 dark:bg-slate-800/70">
                <div class="py-12 text-center">
                  <div class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
                  <p class="font-medium text-slate-600 dark:text-slate-400">
                    Cargando formulario...
                  </p>
                </div>
              </div>
            </div>
          )}
          onResolved={(data) => (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading.value}
              error={error.value}
              roles={data.roles}
            />
          )}
          onRejected={(error) => (
            <div class="group relative">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
              <div class="relative rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/20 dark:bg-slate-800/70">
                <div class="py-12 text-center">
                  <svg
                    class="mx-auto mb-4 h-16 w-16 text-red-500"
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
                  <p class="text-lg font-semibold text-red-600 dark:text-red-400">
                    Error al cargar el formulario
                  </p>
                  <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {String(error)}
                  </p>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
});
