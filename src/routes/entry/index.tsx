import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  DateSelector,
  EmployeeInfo,
  TimeEntryActions,
} from "~/components/molecules";
import { ProjectList } from "~/components/organisms";

interface ProjectData {
  clientName: string;
  hours: number;
  isMPS: boolean;
  notes: string;
}

/**
 * Time entry page component - Refactored with modular components
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const selectedDate = useSignal(new Date().toISOString().split("T")[0]);

  // Form data
  const formData = useStore({
    employeeName: "",
    date: selectedDate.value,
    role: "Other" as const,
    projects: [
      {
        clientName: "",
        hours: 0,
        isMPS: false,
        notes: "",
      },
    ] as ProjectData[],
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    isLoading.value = true;
    try {
      console.log("Submitting time entry:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to submit time entry:", error);
    } finally {
      isLoading.value = false;
    }
  });

  // Handle cancel
  const handleCancel = $(() => {
    window.location.href = "/";
  });

  // Add project
  const addProject = $(() => {
    formData.projects.push({
      clientName: "",
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
        {/* Date Selection */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* Employee Information */}
        <EmployeeInfo
          employeeName={formData.employeeName}
          role={formData.role}
          onNameChange={$((name) => {
            formData.employeeName = name;
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
