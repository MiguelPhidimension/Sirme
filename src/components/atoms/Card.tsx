import React from 'react';

/**
 * Card Atom Component
 * 
 * A reusable card container with modern glass-morphism styling.
 * Uses semi-transparent backgrounds with backdrop blur for a modern look.
 * 
 * @example
 * <Card>
 *   <div>Card content goes here</div>
 * </Card>
 * 
 * @example
 * <Card className="p-6" shadow="xl">
 *   <h2>Custom Card</h2>
 * </Card>
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = 'lg',
  rounded = '2xl',
  onClick
}) => {
  // Base glass-morphism styling
  const baseClasses = 'bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm border border-white/20 dark:border-slate-600/20 transition-all duration-200';
  
  // Shadow variations
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md', 
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl'
  };
  
  // Rounded variations
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg', 
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${className}`;
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}; 