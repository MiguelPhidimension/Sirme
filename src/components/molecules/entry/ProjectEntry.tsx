import { component$, type QRL } from "@builder.io/qwik";

interface ProjectData {
  clientName: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

interface ProjectEntryProps {
  project: ProjectData;
  index: number;
  canRemove: boolean;
  onRemove$: QRL<() => void>;
  onUpdate$: QRL<
    (field: keyof ProjectData, value: string | number | boolean) => void
  >;
}

/**
 * ProjectEntry - Molecule component for a single project entry
 * Displays all fields for one project (client, hours, MPS, notes)
 */
export const ProjectEntry = component$<ProjectEntryProps>(
  ({ project, index, canRemove, onRemove$, onUpdate$ }) => {
    return (
      <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            Project {index + 1}
          </h3>
          {canRemove && (
            <button
              type="button"
              onClick$={onRemove$}
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
                onUpdate$("clientName", (e.target as HTMLInputElement).value)
              }
              placeholder="Enter client or project name"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                onUpdate$(
                  "hours",
                  parseFloat((e.target as HTMLInputElement).value) || 0,
                )
              }
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div class="flex items-end">
            <label class="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={project.isMPS}
                onChange$={(e) =>
                  onUpdate$("isMPS", (e.target as HTMLInputElement).checked)
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
                onUpdate$("notes", (e.target as HTMLTextAreaElement).value)
              }
              placeholder="Add any additional notes..."
              rows={2}
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    );
  },
);
