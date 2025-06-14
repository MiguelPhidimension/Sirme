import React from 'react';

/**
 * CardHeader Atom Component
 * 
 * A reusable card header with consistent transparent styling.
 * Can be used standalone or within Card components.
 * 
 * @example
 * <CardHeader title="Project Details" />
 * 
 * @example
 * <CardHeader 
 *   title="Add New Project" 
 *   icon={<PlusIcon />}
 *   showBorder={true}
 *   className="p-6"
 * />
 */

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  showBorder?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = '',
  showBorder = false,
  titleClassName = '',
  subtitleClassName = ''
}) => {
  // Base header styling with transparent background
  const baseClasses = 'bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm';
  
  // Border styling when separator is needed
  const borderClasses = showBorder ? 'border-b border-white/20 dark:border-slate-600/20' : '';
  
  // Default padding if no custom className provided
  const paddingClasses = className.includes('p-') || className.includes('px-') || className.includes('py-') ? '' : 'p-4';
  
  // Combine all classes
  const headerClasses = `${baseClasses} ${borderClasses} ${paddingClasses} ${className}`;
  
  // Default title styling
  const defaultTitleClasses = 'text-xl font-bold text-gray-900 dark:text-white';
  const finalTitleClasses = titleClassName || defaultTitleClasses;
  
  // Default subtitle styling
  const defaultSubtitleClasses = 'text-sm text-gray-600 dark:text-gray-400 mt-1';
  const finalSubtitleClasses = subtitleClassName || defaultSubtitleClasses;
  
  return (
    <div className={headerClasses}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className={finalTitleClasses}>
              {title}
            </h3>
            {subtitle && (
              <p className={finalSubtitleClasses}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}; 