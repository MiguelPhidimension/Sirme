import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
  useContext,
  QRL,
} from "@builder.io/qwik";
import { LuX } from "@qwikest/icons/lucide";
import {
  // DateSelector,
  EmployeeInfo,
  TimeEntryActions,
} from "~/components/molecules";
import { ProjectList } from "~/components/organisms";
import {
  useCreateTimeEntry,
  useGetTimeEntryById,
  useUpdateTimeEntry,
} from "~/graphql/hooks/useTimeEntries";
import { AuthContext } from "~/components/providers/AuthProvider";
import { useToast } from "~/components/providers/ToastProvider";

interface LocalProjectData {
  clientId?: string;
  clientName: string;
  projectId?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
  role?: string;
  time_entry_id?: string;
}

interface TimeEntryModalProps {
  isOpen: boolean;
  date?: string;
  entryId?: string | string[];
  selectedDates?: string[]; // Multiple dates from drag selection
  onClose$: QRL<() => void>;
  onSuccess$: QRL<() => void>;
}

export const TimeEntryModal = component$<TimeEntryModalProps>((props) => {
  // Get authentication context
  const authContext = useContext(AuthContext);
  const toast = useToast();

  // State management
  const isLoading = useSignal(props.isOpen);
  const isMultiUserEdit = useSignal(false);
  const selectedDate = useSignal(
    props.date || new Date().toISOString().split("T")[0],
  );

  // Get hooks
  const createTimeEntry = useCreateTimeEntry();
  const getTimeEntryById = useGetTimeEntryById();
  const updateTimeEntry = useUpdateTimeEntry();

  // Form data
  const formData = useStore({
    employeeName: "",
    employeeId: "",
    date: selectedDate.value,
    role: "" as string,
    projects: [
      {
        clientName: "",
        projectId: "",
        hours: 0,
        isMPS: false,
        notes: "",
      },
    ] as LocalProjectData[],
    isPTO: false,
  });

  // Load user data from auth context
  useVisibleTask$(({ track }) => {
    track(() => authContext.user);

    if (authContext.user) {
      formData.employeeName = `${authContext.user.first_name} ${authContext.user.last_name}`;
      formData.employeeId = authContext.user.user_id;
    }
  });

  // Reset form when modal opens or props change
  useVisibleTask$(async ({ track }) => {
    track(() => props.isOpen);
    track(() => props.entryId);
    track(() => props.date);

    if (!props.isOpen) return;

    // Set loading state
    isLoading.value = true;

    // Set date
    if (props.date) {
      selectedDate.value = props.date;
      formData.date = props.date;
    }

    // Reset projects if creating new
    if (!props.entryId) {
      formData.projects = [
        {
          clientId: "",
          clientName: "",
          projectId: "",
          hours: 0,
          isMPS: false,
          notes: "",
        },
      ];

      // Ensure user info is set if available
      if (authContext.user) {
        formData.employeeName = `${authContext.user.first_name} ${authContext.user.last_name}`;
        formData.employeeId = authContext.user.user_id;
      }

      // Finish loading for new entry
      isLoading.value = false;
    }

    // Load existing entry data if editing
    if (props.entryId) {
      try {
        const entryIds = Array.isArray(props.entryId)
          ? props.entryId
          : [props.entryId];
        let allProjects: any[] = [];
        let entryUser = null;
        let entryDate = null;
        let entryRole = "";
        let isPTO = false;
        const userIds = new Set<string>();
        for (const id of entryIds) {
          const entry = await getTimeEntryById(id);
          if (entry) {
            entryDate = entry.entry_date;
            isPTO = isPTO || entry.is_pto;
            if (entry.user) {
              entryUser = entry.user;
              // Some user objects returned from the API don't include the user_id field,
              // but the parent `entry` always has `user_id`. Prefer the explicit id when available.
              const resolvedUserId = (entry.user as any).user_id || entry.user_id;
              if (resolvedUserId) userIds.add(resolvedUserId);
              // Ensure entryUser has the id for downstream use
              (entryUser as any).user_id = resolvedUserId;
              entryRole = (entry.user as any).role?.role_name || entryRole;
            }
            // Fallback to time entry user_id if user object missing
            if (!entry.user && entry.user_id) userIds.add(entry.user_id);
            if (
              entry.time_entry_projects &&
              entry.time_entry_projects.length > 0
            ) {
              allProjects = allProjects.concat(
                entry.time_entry_projects.map((p: any) => ({
                  clientId: p.project?.client_id || "",
                  clientName: p.project?.client?.name || "",
                  projectId: p.project_id,
                  hours: p.hours_reported,
                  isMPS: p.is_mps,
                  notes: p.notes || "",
                  role: p.role || "",
                  time_entry_id: p.time_entry_id,
                })),
              );
            }
          }
        }
        if (entryUser) {
          formData.employeeName = `${entryUser.first_name} ${entryUser.last_name}`;
          formData.employeeId = entryUser.user_id;
          formData.role = entryRole;
        }
        // If multiple distinct user ids are present, mark as multi-user edit
        if (userIds.size > 1) {
          isMultiUserEdit.value = true;
          toast.error(
            "Cannot edit entries for multiple employees at once. Open each employee's entry separately.",
          );
        } else {
          isMultiUserEdit.value = false;
        }
        if (entryDate) {
          formData.date = entryDate;
          selectedDate.value = entryDate;
        }
        formData.isPTO = isPTO;
        formData.projects = allProjects;
      } catch (error) {
        console.error("Error loading entry:", error);
        toast.error("Error loading entry details");
      } finally {
        isLoading.value = false;
      }
    }
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    // Use the selected employee ID, or fall back to authenticated user
    console.log(authContext.user);
    const userId = formData.employeeId || authContext.user?.user_id;

    // Validate user is selected
    console.log({userId});
    if (!userId) {
      toast.error("You must select an employee to log hours");
      return;
    }

    // Validate projects or PTO
    if (!formData.isPTO) {
      const invalidProjects = formData.projects.filter(
        (p) => !p.projectId || p.hours <= 0,
      );
      if (invalidProjects.length > 0) {
        toast.error(
          "All projects must have a client/project selected and hours greater than 0",
        );
        return;
      }
    }

    isLoading.value = true;

    try {
      // Get dates to save to (either selected range or single date)
      const datesToSave =
        props.selectedDates && props.selectedDates.length > 0
          ? props.selectedDates
          : [formData.date];

      console.log(
        `📅 Saving time entry to ${datesToSave.length} date(s):`,
        datesToSave,
      );

      // Save entry for each date in the range
      for (const dateToSave of datesToSave) {
        // If editing multiple entries, update each one separately
        if (Array.isArray(props.entryId)) {
          for (const eid of props.entryId) {
            const timeEntryData = {
              time_entry_id: eid,
              user_id: userId,
              entry_date: dateToSave,
              is_pto: formData.isPTO || false,
              projects: !formData.isPTO
                ? formData.projects
                    .filter((p) => p.time_entry_id === eid || !p.time_entry_id)
                    .map((project) => ({
                      project_id: project.projectId!,
                      hours_reported: project.hours,
                      is_mps: project.isMPS,
                      notes: project.notes || "",
                      role: project.role || formData.role,
                    }))
                : [],
            };
            console.log(
              `Submitting time entry for ${dateToSave} (edit ${eid}):`,
              timeEntryData,
            );
            await updateTimeEntry(timeEntryData);
          }
        } else {
          const timeEntryData = {
            time_entry_id: props.entryId || undefined,
            user_id: userId,
            entry_date: dateToSave,
            is_pto: formData.isPTO || false,
            projects: !formData.isPTO
              ? formData.projects.map((project) => ({
                  project_id: project.projectId!,
                  hours_reported: project.hours,
                  is_mps: project.isMPS,
                  notes: project.notes || "",
                  role: project.role || formData.role,
                }))
              : [],
          };
          console.log(
            `Submitting time entry for ${dateToSave}:`,
            timeEntryData,
          );
          if (props.entryId && dateToSave === formData.date) {
            await updateTimeEntry(timeEntryData);
          } else {
            await createTimeEntry(timeEntryData);
          }
        }
      }

      // Show success message after all entries are saved
      if (props.entryId) {
        toast.success("Time entry updated successfully!");
      } else if (datesToSave.length > 1) {
        toast.success(`Time entries created for ${datesToSave.length} days!`);
      } else {
        toast.success("Time entry created successfully!");
      }

      // Close modal and refresh immediately
      props.onSuccess$();
      props.onClose$();
    } catch (error) {
      console.error("Failed to submit time entry:", error);
      toast.error(
        error instanceof Error ? error.message : "Error saving time entry",
      );
    } finally {
      isLoading.value = false;
    }
  });

  const closeModal = $(() => {
    props.onClose$();
  });

  // Add project
  const addProject = $(() => {
    formData.projects.push({
      clientName: "",
      projectId: "",
      hours: 0,
      isMPS: false,
      notes: "",
    });
  });

  // Remove project
  const removeProject = $((index: number) => {
    formData.projects.splice(index, 1);
  });

  // Handle date change
  // const handleDateChange = $((date: string) => {
  //   selectedDate.value = date;
  //   formData.date = date;
  // });

  // Handle project updates
  const handleProjectUpdate = $(
    (
      index: number,
      field: keyof LocalProjectData,
      value: string | number | boolean,
    ) => {
      formData.projects[index][field] = value as never;
    },
  );

  // Calculate total hours
  const totalHours = formData.projects.reduce(
    (sum, project) => sum + (Number(project.hours) || 0),
    0,
  );

  if (!props.isOpen) return null;

  return (
    <div class="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
        onClick$={closeModal}
      ></div>

      {/* Modal Content */}
      <div class="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-t-3xl bg-white shadow-2xl transition-all sm:rounded-3xl dark:bg-slate-900">
        {/* Header - Fixed */}
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {props.entryId ? "Edit Entry" : "New Entry"}
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {props.entryId
                ? "Update your time entry details"
                : props.selectedDates && props.selectedDates.length > 1
                  ? `Record activities for ${props.selectedDates.length} days`
                  : "Record your daily activities"}
            </p>
            {props.selectedDates && props.selectedDates.length > 1 && (
              <div class="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1.5">
                <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  🗓️ {props.selectedDates.length} days selected
                </span>
              </div>
            )}
          </div>
          <button
            onClick$={closeModal}
            class="rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-slate-800 dark:hover:text-gray-300"
          >
            <LuX class="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div class="custom-scrollbar flex-1 overflow-y-auto p-6 sm:p-8">
          <div class="space-y-8">
            {/* Date Selection */}
            {/* <div class="grid gap-6 md:grid-cols-2">
              <div class="md:col-span-2">
                <DateSelector
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
              </div>
            </div> */}

            {/* Employee Information */}
            <EmployeeInfo
              employeeName={formData.employeeName}
              employeeId={formData.employeeId}
              role={formData.role}
              disabled={isLoading.value}
              onNameChange={$((name) => {
                formData.employeeName = name;
              })}
              onEmployeeIdChange={$((userId) => {
                formData.employeeId = userId;
              })}
              onRoleChange={$((role) => {
                formData.role = role as any;
              })}
            />

            <div class="border-t border-gray-100 pt-6 dark:border-slate-800">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Projects and Activities
                </h3>
                <label class="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPTO}
                    onChange$={(e) => {
                      formData.isPTO = (e.target as HTMLInputElement).checked;
                      // Clear projects if PTO is selected
                      if (formData.isPTO) {
                        formData.projects = [];
                      } else if (formData.projects.length === 0) {
                        formData.projects = [
                          {
                            clientId: "",
                            clientName: "",
                            projectId: "",
                            hours: 0,
                            isMPS: false,
                            notes: "",
                          },
                        ];
                      }
                    }}
                    class="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    PTO (Personal Time Off)
                  </span>
                </label>
              </div>

              {!formData.isPTO && (
                <ProjectList
                  projects={formData.projects}
                  totalHours={totalHours}
                  userRole={formData.role}
                  isEditing={!!props.entryId}
                  disabled={isLoading.value}
                  onAddProject$={addProject}
                  onRemoveProject$={removeProject}
                  onUpdateProject$={handleProjectUpdate}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div class="border-t border-gray-100 bg-gray-50/50 px-6 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <TimeEntryActions
            isLoading={isLoading.value}
            isDisabled={
              !formData.employeeName || (!formData.isPTO && totalHours === 0)
            }
            onCancel$={closeModal}
            onSubmit$={handleSubmit}
          />
        </div>

        {/* Loading Overlay */}
        {isLoading.value && (
          <div class="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <div class="flex flex-col items-center space-y-4">
              <div class="relative h-12 w-12">
                <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-slate-700"></div>
                <div class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500"></div>
              </div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Loading entry details...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
