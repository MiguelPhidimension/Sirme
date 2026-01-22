import {
  component$,
  createContextId,
  useContext,
  useStore,
  $,
  Slot,
  useVisibleTask$,
  useContextProvider,
} from "@builder.io/qwik";
import {
  LuCheck,
  LuAlertCircle,
  LuInfo,
  LuAlertTriangle,
  LuX,
} from "@qwikest/icons/lucide";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContextId<ToastContextState>("toast-context");

export const useToast = () => {
  const context = useContext(ToastContext);
  return {
    addToast: $(
      (message: string, type: ToastType = "success", duration = 3000) => {
        context.addToast(message, type, duration);
      },
    ),
    success: $((message: string, duration = 3000) =>
      context.addToast(message, "success", duration),
    ),
    error: $((message: string, duration = 4000) =>
      context.addToast(message, "error", duration),
    ),
    info: $((message: string, duration = 3000) =>
      context.addToast(message, "info", duration),
    ),
    warning: $((message: string, duration = 3000) =>
      context.addToast(message, "warning", duration),
    ),
  };
};

export const ToastProvider = component$(() => {
  const state = useStore<{ toasts: ToastMessage[] }>({
    toasts: [],
  });

  const removeToast = $((id: string) => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
  });

  const addToast = $(
    (message: string, type: ToastType = "success", duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, message, type, duration };
      state.toasts = [...state.toasts, newToast];

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
  );

  useVisibleTask$(({ track }) => {
    track(() => state.toasts);
  });

  useContextProvider(ToastContext, {
    toasts: state.toasts,
    addToast,
    removeToast,
  });

  return (
    <>
      <Slot />
      <div class="fixed top-5 right-5 z-[200] flex flex-col gap-2">
        {state.toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            class="space-x flex w-full max-w-xs items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-white p-4 text-gray-500 shadow rtl:divide-x-reverse dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-400"
            role="alert"
          >
            <div
              class={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                toast.type === "success"
                  ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                  : toast.type === "error"
                    ? "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                    : toast.type === "warning"
                      ? "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
                      : "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200"
              }`}
            >
              {toast.type === "success" && <LuCheck />}
              {toast.type === "error" && <LuAlertCircle />}
              {toast.type === "warning" && <LuAlertTriangle />}
              {toast.type === "info" && <LuInfo />}
            </div>
            <div class="ps-3 text-sm font-normal">{toast.message}</div>
            <button
              type="button"
              class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick$={() => removeToast(toast.id)}
              aria-label="Close"
            >
              <LuX />
            </button>
          </div>
        ))}
      </div>
    </>
  );
});
