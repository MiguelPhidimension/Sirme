import { component$, useSignal, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { Input, Select, Button } from '../atoms';
import { ProjectEntryCard } from '../molecules';
import { DataUtils, ValidationUtils, DateUtils } from '~/utils';
import type { TimeEntryFormData, ProjectEntry, EmployeeRole, FormErrors } from '~/types';
// Import GraphQL hooks and Resource component for role dropdown
import { useRoles } from '~/graphql/hooks/useRoles';
import { Resource } from '@builder.io/qwik';
import { useClientProjectOptions, type ClientProjectOption } from '../../graphql/hooks/useProjects';

/**
 * Props interface for TimeEntryForm component
 */
interface TimeEntryFormProps {
  mode?: 'daily' | 'weekly';
  initialData?: Partial<TimeEntryFormData>;
  onSubmit$?: (data: TimeEntryFormData) => void;
  onCancel$?: () => void;
  isLoading?: boolean;
  simplified?: boolean;
  onTotalHoursChange$?: (totalHours: number) => void;
  onAddProjectClick$?: () => void;
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
export const TimeEntryForm = component$<TimeEntryFormProps>(({
  mode = 'daily',
  initialData,
  onSubmit$,
  onCancel$,
  isLoading = false,
  simplified = false,
  onTotalHoursChange$,
  onAddProjectClick$,
  showAddProjectInHeader = false,
  showAddProjectSignal
}) => {
  // GraphQL hook to fetch roles from database
  const rolesResource = useRoles();
  const clientProjectResource = useClientProjectOptions();
  
  // Form state
  const formData = useStore<TimeEntryFormData>({
    employeeName: initialData?.employeeName || '',
    date: initialData?.date || DateUtils.getCurrentDate(),
    role: initialData?.role || 'Other',
    projects: initialData?.projects || []
  });

  // UI state
  const editingProjectId = useSignal<string | null>(null);
  const errors = useStore<FormErrors>({});
  const isAddingProject = useSignal(simplified && (initialData?.projects?.length === 0 || !initialData?.projects));

  // New project form state
  const newProject = useStore({
    clientName: '',
    hours: 0,
    isMPS: false,
    notes: ''
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
    const nameError = ValidationUtils.validateEmployeeName(formData.employeeName);
    if (nameError) newErrors.employeeName = nameError;

    // Validate date
    const dateError = ValidationUtils.validateDate(formData.date);
    if (dateError) newErrors.date = dateError;

    // Validate projects
    if (formData.projects.length === 0) {
      newErrors.projects = 'At least one project is required';
    } else {
      // Validate daily total
      const dailyError = ValidationUtils.validateDailyTotal(formData.projects);
      if (dailyError) newErrors.dailyTotal = dailyError;

      // Validate individual projects
      formData.projects.forEach((project, index) => {
        const hoursError = ValidationUtils.validateProjectHours(project.hours);
        if (hoursError) newErrors[`project_${index}_hours`] = hoursError;

        const clientError = ValidationUtils.validateClientName(project.clientName);
        if (clientError) newErrors[`project_${index}_client`] = clientError;
      });
    }

    // Update errors state
    Object.keys(errors).forEach(key => delete errors[key]);
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

    const project: Omit<ProjectEntry, 'id'> = {
      clientName: newProject.clientName,
      hours: newProject.hours,
      isMPS: newProject.isMPS,
      notes: newProject.notes
    };

    formData.projects.push(project);

    // Reset new project form
    newProject.clientName = '';
    newProject.hours = 0;
    newProject.isMPS = false;
    newProject.notes = '';
    isAddingProject.value = false;
  });

  // Handle project editing
  const handleEditProject = $((projectIndex: number, updatedProject: ProjectEntry) => {
    formData.projects[projectIndex] = updatedProject;
    editingProjectId.value = null;
  });

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
      <div class={simplified ? "space-y-6" : "max-w-4xl mx-auto space-y-8"}>
        {/* Modern Header with Gradient - Only show if not simplified */}
        {!simplified && (
          <div class="text-center space-y-4">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {mode === 'daily' ? 'Daily Time Entry' : 'Weekly Time Entry'}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {mode === 'daily' 
                ? 'Record your work hours for a specific day with precision and ease'
                : 'Bulk entry for the entire week to streamline your workflow'
              }
            </p>
          </div>
        )}

        {/* Project Entries - Modern Card Design */}
        {!simplified && formData.projects.length > 0 && (
          <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
            {/* Header section - Only for non-simplified mode */}
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-white">Project Entries</h2>
                    <p class="text-white/80 text-sm">Add your role and project details below</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4 ml-auto">
                  <div class="text-white/90 text-right">
                    <div class="text-sm opacity-80">Total Hours</div>
                    <div class="text-2xl font-bold">{DataUtils.formatHours(totalHours)}</div>
                  </div>
                  <button
                    class="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                    onClick$={() => {
                      if (onAddProjectClick$) {
                        onAddProjectClick$();
                      } else {
                        isAddingProject.value = true;
                      }
                    }}
                    disabled={isAddingProject.value}
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Project</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              {/* Error display for projects */}
              {errors.projects && (
                <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-red-700 dark:text-red-300 font-medium">{errors.projects}</span>
                  </div>
                </div>
              )}

              {errors.dailyTotal && (
                <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-amber-700 dark:text-amber-300 font-medium">{errors.dailyTotal}</span>
                  </div>
                </div>
              )}

              {/* Existing Projects */}
              <div class="space-y-4">
                {formData.projects.map((project, index) => {
                  const projectWithId = { ...project, id: `project-${index}` };
                  return (
                    <div key={`project-${index}`} class="bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-200">
                      <ProjectEntryCard
                        project={projectWithId}
                        role={formData.role}
                        date={formData.date}
                        isEditing={editingProjectId.value === `project-${index}`}
                        onEdit$={() => editingProjectId.value = `project-${index}`}
                        onSave$={(updatedProject) => handleEditProject(index, updatedProject)}
                        onDelete$={() => handleDeleteProject(index)}
                        onCancel$={() => editingProjectId.value = null}
                      />
                    </div>
                  );
                })}

                {formData.projects.length === 0 && !isAddingProject.value && (
                  <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p class="text-lg font-semibold mb-2">No projects added yet</p>
                    <p class="text-sm">Click "Add Project" to get started with your time entry</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error display for projects - Show directly in simplified mode */}
        {simplified && errors.projects && (
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-700 dark:text-red-300 font-medium">{errors.projects}</span>
            </div>
          </div>
        )}

        {simplified && errors.dailyTotal && (
          <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-amber-700 dark:text-amber-300 font-medium">{errors.dailyTotal}</span>
            </div>
          </div>
        )}

        {/* Existing Projects - Show directly in simplified mode */}
        {simplified && formData.projects.length > 0 && (
          <div class="space-y-4 mb-6">
            {formData.projects.map((project, index) => {
              const projectWithId = { ...project, id: `project-${index}` };
              return (
                <div key={`project-${index}`} class="bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-200">
                  <ProjectEntryCard
                    project={projectWithId}
                    role={formData.role}
                    date={formData.date}
                    isEditing={editingProjectId.value === `project-${index}`}
                    onEdit$={() => editingProjectId.value = `project-${index}`}
                    onSave$={(updatedProject) => handleEditProject(index, updatedProject)}
                    onDelete$={() => handleDeleteProject(index)}
                    onCancel$={() => editingProjectId.value = null}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* New Project Form - Show directly when simplified and no projects */}
        {isAddingProject.value && (
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border-2 border-blue-200 dark:border-slate-500 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <h3 class="text-xl font-bold text-white flex items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Project</span>
              </h3>
            </div>
            
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8" />
                    </svg>
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
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          >
                            <option>Loading roles...</option>
                          </select>
                          {/* Loading spinner overlay */}
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      onRejected={(error) => {
                        console.warn('Failed to load roles from GraphQL, using fallback:', error);
                        // Fallback to hardcoded roles if GraphQL fails
                        const fallbackRoles = DataUtils.getEmployeeRoles();
                        return (
                          <select 
                            id="employeeRole" 
                            name="employeeRole"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                            value={formData.role}
                            onChange$={(event) => {
                              formData.role = (event.target as HTMLSelectElement).value as EmployeeRole;
                            }}
                          >
                            <option value="">Select Role (Offline Mode)</option>
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
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          value={formData.role}
                          onChange$={(event) => {
                            formData.role = (event.target as HTMLSelectElement).value as EmployeeRole;
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
                  {/* <Resource
                    value={rolesResource}
                    onPending={() => (
                      <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading roles...</span>
                      </p>
                    )}
                    onResolved={(data) => (
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {data.total} {data.total !== 1 ? 'roles' : 'role'} available
                      </p>
                    )}
                  /> */}
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Name</label>
                  {/* Project Dropdown - Now using GraphQL with improved loading display */}
                  <div class="relative">
                    <Resource
                      value={clientProjectResource}
                      onPending={() => (
                        <div class="relative">
                          <select disabled class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                            <option>Loading projects...</option>
                          </select>
                          {/* Loading spinner overlay */}
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      onRejected={(error) => {
                        console.warn('Failed to load projects from GraphQL, using fallback:', error);
                        // Fallback to simple input if GraphQL fails
                        return (
                          <input
                            type="text"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                            placeholder="Enter project name (Offline Mode)"
                            value={newProject.clientName}
                            onInput$={(event) => {
                              newProject.clientName = (event.target as HTMLInputElement).value;
                            }}
                          />
                        );
                      }}
                      onResolved={(data) => {
                        // Filter to show only projects, not clients
                        const projects = data.options.filter((option: ClientProjectOption) => option.type === 'project');
                        return (
                          <select 
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                            value={newProject.clientName}
                            onChange$={(event) => {
                              newProject.clientName = (event.target as HTMLSelectElement).value;
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
                  {/* <Resource
                    value={clientProjectResource}
                    onPending={() => (
                      <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading projects...</span>
                      </p>
                    )}
                    onResolved={(data) => {
                      const projectCount = data.options.filter((option: ClientProjectOption) => option.type === 'project').length;
                      return (
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {projectCount} {projectCount !== 1 ? 'projects' : 'project'} available
                        </p>
                      );
                    }}
                  /> */}
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter hours"
                    value={newProject.hours.toString()}
                    onInput$={(e) => {
                      newProject.hours = parseFloat((e.target as HTMLInputElement).value) || 0;
                    }}
                  />
                </div>

                <div class="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-600/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="mps-checkbox"
                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={newProject.isMPS}
                    onChange$={(e) => {
                      newProject.isMPS = (e.target as HTMLInputElement).checked;
                    }}
                  />
                  <label for="mps-checkbox" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    MuleSoft Professional Services
                  </label>
                </div>

                <div class="md:col-span-3 space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                  <textarea
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 resize-none"
                    placeholder="Add project notes..."
                    rows={3}
                    value={newProject.notes}
                    onInput$={(e) => {
                      newProject.notes = (e.target as HTMLTextAreaElement).value;
                    }}
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  class="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200"
                  onClick$={() => isAddingProject.value = false}
                >
                  Cancel
                </button>
                <button
                  class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  onClick$={handleAddProject}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Form Actions */}
        <div class={`flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${simplified ? 'bg-transparent' : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20'} p-6`}>
          <button
            class="px-8 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
            onClick$={onCancel$}
            disabled={isLoading}
          >
            Cancel
          </button>

          <div class="flex items-center space-x-6">
            {!simplified && (
              <div class="text-center">
                <div class="text-sm text-gray-500 dark:text-gray-400">Total Hours</div>
                <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {DataUtils.formatHours(totalHours)}
                </div>
              </div>
            )}

            <button
              class="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
              onClick$={handleSubmit}
              disabled={formData.projects.length === 0 || isLoading}
            >
              {isLoading && (
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{mode === 'daily' ? 'Save Daily Entry' : 'Save Weekly Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}); 