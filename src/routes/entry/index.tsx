import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * Time entry page component - Simplified version
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const selectedDate = useSignal(new Date().toISOString().split("T")[0]);

  // Form data
  const formData = useStore({
    employeeName: "",
    date: selectedDate.value,
    role: "Other" as const,
    projects: [
      {
        clientName: "",
        hours: 0,
        isMPS: false,
        notes: "",
      },
    ],
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    isLoading.value = true;
    try {
      console.log("Submitting time entry:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to submit time entry:", error);
    } finally {
      isLoading.value = false;
    }
  });

  // Handle cancel
  const handleCancel = $(() => {
    window.location.href = "/";
  });

  // Add project
  const addProject = $(() => {
    formData.projects.push({
      clientName: "",
      hours: 0,
      isMPS: false,
      notes: "",
    });
  });

  // Remove project
  const removeProject = $((index: number) => {
    formData.projects.splice(index, 1);
  });

  // Calculate total hours
  const totalHours = formData.projects.reduce(
    (sum, project) => sum + (Number(project.hours) || 0),
    0
  );

  return (
    <div class="min-h-full p-6">
      {/* Page Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Time Entry
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Record your work hours for the day
        </p>
      </div>

      <div class="mx-auto max-w-4xl space-y-6">
        {/* Date Selection Card */}
        <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-4 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <svg
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Select Date
            </h2>
          </div>
          <input
            type="date"
            value={selectedDate.value}
            onInput$={(e) => {
              selectedDate.value = (e.target as HTMLInputElement).value;
              formData.date = selectedDate.value;
            }}
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Employee Info Card */}
        <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-4 flex items-center space-x-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <svg
                class="h-5 w-5 text-purple-600 dark:text-purple-400"
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
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Employee Information
            </h2>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee Name
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onInput$={(e) =>
                  (formData.employeeName = (e.target as HTMLInputElement).value)
                }
                placeholder="Enter your name"
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange$={(e) =>
                  (formData.role = (e.target as HTMLSelectElement)
                    .value as any)
                }
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="MuleSoft Developer">MuleSoft Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Card */}
        <div class="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/90">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <svg
                  class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  Project Entries
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Total: {totalHours.toFixed(1)}h
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick$={addProject}
              class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              + Add Project
            </button>
          </div>

          <div class="space-y-4">
            {formData.projects.map((project, index) => (
              <div
                key={index}
                class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-slate-700 dark:bg-slate-700/50"
              >
                <div class="mb-3 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Project {index + 1}
                  </h3>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick$={() => removeProject(index)}
                      class="text-sm text-red-600 transition-colors duration-200 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div class="md:col-span-2">
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Client/Project Name
                    </label>
                    <input
                      type="text"
                      value={project.clientName}
                      onInput$={(e) =>
                        (project.clientName = (
                          e.target as HTMLInputElement
                        ).value)
                      }
                      placeholder="Enter client or project name"
                      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={project.hours}
                      onInput$={(e) =>
                        (project.hours = parseFloat(
                          (e.target as HTMLInputElement).value
                        ) || 0)
                      }
                      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div class="flex items-end">
                    <label class="flex cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={project.isMPS}
                        onChange$={(e) =>
                          (project.isMPS = (e.target as HTMLInputElement)
                            .checked)
                        }
                        class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        MPS Project
                      </span>
                    </label>
                  </div>

                  <div class="md:col-span-2">
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={project.notes}
                      onInput$={(e) =>
                        (project.notes = (e.target as HTMLTextAreaElement).value)
                      }
                      placeholder="Add any additional notes..."
                      rows={2}
                      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div class="flex items-center justify-between">
          <button
            type="button"
            onClick$={handleCancel}
            class="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={isLoading.value || !formData.employeeName || totalHours === 0}
            class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading.value ? "Saving..." : "Save Time Entry"}
          </button>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Time Entry - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Add or edit time tracking entries for projects and tasks",
    },
  ],
};
