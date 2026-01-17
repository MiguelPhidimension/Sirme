import {
  component$,
  useSignal,
  useStore,
  $,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
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
import { DateUtils } from "~/utils";

interface ProjectData {
  clientName: string;
  projectId?: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

/**
 * Time entry page component - Refactored with modular components
 */
export default component$(() => {
  const loc = useLocation();
  // Get authentication context
  const authContext = useContext(AuthContext);

  // State management
  const isLoading = useSignal(false);
  const selectedDate = useSignal(
    loc.url.searchParams.get("date") || DateUtils.getCurrentDate(),
  );
  const entryId = useSignal(loc.url.searchParams.get("id") || "");
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
    ] as ProjectData[],
  });

  // Load user data from auth context
  useVisibleTask$(({ track }) => {
    track(() => authContext.user);

    if (authContext.user) {
      formData.employeeName = `${authContext.user.first_name} ${authContext.user.last_name}`;
      formData.employeeId = authContext.user.user_id;
    }
  });

  // Load existing entry data if editing
  useVisibleTask$(async ({ track }) => {
    track(() => entryId.value);

    if (entryId.value) {
      isLoading.value = true;
      try {
        const entry = await getTimeEntryById(entryId.value);
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
        time_entry_id: entryId.value || undefined,
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

      if (entryId.value) {
        // Update existing entry
        await updateTimeEntry(timeEntryData);
        successMessage.value = "¡Horas actualizadas exitosamente!";
      } else {
        // Create new entry
        await createTimeEntry(timeEntryData);
        successMessage.value = "¡Horas registradas exitosamente!";
      }

      // Redirect after success
      setTimeout(() => {
        window.location.href = "/calendar";
      }, 1500);
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

  // Handle cancel
  const handleCancel = $(() => {
    window.location.href = "/calendar";
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
      field: keyof ProjectData,
      value: string | number | boolean,
    ) => {
      formData.projects[index][field] = value as never;

      // If projectId is being updated, this is handled by the ProjectEntry component
    },
  );

  // Calculate total hours
  const totalHours = formData.projects.reduce(
    (sum, project) => sum + (Number(project.hours) || 0),
    0,
  );

  return (
    <div class="min-h-full p-6">
      {/* Page Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Time Entry
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Record your work hours for the day
        </p>
      </div>

      <div class="mx-auto max-w-4xl space-y-6">
        {/* Error Message */}
        {errorMessage.value && (
          <div class="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            <p class="font-medium">{errorMessage.value}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage.value && (
          <div class="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <p class="font-medium">{successMessage.value}</p>
          </div>
        )}

        {/* Date Selection */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

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

        {/* Projects List */}
        <ProjectList
          projects={formData.projects}
          totalHours={totalHours}
          onAddProject$={addProject}
          onRemoveProject$={removeProject}
          onUpdateProject$={handleProjectUpdate}
        />

        {/* Action Buttons */}
        <TimeEntryActions
          isLoading={isLoading.value}
          isDisabled={!formData.employeeName || totalHours === 0}
          onCancel$={handleCancel}
          onSubmit$={handleSubmit}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Time Entry - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Add or edit time tracking entries for projects and tasks",
    },
  ],
};
