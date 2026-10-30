import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'indigo',
  onClick
}) => {
  const schemeStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-300'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-300'
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-300'
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-300'
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      borderHover: 'hover:border-rose-300'
    }
  };

  const style = schemeStyles[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm transition-all duration-200 ${
        onClick ? `cursor-pointer ${style.borderHover} hover:shadow-md` : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} shadow-sm shrink-0`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs">
          <span
            className={`font-semibold mr-1.5 ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
};
