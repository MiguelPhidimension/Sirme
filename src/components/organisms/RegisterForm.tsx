import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
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
                <svg
                  class="h-5 w-5 flex-shrink-0 text-red-500"
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
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
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
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
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
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
                <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
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
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
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
                <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
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
                  <svg
                    class="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {validationErrors.value.role_id && (
                <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
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
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
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
                      <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
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
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
                  <div class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
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
                      <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword.value && (
                  <div class="mt-2">
                    {password.value === confirmPassword.value ? (
                      <p class="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                        <svg
                          class="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="font-medium">Passwords match</span>
                      </p>
                    ) : (
                      <p class="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                        <svg
                          class="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="font-medium">Passwords do not match</span>
                      </p>
                    )}
                  </div>
                )}

                {validationErrors.value.confirm_password && (
                  <p class="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
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
