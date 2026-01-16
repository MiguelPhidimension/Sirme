import { component$ } from "@builder.io/qwik";
import {
  LuClock,
  LuCalendar,
  LuUser,
  LuBarChart3,
  LuTrendingUp,
  LuTrendingDown,
} from "@qwikest/icons/lucide";
import { DataUtils } from "~/utils";

/**
 * Props interface for StatCard component
 */
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: "clock" | "calendar" | "user" | "chart";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  format?: "hours" | "percentage" | "number" | "text";
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
export const StatCard = component$<StatCardProps>(
  ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = "primary",
    format = "text",
  }) => {
    // Format the value based on the specified format
    const formatValue = (val: number | string): string => {
      if (typeof val === "string") return val;

      switch (format) {
        case "hours":
          return DataUtils.formatHours(val);
        case "percentage":
          return `${val.toFixed(1)}%`;
        case "number":
          return val.toLocaleString();
        default:
          return val.toString();
      }
    };

    // Get icon component based on type
    const getIcon = (iconType: string) => {
      const iconMap = {
        clock: <LuClock class="h-6 w-6" />,
        calendar: <LuCalendar class="h-6 w-6" />,
        user: <LuUser class="h-6 w-6" />,
        chart: <LuBarChart3 class="h-6 w-6" />,
      };
      return iconMap[iconType as keyof typeof iconMap] || null;
    };

    // Get color classes based on color prop
    const getColorClasses = () => {
      const colorMap = {
        primary: "from-blue-500 to-indigo-600 text-blue-600 dark:text-blue-400",
        secondary:
          "from-purple-500 to-pink-600 text-purple-600 dark:text-purple-400",
        accent: "from-teal-500 to-cyan-600 text-teal-600 dark:text-teal-400",
        info: "from-sky-500 to-blue-600 text-sky-600 dark:text-sky-400",
        success:
          "from-emerald-500 to-green-600 text-emerald-600 dark:text-emerald-400",
        warning:
          "from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400",
        error: "from-red-500 to-rose-600 text-red-600 dark:text-red-400",
      };
      return colorMap[color];
    };

    const colorClasses = getColorClasses();
    const [gradientClass, textColorClass] = colorClasses.split(" text-");

    return (
      <div class="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-700/20 dark:bg-slate-800/90">
        {/* Gradient background on hover */}
        <div
          class={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
        ></div>

        <div class="relative">
          <div class="mb-4 flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <h3 class={`mt-2 text-3xl font-bold text-${textColorClass}`}>
                {formatValue(value)}
              </h3>
            </div>

            {icon && (
              <div
                class={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}
              >
                <div class="text-white">{getIcon(icon)}</div>
              </div>
            )}
          </div>

          {subtitle && (
            <p class="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}

          {trend && (
            <div class="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <LuTrendingUp class="h-4 w-4 text-emerald-500" />
              ) : (
                <LuTrendingDown class="h-4 w-4 text-red-500" />
              )}
              <span
                class={`text-sm font-medium ${trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);
