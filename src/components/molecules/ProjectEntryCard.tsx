import { component$, useSignal, $ } from '@builder.io/qwik';
import { Input, Select, Button, Badge } from '../atoms';
import { DataUtils } from '~/utils';
import type { ProjectEntry, EmployeeRole } from '~/types';

/**
 * Props interface for ProjectEntryCard component
 */
interface ProjectEntryCardProps {
  project: ProjectEntry;
  role?: EmployeeRole;
  date?: string;
  isEditing?: boolean;
  onSave$?: (project: ProjectEntry) => void;
  onDelete$?: (projectId: string) => void;
  onEdit$?: (projectId: string) => void;
  onCancel$?: () => void;
}

/**
 * ProjectEntryCard Molecule Component
 * Displays a single project entry with view/edit modes
 * Combines multiple atoms to create a cohesive project display
 * 
 * @example
 * <ProjectEntryCard 
 *   project={project}
 *   role="Developer"
 *   date="2024-01-15"
 *   isEditing={editMode}
 *   onSave$={handleSave}
 *   onDelete$={handleDelete}
 * />
 */
export const ProjectEntryCard = component$<ProjectEntryCardProps>(({
  project,
  role,
  date,
  isEditing = false,
  onSave$,
  onDelete$,
  onEdit$,
  onCancel$
}) => {
  // Local state for editing
  const editData = useSignal({
    clientName: project.clientName,
    hours: project.hours,
    isMPS: project.isMPS,
    notes: project.notes || ''
  });

  // Handle save action
  const handleSave = $(() => {
    if (onSave$) {
      const updatedProject: ProjectEntry = {
        ...project,
        clientName: editData.value.clientName,
        hours: editData.value.hours,
        isMPS: editData.value.isMPS,
        notes: editData.value.notes
      };
      onSave$(updatedProject);
    }
  });

  // Handle cancel action
  const handleCancel = $(() => {
    // Reset edit data to original values
    editData.value = {
      clientName: project.clientName,
      hours: project.hours,
      isMPS: project.isMPS,
      notes: project.notes || ''
    };
    if (onCancel$) {
      onCancel$();
    }
  });

  // Handle edit action
  const handleEdit = $(() => {
    if (onEdit$) {
      onEdit$(project.id);
    }
  });

  // Handle delete action
  const handleDelete = $(() => {
    if (onDelete$) {
      onDelete$(project.id);
    }
  });

  // Get role color for styling
  const getRoleColor = (roleValue?: EmployeeRole) => {
    if (!roleValue) return 'bg-gray-500';
    return DataUtils.getRoleColor(roleValue);
  };

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isEditing) {
    return (
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border-2 border-blue-200 dark:border-slate-500 shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
          <h3 class="text-xl font-bold text-white flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Project</span>
          </h3>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name Dropdown */}
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Client/Project Name</label>
              <select
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                value={editData.value.clientName}
                onChange$={(e) => {
                  editData.value = {
                    ...editData.value,
                    clientName: (e.target as HTMLSelectElement).value
                  };
                }}
              >
                <option value="">Select client/project</option>
                <option value="client/project 1">client/project 1</option>
                <option value="client/project 2">client/project 2</option>
                <option value="client/project 3">client/project 3</option>
                <option value="client/project 4">client/project 4</option>
                <option value="client/project 5">client/project 5</option>
              </select>
            </div>

            {/* Hours Input */}
            <div class="space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                placeholder="Enter hours"
                value={editData.value.hours.toString()}
                onInput$={(e) => {
                  editData.value = {
                    ...editData.value,
                    hours: parseFloat((e.target as HTMLInputElement).value) || 0
                  };
                }}
              />
            </div>

            {/* MPS Toggle */}
            <div class="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-600/50 rounded-xl">
              <input
                type="checkbox"
                id={`mps-checkbox-${project.id}`}
                class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                checked={editData.value.isMPS}
                onChange$={(e) => {
                  editData.value = {
                    ...editData.value,
                    isMPS: (e.target as HTMLInputElement).checked
                  };
                }}
              />
              <label for={`mps-checkbox-${project.id}`} class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                MuleSoft Professional Services
              </label>
            </div>

            {/* Notes Input */}
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</label>
              <textarea
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 resize-none"
                placeholder="Add project notes..."
                rows={3}
                value={editData.value.notes}
                onInput$={(e) => {
                  editData.value = {
                    ...editData.value,
                    notes: (e.target as HTMLTextAreaElement).value
                  };
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex justify-end space-x-3 mt-6">
            <button
              class="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200"
              onClick$={handleCancel}
            >
              Cancel
            </button>
            <button
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              onClick$={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View mode - Enhanced with role and date display
  return (
    <div class="group relative bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header with role and date */}
      <div class="bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            {role && (
              <div class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor(role)}`}>
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {role}
              </div>
            )}
            
            {date && (
              <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(date)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit$ && (
              <button
                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                onClick$={handleEdit}
                title="Edit project"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {onDelete$ && (
              <button
                class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                onClick$={handleDelete}
                title="Delete project"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div class="px-6 py-5">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            {/* Project name with icon */}
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {project.clientName}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Project Entry</p>
              </div>
            </div>
            
            {/* Hours display with emphasis */}
            <div class="flex items-center space-x-4 mb-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {DataUtils.formatHours(project.hours)}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Hours Logged</p>
                </div>
              </div>
              
              {project.isMPS && (
                <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-semibold">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  MPS
                </div>
              )}
            </div>

            {/* Notes section */}
            {project.notes && (
              <div class="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border-l-4 border-blue-500">
                <div class="flex items-start space-x-2">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {project.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}); 