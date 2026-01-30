import {
  component$,
  type QRL,
  Resource,
  useSignal,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  useProjects,
  useClients,
  useCreateClient,
} from "~/graphql/hooks/useProjects";
import { useRoles } from "~/graphql/hooks/useRoles";
import { CreateProjectModal } from "../modals/CreateProjectModal";

interface ProjectData {
  clientId?: string;
  clientName: string;
  projectId?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
  role?: string;
}

interface ProjectEntryProps {
  project: ProjectData;
  index: number;
  userRole?: string;
  canRemove: boolean;
  isEditing?: boolean;
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
  ({
    project,
    index,
    userRole,
    canRemove,
    isEditing = false,
    onRemove$,
    onUpdate$,
  }) => {
    // Add signal to trigger refresh
    const refreshTrigger = useSignal(0);

    // Load clients, projects, and roles from database
    const clientsResource = useClients(refreshTrigger);
    const projectsResource = useProjects(refreshTrigger);
    const rolesResource = useRoles();

    // State for modal
    const showModal = useSignal(false);

    // State for creating new client
    const showCreateClient = useSignal(false);
    const newClientName = useSignal("");
    const isCreatingClient = useSignal(false);

    // Get create client hook
    const createClient = useCreateClient();

    // Handle project created from modal
    const handleProjectCreated = $(
      async (projectId: string, projectName: string, clientId?: string) => {
        console.log("✅ Project created:", projectId, projectName, clientId);

        // Update the form with the new project
        onUpdate$("projectId", projectId);
        onUpdate$("clientName", projectName);
        if (clientId) {
          onUpdate$("clientId", clientId);
        }

        // Refresh projects resource
        refreshTrigger.value++;
      },
    );

    // Handle creating new client
    const handleCreateClient = $(async () => {
      if (!newClientName.value.trim()) {
        console.log("⚠️ Client name is empty");
        return;
      }

      isCreatingClient.value = true;
      try {
        console.log("📝 Creating new client:", newClientName.value);
        const newClient = await createClient({ name: newClientName.value });

        if (newClient) {
          console.log("✅ Client created:", newClient);
          // Update form with new client
          onUpdate$("clientId", newClient.client_id);
          onUpdate$("clientName", newClient.name);

          // Reset create client form
          newClientName.value = "";
          showCreateClient.value = false;

          // Refresh clients list
          refreshTrigger.value++;
        }
      } catch (error) {
        console.error("❌ Error creating client:", error);
      } finally {
        isCreatingClient.value = false;
      }
    });

    // Auto-populate clientId when editing existing project
    useVisibleTask$(async ({ track }) => {
      track(() => project.projectId);

      // If we have a projectId but no clientId, search for the client
      if (project.projectId && !project.clientId) {
        console.log("🔍 Searching for client of project:", project.projectId);
        // The client will be populated when projectsResource loads
      }
    });

    return (
      <>
        {/* Modal for creating new project */}
        <CreateProjectModal
          isOpen={showModal.value}
          onClose$={$(() => {
            showModal.value = false;
          })}
          onProjectCreated$={handleProjectCreated}
          preselectedClientId={project.clientId}
          refreshTrigger={refreshTrigger}
        />

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
            {/* Client Selection */}
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client
              </label>
              {!showCreateClient.value ? (
                <Resource
                  value={clientsResource}
                  onPending={() => (
                    <select
                      disabled
                      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option>Loading clients...</option>
                    </select>
                  )}
                  onRejected={(error) => (
                    <div class="text-sm text-red-600 dark:text-red-400">
                      Error loading clients: {error.message}
                    </div>
                  )}
                  onResolved={(clientsData) => {
                    console.log(
                      "👥 ProjectEntry: Clients loaded:",
                      clientsData,
                    );
                    return (
                      <select
                        value={project.clientId || ""}
                        onChange$={(e) => {
                          const selectedClientId = (
                            e.target as HTMLSelectElement
                          ).value;

                          if (selectedClientId === "__new__") {
                            showCreateClient.value = true;
                            return;
                          }

                          const selectedClient = clientsData.clients.find(
                            (c) => c.client_id === selectedClientId,
                          );

                          if (selectedClient) {
                            onUpdate$("clientId", selectedClientId);
                            onUpdate$("clientName", selectedClient.name);
                            // Clear project selection when client changes
                            onUpdate$("projectId", "");
                          }
                        }}
                        class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="">Select a client...</option>
                        <option
                          value="__new__"
                          class="font-semibold text-blue-600"
                        >
                          + Create New Client
                        </option>
                        {clientsData.clients &&
                        clientsData.clients.length > 0 ? (
                          clientsData.clients.map((client) => (
                            <option
                              key={client.client_id}
                              value={client.client_id}
                            >
                              {client.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No clients found</option>
                        )}
                      </select>
                    );
                  }}
                />
              ) : (
                <div class="flex gap-2">
                  <input
                    type="text"
                    value={newClientName.value}
                    onInput$={(e) => {
                      newClientName.value = (
                        e.target as HTMLInputElement
                      ).value;
                    }}
                    placeholder="Enter client name..."
                    class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick$={handleCreateClient}
                    disabled={
                      isCreatingClient.value || !newClientName.value.trim()
                    }
                    class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreatingClient.value ? "Saving..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick$={$(() => {
                      showCreateClient.value = false;
                      newClientName.value = "";
                    })}
                    disabled={isCreatingClient.value}
                    class="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Project Selection */}
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client/Project Name
              </label>
              <Resource
                value={projectsResource}
                onPending={() => (
                  <select
                    disabled
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>Loading projects...</option>
                  </select>
                )}
                onRejected={(error) => (
                  <div class="text-sm text-red-600 dark:text-red-400">
                    Error loading projects: {error.message}
                  </div>
                )}
                onResolved={(data) => {
                  console.log("📋 ProjectEntry: Projects loaded:", data);

                  // If we have a projectId but no clientId, find and set the client
                  if (project.projectId && !project.clientId) {
                    const foundProject = data.projects.find(
                      (p) => p.project_id === project.projectId,
                    );
                    if (foundProject && foundProject.client_id) {
                      console.log(
                        "📌 Auto-setting clientId from existing project:",
                        foundProject.client_id,
                      );
                      onUpdate$("clientId", foundProject.client_id);
                    }
                  }

                  // Filter projects by selected client
                  const filteredProjects = project.clientId
                    ? data.projects.filter(
                        (p) => p.client_id === project.clientId,
                      )
                    : data.projects;

                  return (
                    <div>
                      <select
                        value={project.projectId || ""}
                        disabled={!isEditing && !project.clientId}
                        onChange$={(e) => {
                          const selectedId = (e.target as HTMLSelectElement)
                            .value;

                          if (selectedId === "__new__") {
                            showModal.value = true;
                            return;
                          }

                          const selectedProject = data.projects.find(
                            (p) => p.project_id === selectedId,
                          );

                          if (selectedProject) {
                            onUpdate$("projectId", selectedId);
                            onUpdate$("clientName", selectedProject.name);
                            // Also update clientId when selecting a project
                            if (selectedProject.client_id) {
                              onUpdate$("clientId", selectedProject.client_id);
                            }
                          }
                        }}
                        class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800 dark:disabled:text-gray-400"
                      >
                        <option value="">
                          {!isEditing && !project.clientId
                            ? "Select a client first..."
                            : project.clientId
                              ? "Select a project..."
                              : "Select a project (or client first)..."}
                        </option>
                        {project.clientId && (
                          <option
                            value="__new__"
                            class="font-semibold text-blue-600"
                          >
                            + Create New Project
                          </option>
                        )}
                        {filteredProjects && filteredProjects.length > 0
                          ? filteredProjects.map((proj) => (
                              <option
                                key={proj.project_id}
                                value={proj.project_id}
                              >
                                {proj.name}
                              </option>
                            ))
                          : project.clientId && (
                              <option disabled>
                                No projects found for this client
                              </option>
                            )}
                      </select>
                    </div>
                  );
                }}
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

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role for this Project
              </label>
              <Resource
                value={rolesResource}
                onPending={() => (
                  <select
                    disabled
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>Loading roles...</option>
                  </select>
                )}
                onRejected={(error) => (
                  <div class="text-sm text-red-600 dark:text-red-400">
                    Error loading roles: {error.message}
                  </div>
                )}
                onResolved={(rolesData) => (
                  <select
                    value={project.role || userRole || ""}
                    onChange$={(e) => {
                      const selectedRole = (e.target as HTMLSelectElement)
                        .value;
                      onUpdate$("role", selectedRole);
                    }}
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select a role...</option>
                    {rolesData.roles && rolesData.roles.length > 0 ? (
                      rolesData.roles.map((role) => (
                        <option key={role.role_id} value={role.role_name}>
                          {role.role_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No roles found</option>
                    )}
                  </select>
                )}
              />
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
      </>
    );
  },
);
