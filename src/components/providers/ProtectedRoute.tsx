import { component$, Slot } from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";

/**
 * Protected Route Wrapper
 * Redirects to login if user is not authenticated
 */

// Server function to check authentication
export const checkAuth = server$(function () {
  // In production, check HTTP-only cookies or session
  // For now, we'll check on the client side
  return { isAuthenticated: false };
});

export const ProtectedRoute = component$(() => {
  const nav = useNavigate();
  const loc = useLocation();

  // Check if user is authenticated (client-side for demo)
  const isAuthenticated =
    typeof window !== "undefined"
      ? !!sessionStorage.getItem("auth_token")
      : false;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(loc.url.pathname);

  // Redirect to login if not authenticated and not on a public route
  if (!isAuthenticated && !isPublicRoute && typeof window !== "undefined") {
    nav("/login");
    return null;
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (isAuthenticated && isPublicRoute && typeof window !== "undefined") {
    nav("/");
    return null;
  }

  return <Slot />;
});
