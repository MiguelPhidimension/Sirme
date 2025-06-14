import React from 'react';

/**
 * Input variant types for different UI contexts
 */
export type InputVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

/**
 * Input size options
 */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Props interface for the Input component
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
 *   value={formData.employeeName}
 *   onChange={handleChange}
 * />
 */
export const Input: React.FC<InputProps> = ({
  variant = 'bordered',
  size = 'md',
  error,
  label,
  helper,
  className = '',
  id,
  ...props
}) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build CSS classes based on props
  const baseClasses = 'input w-full';
  const variantClass = `input-${variant}`;
  const sizeClass = size !== 'md' ? `input-${size}` : '';
  const errorClass = error ? 'input-error' : '';
  
  const allClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    errorClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
      )}
      
      <input 
        {...props}
        id={inputId}
        className={allClasses}
      />
      
      {(error || helper) && (
        <label className="label">
          {error && (
            <span className="label-text-alt text-error">{error}</span>
          )}
          {helper && !error && (
            <span className="label-text-alt text-base-content/60">{helper}</span>
          )}
        </label>
      )}
    </div>
  );
}; 