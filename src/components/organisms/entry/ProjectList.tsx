import { component$, type QRL, $ } from "@builder.io/qwik";
import { LuFileText } from "@qwikest/icons/lucide";
import { ProjectEntry } from "../../molecules";

interface ProjectData {
  clientName: string;
  projectId?: string;
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
              <LuFileText class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
