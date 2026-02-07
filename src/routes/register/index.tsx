import {
  component$,
  useSignal,
  $,
  useResource$,
  Resource,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { RegisterForm } from "~/components/organisms";
import { BrandHeader, AnimatedBackground } from "~/components/molecules";
import { registerUser, saveUserSession } from "~/graphql/hooks/useAuth";
import { graphqlClient } from "~/graphql/client";
import type { RegisterFormData } from "~/types";
import { LuAlertCircle } from "@qwikest/icons/lucide";

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
  const clientReady = useSignal(false);

  useVisibleTask$(() => {
    clientReady.value = true;
  });

  // Fetch roles for the select dropdown
  const rolesResource = useResource$<{
    roles: Array<{ role_id: string; role_name: string }>;
  }>(async () => {
    try {
      if (!clientReady.value) {
        return { roles: [] };
      }

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

        // Show success message briefly before redirecting

        // Redirect to calendar
        await nav("/calendar");
      } else {
        // Handle error response
        error.value = response.message || "Error al crear la cuenta";

        // Log detailed errors for debugging
        if (response.errors && response.errors.length > 0) {
          console.error("Errores de registro:", response.errors);
          error.value = response.errors.join(". ");
        }
      }
    } catch (err: any) {
      console.error("Register error:", err);

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
      <AnimatedBackground />
      <BrandHeader />

      {/* Main Content */}
      <div class="relative z-1 mt-20 w-full max-w-2xl sm:mt-0">
        {/* Main Content */}
        <div class="relative z-1 w-full max-w-2xl">
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
                    <LuAlertCircle class="mx-auto mb-4 h-16 w-16 text-red-500" />
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
    </div>
  );
});
