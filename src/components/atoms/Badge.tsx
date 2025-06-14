import React from 'react';

/**
 * Badge variant types for different UI contexts
 */
export type BadgeVariant = 
  | 'neutral' 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'ghost' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

/**
 * Badge size options
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Props interface for the Badge component
 */
interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable Badge atom component
 * Perfect for role indicators, status displays, and labels
 * 
 * @example
 * <Badge variant="primary" size="sm">
 *   MuleSoft Developer
 * </Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  outline = false,
  className = '',
  children
}) => {
  // Build CSS classes based on props
  const baseClasses = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = size !== 'md' ? `badge-${size}` : '';
  const outlineClass = outline ? 'badge-outline' : '';
  
  const allClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    outlineClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      {children}
    </div>
  );
}; 