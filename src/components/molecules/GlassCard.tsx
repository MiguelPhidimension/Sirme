import React from 'react';
import { Card } from '../atoms/Card';
import { CardHeader } from '../atoms/CardHeader';

/**
 * GlassCard Molecule Component
 * 
 * A complete card component that combines Card and CardHeader atoms.
 * Provides a consistent glass-morphism design with optional header.
 * 
 * @example
 * <GlassCard title="Project Details">
 *   <div className="p-6">Card content here</div>
 * </GlassCard>
 * 
 * @example
 * <GlassCard 
 *   title="Add New Project"
 *   subtitle="Fill in the details below"
 *   icon={<PlusIcon />}
 *   headerActions={<Button>Save</Button>}
 *   showHeaderBorder={true}
 * >
 *   <div className="p-6">Form content here</div>
 * </GlassCard>
 */

interface GlassCardProps {
  // Card props
  children: React.ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: () => void;
  
  // Header props (optional)
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  showHeaderBorder?: boolean;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  shadow = 'lg',
  rounded = '2xl',
  onClick,
  title,
  subtitle,
  icon,
  headerActions,
  showHeaderBorder = false,
  headerClassName = '',
  titleClassName = '',
  subtitleClassName = ''
}) => {
  return (
    <Card 
      className={`overflow-hidden ${className}`}
      shadow={shadow}
      rounded={rounded}
      onClick={onClick}
    >
      {title && (
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          showBorder={showHeaderBorder}
          className={headerClassName}
          titleClassName={titleClassName}
          subtitleClassName={subtitleClassName}
        >
          {headerActions}
        </CardHeader>
      )}
      {children}
    </Card>
  );
}; 