import { component$, Slot, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useLocation, useNavigate, routeLoader$ } from "@builder.io/qwik-city";
import { MainLayout } from "~/components/templates";

/**
 * Route layout that uses MainLayout template
 * Protects all routes - requires authentication
 */
export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const isChecking = useSignal(true); // 🆕 Estado de verificación

  // Check authentication on client side
  useVisibleTask$(() => {
    const publicPaths = ["/", "/register"];
    const currentPath = loc.url.pathname;

    // Si es ruta pública, no verificar
    if (publicPaths.some((path) => currentPath.startsWith(path))) {
      isChecking.value = false;
      return;
    }

    // Verificar autenticación
    const token = sessionStorage.getItem("auth_token");
    const user = sessionStorage.getItem("auth_user");

    if (!token || !user) {
      nav("/");
    } else {
      isChecking.value = false; // ✅ Autenticado, mostrar contenido
    }
  });

  // 🆕 Mostrar loader mientras se verifica
  if (isChecking.value) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div class="flex flex-col items-center space-y-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p class="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Always render with MainLayout - it handles showing/hiding sidebar
  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
});
