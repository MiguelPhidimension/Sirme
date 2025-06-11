import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TimeEntryForm } from "~/components/organisms";

/**
 * Time entry page component
 * Provides interface for adding and editing time entries
 */
export default component$(() => {
  // State management
  const isLoading = useSignal(false);
  const mode = useSignal<'daily' | 'weekly'>('daily');

  // Sample initial data for editing (would come from URL params in real app)
  const initialData = useStore({
    date: new Date().toISOString().split('T')[0],
    employee: {
      name: 'John Doe',
      id: 'emp-001'
    },
    projects: [
      {
        projectCode: '',
        projectName: '',
        hours: 0,
        description: ''
      }
    ],
    totalHours: 0,
    isSubmitted: false
  });

  // Handle form submission
  const handleSubmit = $(async (formData: any) => {
    isLoading.value = true;
    
    try {
      // Simulate API call
      console.log('Submitting time entry:', formData);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to submit time entry:', error);
      // TODO: Show error message to user
    } finally {
      isLoading.value = false;
    }
  });

  // Handle form cancellation
  const handleCancel = $(() => {
    // Navigate back to dashboard
    window.location.href = '/';
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Floating Navigation */}
      <div class="fixed top-6 left-6 z-50">
        <button 
          class="flex items-center space-x-2 px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick$={handleCancel}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold">Back to Dashboard</span>
        </button>
      </div>

      {/* Modern Mode Toggle */}
      <div class="fixed top-6 right-6 z-50">
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20 shadow-lg p-1">
          <div class="flex space-x-1">
            <button 
              class={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                mode.value === 'daily' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
              onClick$={() => mode.value = 'daily'}
            >
              Daily
            </button>
            <button 
              class={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                mode.value === 'weekly' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
              onClick$={() => mode.value = 'weekly'}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Modern Instructions Banner */}
      <div class="pt-24 pb-8">
        <div class="max-w-4xl mx-auto px-6">
          <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Time Entry Instructions</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Enter your work hours for each project with precision and ease. You can add multiple projects for the same day. 
                  All fields are required for submission. Use the intuitive interface to track your time efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Entry Form */}
      <TimeEntryForm
        mode={mode.value}
        initialData={initialData}
        onSubmit$={handleSubmit}
        onCancel$={handleCancel}
        isLoading={isLoading.value}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Time Entry - Time Tracking",
  meta: [
    {
      name: "description",
      content: "Add or edit time tracking entries for projects and tasks with a modern, intuitive interface",
    },
  ],
}; 