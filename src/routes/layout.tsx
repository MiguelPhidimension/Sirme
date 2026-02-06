import { component$, Slot, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useLocation, routeLoader$ } from "@builder.io/qwik-city";
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
  const isChecking = useSignal(true);
  const isAuthenticated = useSignal(false);

  // Check authentication on client side
  useVisibleTask$(({ track }) => {
    track(() => loc.url.pathname);

    const publicPaths = ["/", "/register"];
    const currentPath = loc.url.pathname;

    const checkAuth = () => {
      try {
        // Si es ruta pública, permitir acceso
        const isPublic = publicPaths.some((path) => {
          // Exact match handling
          if (currentPath === path) return true;
          const pathWithSlash = path.endsWith("/") ? path : `${path}/`;
          const currentWithSlash = currentPath.endsWith("/")
            ? currentPath
            : `${currentPath}/`;
          if (currentWithSlash === pathWithSlash) return true;

          // Subpath handling (excluding root path "/" which would match everything)
          if (path === "/" || path === "") return false;
          return currentPath.startsWith(pathWithSlash);
        });

        if (isPublic) {
          isChecking.value = false;
          isAuthenticated.value = true;
          return;
        }

        // Verificar autenticación para rutas protegidas
        const token = sessionStorage.getItem("auth_token");
        const user = sessionStorage.getItem("auth_user");

        if (!token || !user) {
          // No autenticado: redirigir inmediatamente y limpiar todo
          sessionStorage.clear();
          localStorage.clear();
          isAuthenticated.value = false;
          isChecking.value = false;
          // Usar replace para que no se pueda volver atrás con el botón back
          window.location.replace("/");
        } else {
          // Autenticado check role permissions
          try {
            const userData = JSON.parse(user);
            // Admin only routes
            if (
              (currentPath.startsWith("/reports") ||
                currentPath.startsWith("/admin")) &&
              userData.role_application !== "administrador"
            ) {
              // User not authorized to view reports
              console.warn("Access denied: Admin role required for page");
              window.location.replace("/calendar");
              // setIsChecking to false not needed as we are redirecting
              return;
            }
          } catch (e) {
            console.error("Error parsing user data for role check", e);
          }

          // Autenticado: permitir acceso
          isAuthenticated.value = true;
          isChecking.value = false;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // In case of error, redirect to login for safety
        isAuthenticated.value = false;
        isChecking.value = false;
        window.location.replace("/");
      }
    };

    // Verificar autenticación al cargar
    checkAuth();

    // Detectar cuando la página se carga desde el cache del navegador (botón atrás)
    const handlePageShow = (event: PageTransitionEvent) => {
      // Si la página viene del cache (bfcache), verificar autenticación de nuevo
      if (event.persisted) {
        checkAuth();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    // Cleanup
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  });

  // Mostrar loader mientras se verifica
  if (isChecking.value) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div class="flex flex-col items-center space-y-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Verificando...
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar loader mientras redirige
  if (!isAuthenticated.value) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div class="flex flex-col items-center space-y-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Redirigiendo...
          </p>
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
