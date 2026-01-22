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
  DateSelector,
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

interface LocalProjectData {
  clientName: string;
  projectId?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
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

  // State management
  const isLoading = useSignal(false);
  const selectedDate = useSignal(
    props.date || new Date().toISOString().split("T")[0],
  );
  const errorMessage = useSignal("");
  const successMessage = useSignal("");

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

    // Reset state
    errorMessage.value = "";
    successMessage.value = "";
    isLoading.value = false;

    // Set date
    if (props.date) {
      selectedDate.value = props.date;
      formData.date = props.date;
    }

    // Reset projects if creating new
    if (!props.entryId) {
      formData.projects = [
        {
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
    }

    // Load existing entry data if editing
    if (props.entryId) {
      isLoading.value = true;
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
        errorMessage.value = "Error loading entry details";
      } finally {
        isLoading.value = false;
      }
    }
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    errorMessage.value = "";
    successMessage.value = "";

    // Use the selected employee ID, or fall back to authenticated user
    const userId = formData.employeeId || authContext.user?.user_id;

    // Validate user is selected
    if (!userId) {
      errorMessage.value = "Debes seleccionar un empleado para registrar horas";
      return;
    }

    // Validate projects have valid IDs
    const invalidProjects = formData.projects.filter(
      (p) => !p.projectId || p.hours <= 0,
    );
    if (invalidProjects.length > 0) {
      errorMessage.value =
        "Todos los proyectos deben tener un cliente/proyecto seleccionado y horas mayores a 0";
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
        successMessage.value = "¡Horas actualizadas exitosamente!";
      } else {
        // Create new entry
        await createTimeEntry(timeEntryData);
        successMessage.value = "¡Horas registradas exitosamente!";
      }

      // Close modal and refresh after short delay
      setTimeout(() => {
        props.onSuccess$();
        props.onClose$();
      }, 1000);
    } catch (error) {
      console.error("Failed to submit time entry:", error);
      errorMessage.value =
        error instanceof Error
          ? error.message
          : "Error al guardar el registro de horas";
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
  const handleDateChange = $((date: string) => {
    selectedDate.value = date;
    formData.date = date;
  });

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
              {props.entryId ? "Editar Registro" : "Nuevo Registro"}
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {props.entryId
                ? "Actualiza la información de tus horas"
                : "Registra tus actividades del día"}
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
            {/* Error/Success Messages */}
            {(errorMessage.value || successMessage.value) && (
              <div class="space-y-4">
                {errorMessage.value && (
                  <div class="rounded-xl border border-red-100 bg-red-50 p-4 text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                    <p class="flex items-center gap-2 font-medium">
                      <span class="i-lucide-alert-circle text-lg"></span>
                      {errorMessage.value}
                    </p>
                  </div>
                )}
                {successMessage.value && (
                  <div class="rounded-xl border border-green-100 bg-green-50 p-4 text-green-800 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-300">
                    <p class="font-medium">{successMessage.value}</p>
                  </div>
                )}
              </div>
            )}

            {/* Date Selection */}
            <div class="grid gap-6 md:grid-cols-2">
              <div class="md:col-span-2">
                <DateSelector
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>

            {/* Employee Information */}
            <EmployeeInfo
              employeeName={formData.employeeName}
              employeeId={formData.employeeId}
              role={formData.role}
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
                Proyectos y Actividades
              </h3>
              <ProjectList
                projects={formData.projects}
                totalHours={totalHours}
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
      </div>
    </div>
  );
});
