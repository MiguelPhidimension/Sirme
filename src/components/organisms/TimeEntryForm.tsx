import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
  QRL,
} from "@builder.io/qwik";
import { ProjectEntryCard } from "../molecules";
import { DataUtils, ValidationUtils, DateUtils } from "~/utils";
import type {
  TimeEntryFormData,
  ProjectEntry,
  EmployeeRole,
  FormErrors,
} from "~/types";
// Import GraphQL hooks and Resource component for role dropdown
import { useRoles } from "~/graphql/hooks/useRoles";
import { Resource } from "@builder.io/qwik";
import {
  useClientProjectOptions,
  type ClientProjectOption,
} from "../../graphql/hooks/useProjects";
import {
  LuClock,
  LuBriefcase,
  LuPlus,
  LuCheck,
  LuLoader2,
  LuAlertCircle,
  LuClipboard,
} from "@qwikest/icons/lucide";

/**
 * Props interface for TimeEntryForm component
 */
interface TimeEntryFormProps {
  mode?: "daily" | "weekly";
  initialData?: Partial<TimeEntryFormData>;
  onSubmit$?: QRL<(data: TimeEntryFormData) => void>;
  onCancel$?: QRL<() => void>;
  isLoading?: boolean;
  simplified?: boolean;
  onTotalHoursChange$?: QRL<(totalHours: number) => void>;
  onAddProjectClick$?: QRL<() => void>;
  showAddProjectInHeader?: boolean;
  showAddProjectSignal?: { value: boolean };
}

/**
 * TimeEntryForm Organism Component
 * Comprehensive form for time entry with project management
 * Supports both daily and weekly entry modes
 * Now uses GraphQL to fetch roles dynamically
 *
 * @example
 * <TimeEntryForm
 *   mode="daily"
 *   onSubmit$={handleSubmit}
 *   onCancel$={handleCancel}
 * />
 */
