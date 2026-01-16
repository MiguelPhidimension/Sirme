import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { Button, Input } from "~/components/atoms";
import type { LoginFormData } from "~/types";
import {
  LuAlertCircle,
  LuMail,
  LuEye,
  LuEyeOff,
  LuLock,
  LuArrowRight,
} from "@qwikest/icons/lucide";

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
    const showPassword = useSignal(false);
    const validationErrors = useSignal<{ email?: string; password?: string }>(
      {},
    );

    const validateForm = $(() => {
      const errors: { email?: string; password?: string } = {};

      // Email validation
      if (!email.value) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Invalid email";
      }

      // Password validation
      if (!password.value) {
        errors.password = "Password is required";
      } else if (password.value.length < 6) {
        errors.password = "Password must be at least 6 characters";
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

        <div class="relative rounded-2xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-8 dark:border-slate-700/20 dark:bg-slate-800/70">
          {/* Header */}
          <div class="mb-6 text-center sm:mb-8">
            <h2 class="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl dark:from-white dark:to-slate-300">
              Welcome Back
            </h2>
            <p class="text-sm text-slate-600 sm:text-base dark:text-slate-400">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:mb-6 sm:p-4 dark:border-red-800 dark:bg-red-900/20">
              <div class="flex items-center space-x-2">
                <LuAlertCircle class="h-5 w-5 text-red-500" />
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
                <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                  <LuMail class="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email.value}
                  onInput$={(e) =>
                    (email.value = (e.target as HTMLInputElement).value)
                  }
                  class={`w-full border-2 bg-white px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${
                    validationErrors.value.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                  } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                  required
                />
              </div>
              {validationErrors.value.email && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <LuAlertCircle class="h-4 w-4" />
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
                Password
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                  <LuLock class="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword.value ? "text" : "password"}
                  placeholder="••••••••"
                  value={password.value}
                  onInput$={(e) =>
                    (password.value = (e.target as HTMLInputElement).value)
                  }
                  class={`w-full border-2 bg-white px-4 py-3 pr-12 pl-12 text-slate-900 placeholder:text-slate-400 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${
                    validationErrors.value.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                  } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                  required
                />
                <button
                  type="button"
                  onClick$={() => (showPassword.value = !showPassword.value)}
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={
                    showPassword.value ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.value ? (
                    <LuEyeOff class="h-5 w-5" />
                  ) : (
                    <LuEye class="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.value.password && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <LuAlertCircle class="h-4 w-4" />
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
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                class="font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot your password?
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
                  <span>Logging in...</span>
                </div>
              ) : (
                <div class="flex items-center justify-center space-x-2">
                  <span>Log In</span>
                  <LuArrowRight class="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div class="mt-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <a
                href="/register"
                class="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
