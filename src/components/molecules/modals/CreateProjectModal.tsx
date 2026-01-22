import {
  component$,
  useSignal,
  $,
  type QRL,
  useResource$,
  Resource,
} from "@builder.io/qwik";
import { graphqlClient } from "~/graphql/client";
import { useToast } from "~/components/providers/ToastProvider";

interface ClientData {
  client_id: string;
  name: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose$: QRL<() => void>;
  onProjectCreated$: QRL<(projectId: string, projectName: string) => void>;
}

/**
 * CreateProjectModal - Inline collapsible panel for creating new projects
 * Includes all project fields: name, client, description, dates
 */
export const CreateProjectModal = component$<CreateProjectModalProps>(
  ({ isOpen, onClose$, onProjectCreated$ }) => {
    // Load clients directly using graphqlClient
    const clientsResource = useResource$<ClientData[]>(async () => {
      try {
        const GET_CLIENTS_QUERY = `
          query GetClients {
            clients {
              client_id
              name
            }
          }
        `;

        const data = await graphqlClient.request<{ clients: ClientData[] }>(
          GET_CLIENTS_QUERY,
        );
        console.log("✅ Clients loaded:", data.clients);
        return data.clients || [];
      } catch (error) {
        console.error("❌ Error loading clients:", error);
        throw error;
      }
    });

    // Form state
    const formData = useSignal({
      name: "",
      client_id: "",
      description: "",
      start_date: "",
      end_date: "",
    });

    const isSubmitting = useSignal(false);
    const toast = useToast();

    // Handle form submission
    const handleSubmit = $(async () => {
      // Validation
      if (!formData.value.name.trim()) {
        toast.error("Project name is required");
        return;
      }

      if (!formData.value.client_id) {
        toast.error("Please select a client");
        return;
      }

      isSubmitting.value = true;

      try {
        const CREATE_PROJECT_MUTATION = `
          mutation CreateProject(
            $name: String!
            $client_id: uuid
            $description: String
            $start_date: date
            $end_date: date
          ) {
            insert_projects_one(object: {
              name: $name
              client_id: $client_id
              description: $description
              start_date: $start_date
              end_date: $end_date
            }) {
              project_id
              name
              client_id
              description
              start_date
              end_date
              created_at
              updated_at
            }
          }
        `;

        const result = await graphqlClient.request<{
          insert_projects_one: {
            project_id: string;
            name: string;
          };
        }>(CREATE_PROJECT_MUTATION, {
          name: formData.value.name.trim(),
          client_id: formData.value.client_id,
          description: formData.value.description.trim() || null,
          start_date: formData.value.start_date || null,
          end_date: formData.value.end_date || null,
        });

        const newProject = result.insert_projects_one;

        if (newProject) {
          // Reset form
          formData.value = {
            name: "",
            client_id: "",
            description: "",
            start_date: "",
            end_date: "",
          };

          // Notify parent component
          await onProjectCreated$(newProject.project_id, newProject.name);

          toast.success("Project created successfully");

          // Close modal
          await onClose$();
        }
      } catch (err) {
        console.error("Error creating project:", err);
        toast.error("Failed to create project. Please try again.");
      } finally {
        isSubmitting.value = false;
      }
    });

    // Handle cancel
    const handleCancel = $(async () => {
      // Reset form
      formData.value = {
        name: "",
        client_id: "",
        description: "",
        start_date: "",
        end_date: "",
      };
      await onClose$();
    });

    if (!isOpen) {
      return null;
    }

    return (
      <div class="mb-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:border-blue-800 dark:from-slate-800 dark:to-slate-900">
        {/* Header */}
        <div class="border-b border-blue-200 bg-white/50 px-6 py-4 backdrop-blur-sm dark:border-blue-800 dark:bg-slate-900/50">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Project
              </h2>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Fill in the details to create a new project
              </p>
            </div>
            <button
              type="button"
              onClick$={handleCancel}
              class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200"
              title="Close"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div class="px-6 py-6">
          <div class="space-y-5">
            {/* Project Name */}
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.value.name}
                onInput$={(e) =>
                  (formData.value = {
                    ...formData.value,
                    name: (e.target as HTMLInputElement).value,
                  })
                }
                placeholder="Enter project name"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                required
              />
            </div>

            {/* Client Selection */}
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client <span class="text-red-500">*</span>
              </label>
              <Resource
                value={clientsResource}
                onPending={() => (
                  <select
                    disabled
                    class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-500 dark:border-slate-600 dark:bg-slate-700"
                  >
                    <option>Loading clients...</option>
                  </select>
                )}
                onRejected={(error) => (
                  <div class="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Error loading clients: {error.message}
                  </div>
                )}
                onResolved={(clients) => (
                  <select
                    value={formData.value.client_id}
                    onChange$={(e) =>
                      (formData.value = {
                        ...formData.value,
                        client_id: (e.target as HTMLSelectElement).value,
                      })
                    }
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    <option value="">Select a client...</option>
                    {clients.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={formData.value.description}
                onInput$={(e) =>
                  (formData.value = {
                    ...formData.value,
                    description: (e.target as HTMLTextAreaElement).value,
                  })
                }
                placeholder="Enter project description (optional)"
                rows={3}
                class="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Date Range */}
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Start Date */}
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.value.start_date}
                  onInput$={(e) =>
                    (formData.value = {
                      ...formData.value,
                      start_date: (e.target as HTMLInputElement).value,
                    })
                  }
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.value.end_date}
                  onInput$={(e) =>
                    (formData.value = {
                      ...formData.value,
                      end_date: (e.target as HTMLInputElement).value,
                    })
                  }
                  min={formData.value.start_date}
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="flex justify-end gap-3 border-t border-blue-200 bg-white/50 px-6 py-4 backdrop-blur-sm dark:border-blue-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick$={handleCancel}
            disabled={isSubmitting.value}
            class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={isSubmitting.value}
            class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting.value ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    );
  },
);
