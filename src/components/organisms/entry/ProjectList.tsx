import {
  component$,
  type QRL,
  $,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { LuFileText } from "@qwikest/icons/lucide";
import { ProjectEntry } from "../../molecules";

interface ProjectData {
  clientId?: string;
  clientName: string;
  projectId?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
  role?: string;
  isPTO?: boolean;
}

interface ProjectListProps {
  projects: ProjectData[];
  totalHours: number;
  userRole?: string;
  isEditing?: boolean;
  disabled?: boolean;
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
    userRole,
    isEditing = false,
    disabled = false,
    onAddProject$,
    onRemoveProject$,
    onUpdateProject$,
  }) => {
    // State for accordion - track which project is expanded
    const expandedProject = useSignal(
      projects.length > 0 ? projects.length - 1 : -1,
    );

    // When projects change, expand the last one (newly added with push)
    useVisibleTask$(({ track }) => {
      track(() => projects.length);

      if (projects.length > 0) {
        // Always expand the last project (most recently added)
        expandedProject.value = projects.length - 1;
      } else {
        expandedProject.value = -1;
      }
    });

    return (
      <div
        class={`rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 dark:border-slate-700/20 dark:bg-slate-800/90 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
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

        <div class="space-y-2">
          {projects.map((project, index) => (
            <div
              key={index}
              class="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-slate-700 dark:bg-slate-700/50"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick$={$(() => {
                  expandedProject.value =
                    expandedProject.value === index ? -1 : index;
                })}
                class={`w-full px-4 py-4 text-left transition-all duration-300 ${
                  expandedProject.value === index
                    ? "bg-white dark:bg-slate-700"
                    : "bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600/50"
                } border-b border-gray-200 dark:border-slate-600`}
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="font-semibold text-gray-900 dark:text-white">
                      Project {index + 1}
                    </span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {project.clientName && `${project.clientName}`}
                      {project.projectId && ` • ${project.hours}h`}
                    </span>
                  </div>
                  <svg
                    class={`h-5 w-5 text-gray-600 transition-transform duration-200 dark:text-gray-400 ${
                      expandedProject.value === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </button>

              {/* Accordion Content */}
              {expandedProject.value === index && (
                <div class="animate-in fade-in overflow-hidden p-4 duration-300">
                  <ProjectEntry
                    project={project}
                    index={index}
                    userRole={userRole}
                    isEditing={isEditing}
                    canRemove={projects.length > 1}
                    onRemove$={$(() => onRemoveProject$(index))}
                    onUpdate$={$(
                      (
                        field: keyof ProjectData,
                        value: string | number | boolean,
                      ) => onUpdateProject$(index, field, value),
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
