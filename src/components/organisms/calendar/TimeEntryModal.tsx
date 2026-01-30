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
}

interface TimeEntryModalProps {
  isOpen: boolean;
  date?: string;
  entryId?: string;
  onClose$: QRL<() => void>;
  onSuccess$: QRL<() => void>;
}

export const TimeEntryModal = component$<TimeEntryModalProps>((props) => {
  // Get authentication context
  const authContext = useContext(AuthContext);
  const toast = useToast();

  // State management
  const isLoading = useSignal(props.isOpen);
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
        const entry = await getTimeEntryById(props.entryId);
        if (entry) {
          formData.date = entry.entry_date;
          selectedDate.value = entry.entry_date;

          // Set employee info from entry
          if (entry.user) {
            formData.employeeName = `${entry.user.first_name} ${entry.user.last_name}`;
            formData.employeeId = entry.user_id;
            if (entry.user.role?.role_name) {
              formData.role = entry.user.role.role_name;
            }
          }

          if (
            entry.time_entry_projects &&
            entry.time_entry_projects.length > 0
          ) {
            formData.projects = entry.time_entry_projects.map((p: any) => ({
              clientId: p.project?.client_id || "",
              clientName: p.project?.client?.name || "",
              projectId: p.project_id,
              hours: p.hours_reported,
              isMPS: p.is_mps,
              notes: p.notes || "",
            }));
          }
        }
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
    const userId = formData.employeeId || authContext.user?.user_id;

    // Validate user is selected
    if (!userId) {
      toast.error("You must select an employee to log hours");
      return;
    }

    // Validate projects have valid IDs
    const invalidProjects = formData.projects.filter(
      (p) => !p.projectId || p.hours <= 0,
    );
    if (invalidProjects.length > 0) {
      toast.error(
        "All projects must have a client/project selected and hours greater than 0",
      );
      return;
    }

    isLoading.value = true;

    try {
      // Prepare time entry data
      const timeEntryData = {
        time_entry_id: props.entryId || undefined,
        user_id: userId,
        entry_date: formData.date,
        projects: formData.projects.map((project) => ({
          project_id: project.projectId!,
          hours_reported: project.hours,
          is_mps: project.isMPS,
          notes: project.notes || "",
        })),
      };

      console.log("Submitting time entry:", timeEntryData);

      if (props.entryId) {
        // Update existing entry
        await updateTimeEntry(timeEntryData);
        toast.success("Time entry updated successfully!");
      } else {
        // Create new entry
        await createTimeEntry(timeEntryData);
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
                : "Record your daily activities"}
            </p>
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
              <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Projects and Activities
              </h3>
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
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div class="border-t border-gray-100 bg-gray-50/50 px-6 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <TimeEntryActions
            isLoading={isLoading.value}
            isDisabled={!formData.employeeName || totalHours === 0}
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
