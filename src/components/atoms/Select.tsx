import { component$, Slot, type QwikIntrinsicElements } from "@builder.io/qwik";

/**
 * Select variant types for different UI contexts
 */
export type SelectVariant =
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
 * Select size options
 */
export type SelectSize = "xs" | "sm" | "md" | "lg";

/**
 * Props interface for the Select component
 */
interface SelectProps extends Omit<QwikIntrinsicElements["select"], "size"> {
  variant?: SelectVariant;
  size?: SelectSize;
  error?: string;
  label?: string;
  helper?: string;
  placeholder?: string;
}

/**
 * Reusable Select atom component
 * Uses daisyUI select classes with validation support
 *
 * @example
 * <Select label="Role" error={errors.role} bind:value={formData.role}>
 *   <option value="">Select a role</option>
 *   <option value="Developer">Developer</option>
 * </Select>
 */
export const Select = component$<SelectProps>(
  ({
    variant = "bordered",
    size = "md",
    error,
    label,
    helper,
    placeholder,
    class: className = "",
    id,
    ...props
  }) => {
    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Build CSS classes based on props
    const baseClasses = "select w-full";
    const variantClass = `select-${variant}`;
    const sizeClass = size !== "md" ? `select-${size}` : "";
    const errorClass = error ? "select-error" : "";

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
          <label class="label" for={selectId}>
            <span class="label-text">{label}</span>
          </label>
        )}

        <select {...props} id={selectId} class={allClasses}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          <Slot />
        </select>

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
