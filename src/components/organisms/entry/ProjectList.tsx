import { component$, type QRL, $ } from "@builder.io/qwik";
import { ProjectEntry } from "../../molecules";

interface ProjectData {
  clientName: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

interface ProjectListProps {
  projects: ProjectData[];
  totalHours: number;
  onAddProject$: QRL<() => void>;
  onRemoveProject$: QRL<(index: number) => void>;
  onUpdateProject$: QRL<
    (
      index: number,
      field: keyof ProjectData,
      value: string | number | boolean,
    ) => void
  >;
}

/**
 * ProjectList - Organism component for managing multiple projects
 * Contains the header, total hours display, add button, and list of project entries
 */
export const ProjectList = component$<ProjectListProps>(
  ({
    projects,
    totalHours,
    onAddProject$,
    onRemoveProject$,
    onUpdateProject$,
  }) => {
    return (
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
            onClick$={onAddProject$}
            class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            + Add Project
          </button>
        </div>

        <div class="space-y-4">
          {projects.map((project, index) => (
            <ProjectEntry
              key={index}
              project={project}
              index={index}
              canRemove={projects.length > 1}
              onRemove$={$(() => onRemoveProject$(index))}
              onUpdate$={$(
                (field: keyof ProjectData, value: string | number | boolean) =>
                  onUpdateProject$(index, field, value),
              )}
            />
          ))}
        </div>
      </div>
    );
  },
);