export const TimeEntryForm = component$<TimeEntryFormProps>(
  ({
    mode = "daily",
    initialData,
    onSubmit$,
    onCancel$,
    isLoading = false,
    simplified = false,
    onTotalHoursChange$,
    onAddProjectClick$,
    showAddProjectSignal,
  }) => {
    // GraphQL hook to fetch roles from database
    const rolesResource = useRoles();
    const clientProjectResource = useClientProjectOptions();

    // Form state
    const formData = useStore<TimeEntryFormData>({
      employeeName: initialData?.employeeName || "",
      date: initialData?.date || DateUtils.getCurrentDate(),
      role: initialData?.role || "Other",
      projects: initialData?.projects || [],
    });

    // UI state
    const editingProjectId = useSignal<string | null>(null);
    const errors = useStore<FormErrors>({});
    const isAddingProject = useSignal(
      simplified &&
        (initialData?.projects?.length === 0 || !initialData?.projects),
    );

    // New project form state
    const newProject = useStore({
      clientId: "",
      clientName: "",
      hours: 0,
      isMPS: false,
      notes: "",
    });

    // Initialize form with current date on component mount
    useVisibleTask$(() => {
      if (!initialData?.date) {
        formData.date = DateUtils.getCurrentDate();
      }

      // Auto-show add project form in simplified mode when no projects exist
      if (simplified && formData.projects.length === 0) {
        isAddingProject.value = true;
      }
    });

    // Watch for add project signal from parent (for header button)
    useVisibleTask$(({ track }) => {
      if (showAddProjectSignal) {
        track(() => showAddProjectSignal.value);
        if (showAddProjectSignal.value) {
          isAddingProject.value = true;
          // Reset the signal in the parent
          showAddProjectSignal.value = false;
        }
      }
    });

    // Validation functions
    const validateForm = $(() => {
      const newErrors: FormErrors = {};

      // Validate employee name
      const nameError = ValidationUtils.validateEmployeeName(
        formData.employeeName,
      );
      if (nameError) newErrors.employeeName = nameError;

      // Validate date
      const dateError = ValidationUtils.validateDate(formData.date);
      if (dateError) newErrors.date = dateError;

      // Validate projects
      if (formData.projects.length === 0) {
        newErrors.projects = "At least one project is required";
      } else {
        // Validate daily total
        const dailyError = ValidationUtils.validateDailyTotal(
          formData.projects,
        );
        if (dailyError) newErrors.dailyTotal = dailyError;

        // Validate individual projects
        formData.projects.forEach((project, index) => {
          const hoursError = ValidationUtils.validateProjectHours(
            project.hours,
          );
          if (hoursError) newErrors[`project_${index}_hours`] = hoursError;

          const clientError = ValidationUtils.validateClientName(
            project.clientName,
          );
          if (clientError) newErrors[`project_${index}_client`] = clientError;
        });
      }

      // Update errors state
      Object.keys(errors).forEach((key) => delete errors[key]);
      Object.assign(errors, newErrors);

      return Object.keys(newErrors).length === 0;
    });

    // Handle form submission
    const handleSubmit = $(async () => {
      const isValid = await validateForm();

      if (isValid && onSubmit$) {
        await onSubmit$(formData);
      }
    });

    // Handle adding a new project
    const handleAddProject = $(() => {
      if (!newProject.clientName.trim() || newProject.hours <= 0) {
        return;
      }

      const project: Omit<ProjectEntry, "id"> = {
        clientId: newProject.clientId,
        clientName: newProject.clientName,
        hours: newProject.hours,
        isMPS: newProject.isMPS,
        notes: newProject.notes,
        role: formData.role,
      };

      // Always append at the end for ascending order (Project 1, 2, 3...)
      formData.projects.push(project);

      // Reset new project form
      newProject.clientId = "";
      newProject.clientName = "";
      newProject.hours = 0;
      newProject.isMPS = false;
      newProject.notes = "";
      isAddingProject.value = false;
    });

    // Handle project editing
    const handleEditProject = $(
      (projectIndex: number, updatedProject: ProjectEntry) => {
        formData.projects[projectIndex] = updatedProject;
        editingProjectId.value = null;
      },
    );

    // Handle project deletion
    const handleDeleteProject = $((projectIndex: number) => {
      formData.projects.splice(projectIndex, 1);
    });

    // Calculate total hours
    const totalHours = DataUtils.calculateTotalHours(formData.projects);

    // Update parent component with total hours changes
    useVisibleTask$(({ track }) => {
      track(() => totalHours);
      if (onTotalHoursChange$) {
        onTotalHoursChange$(totalHours);
      }
    });

    return (
      <div class={simplified ? "space-y-6" : "min-h-screen p-6"}>
        <div class={simplified ? "space-y-6" : "mx-auto max-w-4xl space-y-8"}>
          {/* Modern Header with Gradient - Only show if not simplified */}
          {!simplified && (
            <div class="space-y-4 text-center">
              <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <LuClock class="h-8 w-8 text-white" />
              </div>
              <h1 class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-gray-300">
                {mode === "daily" ? "Daily Time Entry" : "Weekly Time Entry"}
              </h1>
              <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                {mode === "daily"
                  ? "Record your work hours for a specific day with precision and ease"
                  : "Bulk entry for the entire week to streamline your workflow"}
              </p>
            </div>
          )}

          {/* Project Entries - Modern Card Design */}
          {!simplified && formData.projects.length > 0 && (
            <div class="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/80">
              {/* Header section - Only for non-simplified mode */}
              <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <LuBriefcase class="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 class="text-2xl font-bold text-white">
                        Project Entries
                      </h2>
                      <p class="text-sm text-white/80">
                        Add your role and project details below
                      </p>
                    </div>
                  </div>
                  <div class="ml-auto flex items-center space-x-4">
                    <div class="text-right text-white/90">
                      <div class="text-sm opacity-80">Total Hours</div>
                      <div class="text-2xl font-bold">
                        {DataUtils.formatHours(totalHours)}
                      </div>
                    </div>
                    <button
                      class="flex items-center space-x-2 rounded-xl bg-white/20 px-6 py-2 font-semibold text-white transition-all duration-200 hover:bg-white/30 disabled:opacity-50"
                      onClick$={() => {
                        if (onAddProjectClick$) {
                          onAddProjectClick$();
                        } else {
                          isAddingProject.value = true;
                        }
                      }}
                      disabled={isAddingProject.value}
                    >
                      <LuPlus class="h-5 w-5" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                {/* Error display for projects */}
                {errors.projects && (
                  <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div class="flex items-center space-x-2">
                      <LuAlertCircle class="h-5 w-5 text-red-500" />
                      <span class="font-medium text-red-700 dark:text-red-300">
                        {errors.projects}
                      </span>
                    </div>
                  </div>
                )}

                {errors.dailyTotal && (
                  <div class="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    <div class="flex items-center space-x-2">
                      <LuAlertCircle class="h-5 w-5 text-amber-500" />
                      <span class="font-medium text-amber-700 dark:text-amber-300">
                        {errors.dailyTotal}
                      </span>
                    </div>
                  </div>
                )}

                {/* Existing Projects */}
                <div class="space-y-4">
                  {formData.projects.map((project, index) => {
                    const projectWithId = {
                      ...project,
                      id: `project-${index}`,
                    };
                    return (
                      <div
                        key={`project-${index}`}
                        class="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-slate-600 dark:from-slate-700 dark:to-slate-600"
                      >
                        <ProjectEntryCard
                          project={projectWithId}
                          role={formData.role}
                          date={formData.date}
                          isEditing={
                            editingProjectId.value === `project-${index}`
                          }
                          onEdit$={() =>
                            (editingProjectId.value = `project-${index}`)
                          }
                          onSave$={(updatedProject) =>
                            handleEditProject(index, updatedProject)
                          }
                          onDelete$={() => handleDeleteProject(index)}
                          onCancel$={() => (editingProjectId.value = null)}
                        />
                      </div>
                    );
                  })}

                  {formData.projects.length === 0 && !isAddingProject.value && (
                    <div class="py-12 text-center text-gray-500 dark:text-gray-400">
                      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                        <LuClipboard class="h-8 w-8" />
                      </div>
                      <p class="mb-2 text-lg font-semibold">
                        No projects added yet
                      </p>
                      <p class="text-sm">
                        Click "Add Project" to get started with your time entry
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error display for projects - Show directly in simplified mode */}
          {simplified && errors.projects && (
            <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div class="flex items-center space-x-2">
                <LuAlertCircle class="h-5 w-5 text-red-500" />
                <span class="font-medium text-red-700 dark:text-red-300">
                  {errors.projects}
                </span>
              </div>
            </div>
          )}

          {simplified && errors.dailyTotal && (
            <div class="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <div class="flex items-center space-x-2">
                <LuAlertCircle class="h-5 w-5 text-amber-500" />
                <span class="font-medium text-amber-700 dark:text-amber-300">
                  {errors.dailyTotal}
                </span>
              </div>
            </div>
          )}

          {/* Existing Projects - Show directly in simplified mode */}
          {simplified && formData.projects.length > 0 && (
            <div class="mb-6 space-y-4">
              {formData.projects.map((project, index) => {
                const projectWithId = { ...project, id: `project-${index}` };
                return (
                  <div
                    key={`project-${index}`}
                    class="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-slate-600 dark:from-slate-700 dark:to-slate-600"
                  >
                    <ProjectEntryCard
                      project={projectWithId}
                      role={formData.role}
                      date={formData.date}
                      isEditing={editingProjectId.value === `project-${index}`}
                      onEdit$={() =>
                        (editingProjectId.value = `project-${index}`)
                      }
                      onSave$={(updatedProject) =>
                        handleEditProject(index, updatedProject)
                      }
                      onDelete$={() => handleDeleteProject(index)}
                      onCancel$={() => (editingProjectId.value = null)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* New Project Form - Show directly when simplified and no projects */}
          {isAddingProject.value && (
            <div class="overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-slate-500 dark:from-slate-700 dark:to-slate-600">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                <h3 class="flex items-center space-x-2 text-xl font-bold text-white">
                  <LuPlus class="h-6 w-6" />
                  <span>Add New Project</span>
                </h3>
              </div>

              <div class="space-y-6 p-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div class="space-y-2">
                    <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <LuBriefcase class="h-4 w-4" />
                      <span>Employee Role</span>
                    </label>

                    {/* Employee Role Dropdown - Now using GraphQL with improved loading display */}
                    <div class="form-group relative">
                      <Resource
                        value={rolesResource}
                        onPending={() => (
                          <div class="relative">
                            <select
                              id="employeeRole"
                              name="employeeRole"
                              disabled
                              class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                              <option>Loading roles...</option>
                            </select>
                            {/* Loading spinner overlay */}
                            <div class="absolute top-1/2 right-3 -translate-y-1/2 transform">
                              <LuLoader2 class="h-5 w-5 animate-spin text-blue-500" />
                            </div>
                          </div>
                        )}
                        onRejected={(error) => {
                          console.warn(
                            "Failed to load roles from GraphQL, using fallback:",
                            error,
                          );
                          // Fallback to hardcoded roles if GraphQL fails
                          const fallbackRoles = DataUtils.getEmployeeRoles();
                          return (
                            <select
                              id="employeeRole"
                              name="employeeRole"
                              class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              value={formData.role}
                              onChange$={(event) => {
                                formData.role = (
                                  event.target as HTMLSelectElement
                                ).value as EmployeeRole;
                              }}
                            >
                              <option value="">
                                Select Role (Offline Mode)
                              </option>
                              {fallbackRoles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          );
                        }}
                        onResolved={(data) => (
                          <select
                            id="employeeRole"
                            name="employeeRole"
                            class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            value={formData.role}
                            onChange$={(event) => {
                              formData.role = (
                                event.target as HTMLSelectElement
                              ).value as EmployeeRole;
                            }}
                          >
                            <option value="">Select Role</option>
                            {data.roles.map((role) => (
                              <option key={role.role_id} value={role.role_name}>
                                {role.role_name}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </div>

                    {/* Show total roles count for debugging */}
                    <Resource
                      value={rolesResource}
                      onPending={() => (
                        <p class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <LuLoader2 class="h-3 w-3 animate-spin" />
                          <span>Loading roles...</span>
                        </p>
                      )}
                      onResolved={(data) => (
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {data.total} {data.total !== 1 ? "roles" : "role"}{" "}
                          available
                        </p>
                      )}
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Project Name
                    </label>
                    {/* Project Dropdown - Now using GraphQL with improved loading display */}
                    <div class="relative">
                      <Resource
                        value={clientProjectResource}
                        onPending={() => (
                          <div class="relative">
                            <select
                              disabled
                              class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            >
                              <option>Loading projects...</option>
                            </select>
                            {/* Loading spinner overlay */}
                            <div class="absolute top-1/2 right-3 -translate-y-1/2 transform">
                              <LuLoader2 class="h-5 w-5 animate-spin text-blue-500" />
                            </div>
                          </div>
                        )}
                        onRejected={(error) => {
                          console.warn(
                            "Failed to load projects from GraphQL, using fallback:",
                            error,
                          );
                          // Fallback to simple input if GraphQL fails
                          return (
                            <input
                              type="text"
                              class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              placeholder="Enter project name (Offline Mode)"
                              value={newProject.clientName}
                              onInput$={(event) => {
                                newProject.clientName = (
                                  event.target as HTMLInputElement
                                ).value;
                              }}
                            />
                          );
                        }}
                        onResolved={(data) => {
                          // Filter to show only projects, not clients
                          const projects = data.options.filter(
                            (option: ClientProjectOption) =>
                              option.type === "project",
                          );
                          return (
                            <select
                              class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              value={newProject.clientName}
                              onChange$={(event) => {
                                newProject.clientName = (
                                  event.target as HTMLSelectElement
                                ).value;
                              }}
                            >
                              <option value="">Select Project</option>
                              {projects.map((project: ClientProjectOption) => (
                                <option key={project.id} value={project.name}>
                                  {project.name}
                                </option>
                              ))}
                            </select>
                          );
                        }}
                      />
                    </div>

                    {/* Show project count with loading state */}
                    <Resource
                      value={clientProjectResource}
                      onPending={() => (
                        <p class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <LuLoader2 class="h-3 w-3 animate-spin" />
                          <span>Loading projects...</span>
                        </p>
                      )}
                      onResolved={(data) => {
                        const projectCount = data.options.filter(
                          (option: ClientProjectOption) =>
                            option.type === "project",
                        ).length;
                        return (
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {projectCount}{" "}
                            {projectCount !== 1 ? "projects" : "project"}{" "}
                            available
                          </p>
                        );
                      }}
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Hours
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="24"
                      class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter hours"
                      value={newProject.hours.toString()}
                      onInput$={(e) => {
                        newProject.hours =
                          parseFloat((e.target as HTMLInputElement).value) || 0;
                      }}
                    />
                  </div>

                  <div class="flex items-center space-x-3 rounded-xl bg-white/50 p-4 dark:bg-slate-600/50">
                    <input
                      type="checkbox"
                      id="mps-checkbox"
                      class="h-5 w-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      checked={newProject.isMPS}
                      onChange$={(e) => {
                        newProject.isMPS = (
                          e.target as HTMLInputElement
                        ).checked;
                      }}
                    />
                    <label
                      for="mps-checkbox"
                      class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      MuleSoft Professional Services
                    </label>
                  </div>

                  <div class="space-y-2 md:col-span-3">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Notes (Optional)
                    </label>
                    <textarea
                      class="w-full resize-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Add project notes..."
                      rows={3}
                      value={newProject.notes}
                      onInput$={(e) => {
                        newProject.notes = (
                          e.target as HTMLTextAreaElement
                        ).value;
                      }}
                    />
                  </div>
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                    class="rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600"
                    onClick$={() => (isAddingProject.value = false)}
                  >
                    Cancel
                  </button>
                  <button
                    class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-700"
                    onClick$={handleAddProject}
                  >
                    Add Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modern Form Actions */}
          <div
            class={`flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 ${simplified ? "bg-transparent" : "rounded-2xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700/20 dark:bg-slate-800/80"} p-6`}
          >
            <button
              class="rounded-xl border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600"
              onClick$={onCancel$}
              disabled={isLoading}
            >
              Cancel
            </button>

            <div class="flex items-center space-x-6">
              {!simplified && (
                <div class="text-center">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    Total Hours
                  </div>
                  <div class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                    {DataUtils.formatHours(totalHours)}
                  </div>
                </div>
              )}

              <button
                class="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
                onClick$={handleSubmit}
                disabled={formData.projects.length === 0 || isLoading}
              >
                {isLoading && <LuLoader2 class="h-5 w-5 animate-spin" />}
                <LuCheck class="h-5 w-5" />
                <span>
                  {mode === "daily" ? "Save Daily Entry" : "Save Weekly Entry"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
