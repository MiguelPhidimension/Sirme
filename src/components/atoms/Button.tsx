import React, { ButtonHTMLAttributes } from 'react';

/**
 * Button variant types for different UI contexts
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'ghost' 
  | 'link' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

/**
 * Button size options
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Props interface for the Button component
 */
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  wide?: boolean;
  circle?: boolean;
  square?: boolean;
  glass?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

/**
 * Reusable Button atom component
 * Uses daisyUI button classes for consistent styling
 * 
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  outline = false,
  wide = false,
  circle = false,
  square = false,
  glass = false,
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  // Build CSS classes based on props
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const outlineClass = outline ? 'btn-outline' : '';
  const wideClass = wide ? 'btn-wide' : '';
  const circleClass = circle ? 'btn-circle' : '';
  const squareClass = square ? 'btn-square' : '';
  const glassClass = glass ? 'glass' : '';
  const loadingClass = loading ? 'loading' : '';
  
  const allClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    outlineClass,
    wideClass,
    circleClass,
    squareClass,
    glassClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      {...props}
      className={allClasses}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
}; 