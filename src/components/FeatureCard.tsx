import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  accentColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  badge,
  accentColor = 'indigo',
}) => {
  return (
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Learn more &rarr;</span>
      </div>
    </div>
  );
};
