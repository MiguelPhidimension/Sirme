import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import {
  LuAlertCircle,
  LuUser,
  LuMail,
  LuBriefcase,
  LuChevronDown,
  LuLock,
  LuEye,
  LuEyeOff,
  LuCheckCircle2,
  LuXCircle,
  LuUserPlus,
} from "@qwikest/icons/lucide";
import { Button, Input, Select } from "~/components/atoms";
import type { RegisterFormData } from "~/types";

interface RegisterFormProps {
  onSubmit: QRL<(data: RegisterFormData) => Promise<void>>;
  isLoading?: boolean;
  error?: string;
  roles: Array<{ role_id: string; role_name: string }>;
}

/**
 * Register Form Component
 * Handles new user registration
 */
export const RegisterForm = component$<RegisterFormProps>(
  ({ onSubmit, isLoading, error, roles }) => {
    const firstName = useSignal("");
    const lastName = useSignal("");
    const email = useSignal("");
    const password = useSignal("");
    const confirmPassword = useSignal("");
    const roleId = useSignal("");
    const showPassword = useSignal(false);
    const showConfirmPassword = useSignal(false);
    const validationErrors = useSignal<
      Partial<Record<keyof RegisterFormData, string>>
    >({});

    // Password strength calculator
    const getPasswordStrength = (pass: string) => {
      if (!pass) return { score: 0, label: "", color: "", textColor: "" };

      let score = 0;

      // Length criteria
      if (pass.length >= 8) score += 1;
      if (pass.length >= 12) score += 1;

      // Complexity criteria
      if (/[a-z]/.test(pass)) score += 1; // Lowercase
      if (/[A-Z]/.test(pass)) score += 1; // Uppercase
      if (/[0-9]/.test(pass)) score += 1; // Numbers
      if (/[^a-zA-Z0-9]/.test(pass)) score += 1; // Special characters

      // Determine strength level
      if (score <= 2) {
        return {
          score: 1,
          label: "Weak",
          color: "bg-red-500",
          textColor: "text-red-600 dark:text-red-400",
        };
      } else if (score <= 4) {
        return {
          score: 2,
          label: "Medium",
          color: "bg-yellow-500",
          textColor: "text-yellow-600 dark:text-yellow-400",
        };
      } else {
        return {
          score: 3,
          label: "Strong",
          color: "bg-green-500",
          textColor: "text-green-600 dark:text-green-400",
        };
      }
    };

    const validateForm = $(() => {
      const errors: Partial<Record<keyof RegisterFormData, string>> = {};

      // First name validation
      if (!firstName.value) {
        errors.first_name = "First name is required";
      } else if (firstName.value.length < 2) {
        errors.first_name = "First name must be at least 2 characters";
      }

      // Last name validation
      if (!lastName.value) {
        errors.last_name = "Last name is required";
      } else if (lastName.value.length < 2) {
        errors.last_name = "Last name must be at least 2 characters";
      }

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

      // Confirm password validation
      if (!confirmPassword.value) {
        errors.confirm_password = "Confirm your password";
      } else if (password.value !== confirmPassword.value) {
        errors.confirm_password = "Passwords do not match";
      }

      // Role validation
      if (!roleId.value) {
        errors.role_id = "Select a role";
      }

      validationErrors.value = errors;
      return Object.keys(errors).length === 0;
    });

    const handleSubmit = $(async () => {
      const isValid = await validateForm();
      if (!isValid) return;

      await onSubmit({
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        confirm_password: confirmPassword.value,
        role_id: roleId.value,
      });
    });

    return (
      <div class="group relative">
        {/* Glassmorphism card effect */}
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl transition-all duration-300 group-hover:blur-2xl"></div>

        <div class="relative rounded-2xl border border-white/20 bg-white/70 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-8 dark:border-slate-700/20 dark:bg-slate-800/70">
          {/* Header */}
          <div class="mb-6 text-center sm:mb-8">
            <h2 class="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl dark:from-white dark:to-slate-300">
              Create New Account
            </h2>
            <p class="text-sm text-slate-600 sm:text-base dark:text-slate-400">
              Join our team by completing the form
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:mb-6 sm:p-4 dark:border-red-800 dark:bg-red-900/20">
              <div class="flex items-center space-x-2">
                <LuAlertCircle class="h-5 w-5 flex-shrink-0 text-red-500" />
                <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            preventdefault:submit
            onSubmit$={handleSubmit}
            class="space-y-5"
          >
            {/* Name Fields Grid */}
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  for="firstName"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  First Name
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                    <LuUser class="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName.value}
                    onInput$={(e) =>
                      (firstName.value = (e.target as HTMLInputElement).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${
                      validationErrors.value.first_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.first_name && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <LuAlertCircle class="h-4 w-4" />
                    <span>{validationErrors.value.first_name}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  for="lastName"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Last Name
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                    <LuUser class="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName.value}
                    onInput$={(e) =>
                      (lastName.value = (e.target as HTMLInputElement).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${
                      validationErrors.value.last_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                </div>
                {validationErrors.value.last_name && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <LuAlertCircle class="h-4 w-4" />
                    <span>{validationErrors.value.last_name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Corporate Email
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                  <LuMail class="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@company.com"
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

            {/* Role Field */}
            <div>
              <label
                for="role"
                class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Professional Role
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                  <LuBriefcase class="h-5 w-5 text-slate-400" />
                </div>
                <Select
                  id="role"
                  value={roleId.value}
                  onChange$={(e) =>
                    (roleId.value = (e.target as HTMLSelectElement).value)
                  }
                  class={`w-full border-2 bg-white px-4 py-3 pl-12 text-slate-900 dark:bg-slate-700 dark:text-white ${
                    validationErrors.value.role_id
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                  } cursor-pointer appearance-none rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                  required
                >
                  <option value="" class="text-slate-400">
                    Select your role
                  </option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </Select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <LuChevronDown class="h-5 w-5 text-slate-400" />
                </div>
              </div>
              {validationErrors.value.role_id && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <LuAlertCircle class="h-4 w-4" />
                  <span>{validationErrors.value.role_id}</span>
                </p>
              )}
            </div>

            {/* Password Fields Grid */}
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Password */}
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

                {/* Password Strength Indicator */}
                <div class="mt-2 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Password strength:
                    </span>
                    <span
                      class={`text-xs font-semibold ${
                        password.value
                          ? getPasswordStrength(password.value).textColor
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {password.value
                        ? getPasswordStrength(password.value).label
                        : "Not evaluated"}
                    </span>
                  </div>
                  <div class="flex space-x-1">
                    <div
                      class={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        password.value &&
                        getPasswordStrength(password.value).score >= 1
                          ? getPasswordStrength(password.value).color
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    ></div>
                    <div
                      class={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        password.value &&
                        getPasswordStrength(password.value).score >= 2
                          ? getPasswordStrength(password.value).color
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    ></div>
                    <div
                      class={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        password.value &&
                        getPasswordStrength(password.value).score >= 3
                          ? getPasswordStrength(password.value).color
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    ></div>
                  </div>
                  <div class="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <p class="flex items-center space-x-1">
                      <span
                        class={
                          password.value && password.value.length >= 8
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {password.value && password.value.length >= 8
                          ? "✓"
                          : "○"}
                      </span>
                      <span>Minimum 8 characters</span>
                    </p>
                    <p class="flex items-center space-x-1">
                      <span
                        class={
                          password.value &&
                          /[A-Z]/.test(password.value) &&
                          /[a-z]/.test(password.value)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {password.value &&
                        /[A-Z]/.test(password.value) &&
                        /[a-z]/.test(password.value)
                          ? "✓"
                          : "○"}
                      </span>
                      <span>Uppercase and lowercase</span>
                    </p>
                    <p class="flex items-center space-x-1">
                      <span
                        class={
                          password.value && /[0-9]/.test(password.value)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {password.value && /[0-9]/.test(password.value)
                          ? "✓"
                          : "○"}
                      </span>
                      <span>Numbers</span>
                    </p>
                    <p class="flex items-center space-x-1">
                      <span
                        class={
                          password.value && /[^a-zA-Z0-9]/.test(password.value)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {password.value && /[^a-zA-Z0-9]/.test(password.value)
                          ? "✓"
                          : "○"}
                      </span>
                      <span>Special characters (@, #, $, etc.)</span>
                    </p>
                  </div>
                </div>

                {validationErrors.value.password && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <LuAlertCircle class="h-4 w-4" />
                    <span>{validationErrors.value.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  for="confirmPassword"
                  class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-1 flex items-center pl-4">
                    <LuCheckCircle2 class="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword.value ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword.value}
                    onInput$={(e) =>
                      (confirmPassword.value = (
                        e.target as HTMLInputElement
                      ).value)
                    }
                    class={`w-full border-2 bg-white px-4 py-3 pr-12 pl-12 text-slate-900 placeholder:text-slate-400 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${
                      validationErrors.value.confirm_password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    } rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20`}
                    required
                  />
                  <button
                    type="button"
                    onClick$={() =>
                      (showConfirmPassword.value = !showConfirmPassword.value)
                    }
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={
                      showConfirmPassword.value
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword.value ? (
                      <LuEyeOff class="h-5 w-5" />
                    ) : (
                      <LuEye class="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword.value && (
                  <div class="mt-2">
                    {password.value === confirmPassword.value ? (
                      <p class="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                        <LuCheckCircle2 class="h-4 w-4" />
                        <span class="font-medium">Passwords match</span>
                      </p>
                    ) : (
                      <p class="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                        <LuXCircle class="h-4 w-4" />
                        <span class="font-medium">Passwords do not match</span>
                      </p>
                    )}
                  </div>
                )}

                {validationErrors.value.confirm_password && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <LuAlertCircle class="h-4 w-4" />
                    <span>{validationErrors.value.confirm_password}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              class="mt-6 w-full transform rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div class="flex items-center justify-center space-x-2">
                  <div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div class="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <LuUserPlus class="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div class="mt-8 text-center">
            <p class="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <a
                href="/"
                class="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
