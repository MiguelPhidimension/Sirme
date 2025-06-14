import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Button, Card } from '../atoms';
import { ProjectEntryCard, GlassCard } from '../molecules';
import { DataUtils, ValidationUtils, DateUtils } from '~/utils';
import type { TimeEntryFormData, ProjectEntry, EmployeeRole, FormErrors } from '~/types';
// Import GraphQL hooks for role dropdown
import { useRoles } from '~/graphql/hooks/useRoles';
import { useClientProjectOptions, type ClientProjectOption } from '../../graphql/hooks/useProjects';

/**
 * Props interface for TimeEntryForm component
 */
interface TimeEntryFormProps {
  mode?: 'daily' | 'weekly';
  initialData?: Partial<TimeEntryFormData>;
  onSubmit?: (data: TimeEntryFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  simplified?: boolean;
  onTotalHoursChange?: (totalHours: number) => void;
  onAddProjectClick?: () => void;
  showAddProjectInHeader?: boolean;
  showAddProjectSignal?: { value: boolean };
  showAddProject?: boolean;
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
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  mode = 'daily',
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  simplified = false,
  onTotalHoursChange,
  onAddProjectClick,
  showAddProjectInHeader = false,
  showAddProjectSignal,
  showAddProject
}) => {
  // GraphQL hooks to fetch roles and projects from database
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useRoles();
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useClientProjectOptions();
  
  // Form state
  const [formData, setFormData] = useState<TimeEntryFormData>({
    employeeName: initialData?.employeeName || '',
    date: initialData?.date || DateUtils.getCurrentDate(),
    role: initialData?.role || 'Other',
    projects: initialData?.projects || []
  });

  // UI state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAddingProject, setIsAddingProject] = useState(simplified && (initialData?.projects?.length === 0 || !initialData?.projects));

  // New project form state
  const [newProject, setNewProject] = useState({
    clientName: '',
    projectName: '',
    hours: 0,
    isMPS: false,
    notes: ''
  });

  // Initialize form with current date on component mount
  useEffect(() => {
    if (!initialData?.date) {
      setFormData(prev => ({ ...prev, date: DateUtils.getCurrentDate() }));
    }
    
    // Auto-show add project form in simplified mode when no projects exist
    if (simplified && formData.projects.length === 0) {
      setIsAddingProject(true);
    }
  }, [initialData?.date, simplified, formData.projects.length]);

  // Watch for add project signal from parent (for header button)
  useEffect(() => {
    if (showAddProjectSignal?.value) {
      setIsAddingProject(true);
      // Reset the signal in the parent
      showAddProjectSignal.value = false;
    }
  }, [showAddProjectSignal?.value]);

  // Validation functions
  const validateForm = useCallback(() => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      await onSubmit(formData);
    }
  }, [validateForm, onSubmit, formData]);

  // Handle adding a new project
  const handleAddProject = useCallback(() => {
    if (!newProject.clientName.trim() || newProject.hours <= 0) {
      return;
    }

    const project: Omit<ProjectEntry, 'id'> = {
      clientName: newProject.clientName,
      projectName: newProject.projectName || 'Unknown Project',
      hours: newProject.hours,
      isMPS: newProject.isMPS,
      notes: newProject.notes,
    };

    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));

    // Reset new project form
    setNewProject({
      clientName: '',
      projectName: '',
      hours: 0,
      isMPS: false,
      notes: ''
    });
    setIsAddingProject(false);
  }, [newProject]);

  // Handle project editing
  const handleEditProject = useCallback((projectIndex: number, updatedProject: ProjectEntry) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, index) => 
        index === projectIndex ? updatedProject : project
      )
    }));
    setEditingProjectId(null);
  }, []);

  // Handle project deletion
  const handleDeleteProject = useCallback((projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, index) => index !== projectIndex)
    }));
  }, []);

  // Calculate total hours
  const totalHours = DataUtils.calculateTotalHours(formData.projects);

  // Update parent component with total hours changes
  useEffect(() => {
    if (onTotalHoursChange) {
      onTotalHoursChange(totalHours);
    }
  }, [totalHours, onTotalHoursChange]);

  // Render role dropdown with loading/error states
  const renderRoleDropdown = () => {
    if (rolesLoading) {
      return (
        <div className="relative">
          <select 
            id="employeeRole" 
            name="employeeRole" 
            disabled
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option>Loading roles...</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      );
    }

    if (rolesError) {
      console.warn('Failed to load roles from GraphQL, using fallback:', rolesError);
      const fallbackRoles = DataUtils.getEmployeeRoles();
      return (
        <select 
          id="employeeRole" 
          name="employeeRole"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
          value={formData.role}
          onChange={(event) => {
            setFormData(prev => ({ ...prev, role: event.target.value as EmployeeRole }));
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
    }

    return (
      <select 
        id="employeeRole" 
        name="employeeRole"
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
        value={formData.role}
        onChange={(event) => {
          setFormData(prev => ({ ...prev, role: event.target.value as EmployeeRole }));
        }}
      >
        <option value="">Select Role</option>
        {rolesData?.roles.map((role: any) => (
          <option key={role.role_id} value={role.role_name}>
            {role.role_name}
          </option>
        ))}
      </select>
    );
  };

  // Render project dropdown with loading/error states
  const renderProjectDropdown = () => {
    if (projectsLoading) {
      return (
        <div className="relative">
          <select disabled className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
            <option>Loading projects...</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      );
    }

    if (projectsError) {
      console.warn('Failed to load projects from GraphQL, using fallback:', projectsError);
      return (
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
          placeholder="Enter project name (Offline Mode)"
          value={newProject.projectName}
          onChange={(event) => {
            setNewProject(prev => ({ 
              ...prev, 
              projectName: event.target.value,
              clientName: event.target.value // Set both for compatibility
            }));
          }}
        />
      );
    }

    // Filter to show only projects, not clients
    const projects = projectsData?.options.filter((option: ClientProjectOption) => option.type === 'project') || [];
    return (
      <select 
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
        value={newProject.projectName}
        onChange={(event) => {
          const selectedProject = projects.find((p: ClientProjectOption) => p.name === event.target.value);
          setNewProject(prev => ({ 
            ...prev, 
            projectName: event.target.value,
            clientName: selectedProject?.client_name || event.target.value // Set client name from project data
          }));
        }}
      >
        <option value="">Select Project</option>
        {projects.map((project: ClientProjectOption) => (
          <option key={project.id} value={project.name}>
            {project.name} {project.client_name ? `(${project.client_name})` : ''}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={simplified ? "space-y-6" : "min-h-screen p-6"}>
      <div className={simplified ? "space-y-6" : "max-w-4xl mx-auto space-y-8"}>
        {/* Modern Header with Gradient - Only show if not simplified */}
        {!simplified && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {mode === 'daily' ? 'Daily Time Entry' : 'Weekly Time Entry'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {mode === 'daily' 
                ? 'Record your work hours for a specific day with precision and ease'
                : 'Bulk entry for the entire week to streamline your workflow'
              }
            </p>
          </div>
        )}

        {/* Project Entries - Modern Card Design */}
        {!simplified && formData.projects.length > 0 && (
          <GlassCard
            title="Project Entries"
            subtitle="Add your role and project details below"
            icon={
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            }
            headerActions={
              <div className="flex items-center space-x-4 ml-auto">
                <div className="text-white/90 text-right">
                  <div className="text-sm opacity-80">Total Hours</div>
                  <div className="text-2xl font-bold">{DataUtils.formatHours(totalHours)}</div>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  onClick={() => {
                    if (onAddProjectClick) {
                      onAddProjectClick();
                    } else {
                      setIsAddingProject(true);
                    }
                  }}
                  disabled={isAddingProject}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Project</span>
                </button>
              </div>
            }
            headerClassName="bg-gradient-to-r from-emerald-500 to-teal-600 p-6"
            titleClassName="text-2xl font-bold text-white"
            subtitleClassName="text-white/80 text-sm"
            showHeaderBorder={false}
          >
            <div className="p-6">
              {/* Error display for projects */}
              {errors.projects && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 dark:text-red-300 font-medium">{errors.projects}</span>
                  </div>
                </div>
              )}

              {errors.dailyTotal && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-amber-700 dark:text-amber-300 font-medium">{errors.dailyTotal}</span>
                  </div>
                </div>
              )}

              {/* Existing Projects */}
              <div className="space-y-4">
                {formData.projects.map((project, index) => {
                  const projectWithId = { ...project, id: `project-${index}` };
                  return (
                    <Card key={`project-${index}`}>
                      <ProjectEntryCard
                        project={projectWithId}
                        role={formData.role}
                        date={formData.date}
                        isEditing={editingProjectId === `project-${index}`}
                        onEdit={() => setEditingProjectId(`project-${index}`)}
                        onSave={(updatedProject) => handleEditProject(index, updatedProject)}
                        onDelete={() => handleDeleteProject(index)}
                        onCancel={() => setEditingProjectId(null)}
                      />
                    </Card>
                  );
                })}

                {formData.projects.length === 0 && !isAddingProject && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold mb-2">No projects added yet</p>
                    <p className="text-sm">Click "Add Project" to get started with your time entry</p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Error display for projects - Show directly in simplified mode */}
        {simplified && errors.projects && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 dark:text-red-300 font-medium">{errors.projects}</span>
            </div>
          </div>
        )}

        {simplified && errors.dailyTotal && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-700 dark:text-amber-300 font-medium">{errors.dailyTotal}</span>
            </div>
          </div>
        )}

        {/* Existing Projects - Show directly in simplified mode */}
        {simplified && formData.projects.length > 0 && (
          <div className="space-y-4 mb-6">
            {formData.projects.map((project, index) => {
              const projectWithId = { ...project, id: `project-${index}` };
              return (
                <Card key={`project-${index}`}>
                  <ProjectEntryCard
                    project={projectWithId}
                    role={formData.role}
                    date={formData.date}
                    isEditing={editingProjectId === `project-${index}`}
                    onEdit={() => setEditingProjectId(`project-${index}`)}
                    onSave={(updatedProject) => handleEditProject(index, updatedProject)}
                    onDelete={() => handleDeleteProject(index)}
                    onCancel={() => setEditingProjectId(null)}
                  />
                </Card>
              );
            })}
          </div>
        )}

        {/* New Project Form - Show directly when simplified and no projects */}
        {isAddingProject && (
          <GlassCard
            title="Add New Project"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
            showHeaderBorder={true}
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8" />
                    </svg>
                    <span>Employee Role</span>
                  </label>
                  
                  {/* Employee Role Dropdown - Now using GraphQL with improved loading display */}
                  <div className="form-group relative">
                    {renderRoleDropdown()}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Name</label>
                  {/* Project Dropdown - Now using GraphQL with improved loading display */}
                  <div className="relative">
                    {renderProjectDropdown()}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter hours"
                    value={newProject.hours.toString()}
                    onChange={(e) => {
                      setNewProject(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }));
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-600/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="mps-checkbox"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={newProject.isMPS}
                    onChange={(e) => {
                      setNewProject(prev => ({ ...prev, isMPS: e.target.checked }));
                    }}
                  />
                  <label htmlFor="mps-checkbox" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    MuleSoft Professional Services
                  </label>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 resize-none"
                    placeholder="Add project notes..."
                    rows={3}
                    value={newProject.notes}
                    onChange={(e) => {
                      setNewProject(prev => ({ ...prev, notes: e.target.value }));
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200"
                  onClick={() => setIsAddingProject(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  onClick={handleAddProject}
                >
                  Add Project
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Modern Form Actions */}
        <Card className={`${simplified ? 'bg-transparent border-none shadow-none' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
            <button
              className="px-8 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>

            <div className="flex items-center space-x-6">
              {!simplified && (
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Hours</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {DataUtils.formatHours(totalHours)}
                  </div>
                </div>
              )}

              <button
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
                onClick={handleSubmit}
                disabled={formData.projects.length === 0 || isLoading}
              >
                {isLoading && (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{mode === 'daily' ? 'Save Daily Entry' : 'Save Weekly Entry'}</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 