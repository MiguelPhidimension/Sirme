import React from 'react';
import { DataUtils } from '~/utils';

/**
 * Props interface for StatCard component
 */
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: 'clock' | 'calendar' | 'user' | 'chart';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  // Alternative trend format for backward compatibility
  change?: number;
  period?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  format?: 'hours' | 'percentage' | 'number' | 'text';
}

/**
 * StatCard Molecule Component
 * Displays statistical information with optional icons and trends
 * Perfect for dashboard summaries and key metrics
 * 
 * @example
 * <StatCard 
 *   title="Today's Hours"
 *   value={8.5}
 *   format="hours"
 *   icon="clock"
 *   color="primary"
 * />
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  change,
  period,
  color = 'primary',
  format = 'text'
}) => {
  // Format the value based on the specified format
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'hours':
        return DataUtils.formatHours(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return val.toLocaleString();
      default:
        return val.toString();
    }
  };

  // Get icon SVG based on type
  const getIcon = (iconType: string) => {
    const iconMap = {
      clock: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      calendar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      user: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      chart: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    };
    return iconMap[iconType as keyof typeof iconMap] || null;
  };

  // Determine trend display - support both formats
  const getTrendDisplay = () => {
    if (trend) {
      return {
        value: trend.value,
        isPositive: trend.isPositive,
        label: `${Math.abs(trend.value).toFixed(1)}%`
      };
    } else if (change !== undefined) {
      return {
        value: change,
        isPositive: change >= 0,
        label: `${Math.abs(change).toFixed(1)}% ${period || ''}`
      };
    }
    return null;
  };

  const trendDisplay = getTrendDisplay();

  return (
    <div className="stats shadow bg-base-100 border border-base-200">
      <div className="stat">
        <div className="stat-figure text-secondary">
          {icon && (
            <div className={`text-${color}`}>
              {getIcon(icon)}
            </div>
          )}
        </div>
        
        <div className="stat-title text-base-content/60">
          {title}
        </div>
        
        <div className={`stat-value text-${color}`}>
          {formatValue(value)}
        </div>
        
        {subtitle && (
          <div className="stat-desc text-base-content/50">
            {subtitle}
          </div>
        )}
        
        {trendDisplay && (
          <div className={`stat-desc ${trendDisplay.isPositive ? 'text-success' : 'text-error'}`}>
            <div className="flex items-center gap-1">
              {trendDisplay.isPositive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              <span>{trendDisplay.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 