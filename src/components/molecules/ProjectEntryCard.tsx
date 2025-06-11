import { component$, useSignal, $ } from '@builder.io/qwik';
import { Input, Select, Button, Badge } from '../atoms';
import { DataUtils } from '~/utils';
import type { ProjectEntry, EmployeeRole } from '~/types';

/**
 * Props interface for ProjectEntryCard component
 */
interface ProjectEntryCardProps {
  project: ProjectEntry;
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
 *   isEditing={editMode}
 *   onSave$={handleSave}
 *   onDelete$={handleDelete}
 * />
 */
export const ProjectEntryCard = component$<ProjectEntryCardProps>(({
  project,
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
    onCancel$ && onCancel$();
  });

  if (isEditing) {
    return (
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Name Input */}
            <Input
              label="Client Name"
              placeholder="Enter client name"
              value={editData.value.clientName}
              onInput$={(e) => {
                editData.value = {
                  ...editData.value,
                  clientName: (e.target as HTMLInputElement).value
                };
              }}
            />

            {/* Hours Input */}
            <Input
              label="Hours"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              placeholder="Enter hours"
              value={editData.value.hours.toString()}
              onInput$={(e) => {
                editData.value = {
                  ...editData.value,
                  hours: parseFloat((e.target as HTMLInputElement).value) || 0
                };
              }}
            />

            {/* MPS Toggle */}
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  checked={editData.value.isMPS}
                  onChange$={(e) => {
                    editData.value = {
                      ...editData.value,
                      isMPS: (e.target as HTMLInputElement).checked
                    };
                  }}
                />
                <span class="label-text">MuleSoft Professional Services</span>
              </label>
            </div>

            {/* Notes Input */}
            <div class="md:col-span-2">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Notes (Optional)</span>
                </label>
                <textarea
                  class="textarea textarea-bordered w-full"
                  placeholder="Add project notes..."
                  rows={2}
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
          </div>

          {/* Action Buttons */}
          <div class="card-actions justify-end mt-4 gap-2">
            <Button variant="ghost" size="sm" onClick$={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick$={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <div class="card-body p-4">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-base-content">
              {project.clientName}
            </h3>
            
            <div class="flex items-center gap-2 mt-2">
              <span class="text-2xl font-bold text-primary">
                {DataUtils.formatHours(project.hours)}
              </span>
              
              {project.isMPS && (
                <Badge variant="success" size="sm">
                  MPS
                </Badge>
              )}
            </div>

            {project.notes && (
              <p class="text-sm text-base-content/70 mt-2">
                {project.notes}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div class="flex gap-1">
            {onEdit$ && (
              <Button 
                variant="ghost" 
                size="sm" 
                square
                onClick$={() => onEdit$(project.id)}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            )}
            
            {onDelete$ && (
              <Button 
                variant="ghost" 
                size="sm" 
                square
                onClick$={() => onDelete$(project.id)}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}); 