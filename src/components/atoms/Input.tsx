import { component$, type QwikIntrinsicElements } from "@builder.io/qwik";

/**
 * Input variant types for different UI contexts
 */
export type InputVariant =
  | "bordered"
  | "ghost"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

/**
 * Input size options
 */
export type InputSize = "xs" | "sm" | "md" | "lg";

/**
 * Props interface for the Input component
 */
interface InputProps extends Omit<QwikIntrinsicElements["input"], "size"> {
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  label?: string;
  helper?: string;
}

/**
 * Reusable Input atom component
 * Uses daisyUI input classes with validation support
 *
 * @example
 * <Input
 *   label="Employee Name"
 *   placeholder="Enter your name"
 *   error={errors.employeeName}
 *   bind:value={formData.employeeName}
 * />
 */
export const Input = component$<InputProps>(
  ({
    variant = "bordered",
    size = "md",
    error,
    label,
    helper,
    class: className = "",
    id,
    ...props
  }) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Build CSS classes based on props
    const baseClasses = "input w-full";
    const variantClass = `input-${variant}`;
    const sizeClass = size !== "md" ? `input-${size}` : "";
    const errorClass = error ? "input-error" : "";

    const allClasses = [
      baseClasses,
      variantClass,
      sizeClass,
      errorClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div class="form-control w-full">
        {label && (
          <label class="label" for={inputId}>
            <span class="label-text">{label}</span>
          </label>
        )}

        <input {...props} id={inputId} class={allClasses} />

        {(error || helper) && (
          <label class="label">
            {error && <span class="label-text-alt text-error">{error}</span>}
            {helper && !error && (
              <span class="label-text-alt text-base-content/60">{helper}</span>
            )}
          </label>
        )}
      </div>
    );
  },
);
