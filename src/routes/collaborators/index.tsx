import {
  component$,
  useSignal,
  $,
  useComputed$,
  Resource,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatCard } from "~/components/molecules";
import { CollaboratorsHeader } from "~/components/molecules/collaborators/CollaboratorsHeader";
import { CollaboratorsFilters } from "~/components/molecules/collaborators/CollaboratorsFilters";
import { CollaboratorCard } from "~/components/organisms/collaborators/CollaboratorCard";
import { CollaboratorDetailModal } from "~/components/organisms/collaborators/CollaboratorDetailModal";
import {
  useCollaboratorsData,
  type CollaboratorFilter,
  type CollaboratorsData,
  type CollaboratorData,
} from "~/graphql/hooks/useCollaborators";
import { DateUtils } from "~/utils";
import { exportCollaboratorsToExcel } from "~/utils/collaboratorsExport";

/**
 * Collaborators page component
 * Displays all collaborators with key statistics and detail view
 */
export default component$(() => {
  const isLoading = useSignal(false);

  // Date filters (initialized to current month)
  const startDate = useSignal(DateUtils.getMonthStart());
  const endDate = useSignal(DateUtils.getMonthEnd());
  const searchQuery = useSignal("");

  // Modal state
  const modalOpen = useSignal(false);
  const selectedCollaborator = useSignal<CollaboratorData | null>(null);

  // Store data for export
  const currentData = useSignal<CollaboratorsData | null>(null);

  const clientReady = useSignal(false);
  useVisibleTask$(() => {
    clientReady.value = true;
  });

  // Computed filter
  const filter = useComputed$(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
    } as CollaboratorFilter;
  });

  const collaboratorsResource = useCollaboratorsData(filter);

  // Handlers
  const handleExportExcel = $(async () => {
    const data = currentData.value;
    if (!data) {
      alert("No data to export. Wait for the data to load.");
      return;
    }
    isLoading.value = true;
    try {
      await exportCollaboratorsToExcel(data, startDate.value, endDate.value);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Export error. Please try again.");
    } finally {
      isLoading.value = false;
    }
  });

  const handleViewDetails = $((collaborator: CollaboratorData) => {
    selectedCollaborator.value = collaborator;
    modalOpen.value = true;
  });

  const handleCloseModal = $(() => {
    modalOpen.value = false;
    selectedCollaborator.value = null;
  });

  const handleClearFilters = $(() => {
    startDate.value = DateUtils.getMonthStart();
    endDate.value = DateUtils.getMonthEnd();
    searchQuery.value = "";
  });

  // Date range string for the modal
  const dateRangeLabel = useComputed$(() => {
    const start = new Date(startDate.value + "T00:00:00Z");
    const end = new Date(endDate.value + "T00:00:00Z");
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    };
    return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
  });

  return (
    <div class="min-h-full p-6">
      {/* Page header */}
      <CollaboratorsHeader
        isLoading={isLoading.value}
        onExportExcel$={handleExportExcel}
      />

      {/* Main content */}
      <div class="mx-auto max-w-7xl space-y-6">
        {/* Filters */}
        <CollaboratorsFilters
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery}
          onClearFilters$={handleClearFilters}
        />

        {/* Data */}
        <Resource
          value={collaboratorsResource}
          onPending={() => (
            <div class="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/50 p-12 text-center text-gray-400">
              <div class="flex flex-col items-center gap-4">
                <div class="border-t-brand-purple h-8 w-8 animate-spin rounded-full border-4 border-gray-600"></div>
                <p>Loading collaborators...</p>
              </div>
            </div>
          )}
          onRejected={(error) => (
            <div class="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              Error loading collaborators: {error.message}
            </div>
          )}
          onResolved={(data) => {
            // Store data for export
            currentData.value = data;

            // Filter collaborators by search query
            const query = searchQuery.value.toLowerCase().trim();
            const filteredCollaborators = (
              query
                ? data.collaborators.filter(
                    (c) =>
                      c.fullName.toLowerCase().includes(query) ||
                      c.email.toLowerCase().includes(query) ||
                      c.role.toLowerCase().includes(query),
                  )
                : [...data.collaborators]
            ).sort((a, b) => a.totalHours - b.totalHours);

            return (
              <>
                {/* Summary Stats */}
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Collaborators"
                    value={data.summary.totalCollaborators.toString()}
                    color="info"
                    icon="calendar"
                  />
                  <StatCard
                    title="Total Hours"
                    value={`${data.summary.totalHours}h`}
                    color="primary"
                    icon="clock"
                  />
                  <StatCard
                    title="Avg/Collaborator"
                    value={`${data.summary.avgHoursPerCollaborator}h`}
                    color="success"
                    icon="chart"
                  />
                  <StatCard
                    title="Active Projects"
                    value={data.summary.activeProjects.toString()}
                    color="warning"
                    icon="clock"
                  />
                </div>

                {/* Top 3 Contributors */}
                {data.summary.topContributors.length > 0 && (
                  <div class="rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-5 dark:border-amber-700/30 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20">
                    <div class="mb-3 flex items-center gap-2">
                      <span class="text-lg">🏆</span>
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                        Top Contributors
                      </h3>
                      <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        By hours in the selected period
                      </span>
                    </div>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {data.summary.topContributors.map((tc) => {
                        const medals = ["🥇", "🥈", "🥉"];
                        const bgColors = [
                          "from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 border-amber-300/60 dark:border-amber-600/40",
                          "from-gray-100 to-slate-50 dark:from-gray-800/40 dark:to-slate-800/30 border-gray-300/60 dark:border-gray-600/40",
                          "from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 border-orange-300/60 dark:border-orange-600/40",
                        ];
                        const initials = tc.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <div
                            key={tc.userId}
                            class={`relative cursor-pointer overflow-hidden rounded-xl border bg-gradient-to-br p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${bgColors[tc.rank - 1] || bgColors[2]}`}
                            onClick$={() => {
                              const collaborator = data.collaborators.find(
                                (c) => c.userId === tc.userId,
                              );
                              if (collaborator) {
                                selectedCollaborator.value = collaborator;
                                modalOpen.value = true;
                              }
                            }}
                          >
                            <div class="flex items-center gap-3">
                              <div class="relative">
                                <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-md">
                                  {initials}
                                </div>
                                <span class="absolute -top-1 -right-1 text-sm">
                                  {medals[tc.rank - 1]}
                                </span>
                              </div>
                              <div class="min-w-0 flex-1">
                                <p class="truncate font-bold text-gray-900 dark:text-white">
                                  {tc.fullName}
                                </p>
                                <p class="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                                  {tc.totalHours}h
                                </p>
                              </div>
                              <span class="text-2xl font-bold text-gray-300 dark:text-gray-600">
                                #{tc.rank}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Collaborator List */}
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      Team
                    </h2>
                    <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {filteredCollaborators.length}{" "}
                      {filteredCollaborators.length === 1
                        ? "collaborator"
                        : "collaborators"}
                    </span>
                  </div>

                  {filteredCollaborators.length === 0 ? (
                    <div class="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-slate-600">
                      <p class="text-gray-500 dark:text-gray-400">
                        {query
                          ? "No collaborators found matching that search criteria"
                          : "No collaborator data for the selected period"}
                      </p>
                    </div>
                  ) : (
                    <div class="space-y-3">
                      {filteredCollaborators.map((collaborator) => (
                        <CollaboratorCard
                          key={collaborator.userId}
                          collaborator={collaborator}
                          onViewDetails$={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Detail Modal - Inside Resource for reactivity */}
                <CollaboratorDetailModal
                  isOpen={modalOpen}
                  collaborator={selectedCollaborator}
                  onClose$={handleCloseModal}
                  dateRange={dateRangeLabel}
                />
              </>
            );
          }}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Collaborators - SIRME",
  meta: [
    {
      name: "description",
      content: "Team collaborators management and statistics",
    },
  ],
};
